import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User, getTier } from '@/lib/models/User';
import { EcoTransaction, ECO_POINTS } from '@/lib/models/EcoTransaction';
import { Prediction } from '@/lib/models/Prediction';

const VALID_WASTE_TYPES = ['Battery', 'E_Waste', 'General_Recyclable', 'Non_Recyclable'];

// Award eco-points for a scan or recycle action
export async function POST(req: NextRequest) {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { action, wasteType, predictionId } = await req.json();

    if (!['scan', 'recycle'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (wasteType && !VALID_WASTE_TYPES.includes(wasteType)) {
      return NextResponse.json({ error: 'Invalid waste type' }, { status: 400 });
    }

    await connectDB();

    let points = 0;
    let description = '';

    if (action === 'scan') {
      points = ECO_POINTS.scan;
      description = `Scanned and classified e-waste (${wasteType || 'unknown'})`;
    } else if (action === 'recycle') {
      if (!predictionId) {
        return NextResponse.json({ error: 'predictionId required for recycle action' }, { status: 400 });
      }

      // Check prediction exists and belongs to this user (prevents claiming other users' predictions)
      const pred = await Prediction.findOne({ _id: predictionId, userId: payload.userId });
      if (!pred) return NextResponse.json({ error: 'Prediction not found' }, { status: 404 });
      if (pred.recycled) return NextResponse.json({ error: 'Already marked as recycled' }, { status: 409 });

      const recyclePoints = ECO_POINTS.recycle as Record<string, number>;
      points = recyclePoints[wasteType] ?? ECO_POINTS.recycle.default;
      description = `Recycled ${wasteType?.replace('_', ' ')} responsibly`;

      // Mark the prediction as recycled
      pred.recycled = true;
      pred.ecoPointsAwarded = points;
      await pred.save();
    }

    // Award points to user and update tier
    const user = await User.findById(payload.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.ecoPoints += points;
    if (action === 'recycle') user.recycledCount += 1;
    if (action === 'scan') user.scanCount += 1;
    user.tier = getTier(user.ecoPoints);
    await user.save();

    // Log transaction
    await EcoTransaction.create({
      userId: user._id,
      action,
      points,
      description,
      metadata: { wasteType, predictionId },
    });

    return NextResponse.json({
      pointsAwarded: points,
      totalPoints: user.ecoPoints,
      tier: user.tier,
    });
  } catch (err) {
    console.error('[ECO-POINTS]', err);
    return NextResponse.json({ error: 'Failed to award points' }, { status: 500 });
  }
}

// GET: user points history
export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    await connectDB();

    const transactions = await EcoTransaction.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ transactions });
  } catch (err) {
    console.error('[ECO-POINTS GET]', err);
    return NextResponse.json({ error: 'Failed to fetch points history' }, { status: 500 });
  }
}
