import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Prediction } from '@/lib/models/Prediction';
import { getAuthUser } from '@/lib/auth';

const VALID_WASTE_TYPES = ['Battery', 'E_Waste', 'General_Recyclable', 'Non_Recyclable'];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.wasteType || !VALID_WASTE_TYPES.includes(data.wasteType)) {
      return NextResponse.json({ error: 'Invalid waste type' }, { status: 400 });
    }
    if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1) {
      return NextResponse.json({ error: 'Invalid confidence value' }, { status: 400 });
    }

    await connectDB();

    const payload = await getAuthUser();

    const prediction = await Prediction.create({
      userId: payload?.userId ?? undefined,
      wasteType: data.wasteType,
      confidence: data.confidence,
      damageLevel: data.damageLevel,
      recommendation: data.recommendation,
      // Don't store imageUrl — base64 data URLs are large and not needed server-side
      recycled: false,
      ecoPointsAwarded: 0,
    });

    return NextResponse.json({ success: true, id: prediction._id.toString() }, { status: 201 });
  } catch (error) {
    console.error('[API] Error logging prediction:', error);
    return NextResponse.json({ error: 'Failed to log prediction' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    const predictions = await Prediction.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ predictions, total: predictions.length });
  } catch (error) {
    console.error('[API] Error fetching predictions:', error);
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}
