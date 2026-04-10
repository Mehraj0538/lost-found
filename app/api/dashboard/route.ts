import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Prediction } from '@/lib/models/Prediction';
import { EcoTransaction } from '@/lib/models/EcoTransaction';

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    await connectDB();

    const [user, predictions, transactions] = await Promise.all([
      User.findById(payload.userId).select('-passwordHash').lean(),
      Prediction.find({ userId: payload.userId }).sort({ createdAt: -1 }).limit(50).lean(),
      EcoTransaction.find({ userId: payload.userId }).sort({ createdAt: -1 }).limit(50).lean(),
    ]);

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Compute stats
    const typeCounts = predictions.reduce<Record<string, number>>((acc, p) => {
      acc[p.wasteType] = (acc[p.wasteType] || 0) + 1;
      return acc;
    }, {});

    const damageCounts = predictions.reduce<Record<string, number>>((acc, p) => {
      const key = p.damageLevel || 'None';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const avgConfidence = predictions.length
      ? predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length
      : 0;

    return NextResponse.json({
      user,
      stats: {
        totalScans: predictions.length,
        recycledCount: user.recycledCount,
        avgConfidence,
        typeCounts,
        damageCounts,
      },
      predictions,
      transactions,
    });
  } catch (err) {
    console.error('[DASHBOARD]', err);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
