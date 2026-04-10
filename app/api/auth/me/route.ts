import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        ecoPoints: user.ecoPoints,
        tier: user.tier,
        recycledCount: user.recycledCount,
        scanCount: user.scanCount,
        joinedAt: user.joinedAt,
      },
    });
  } catch (err) {
    console.error('[ME]', err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
