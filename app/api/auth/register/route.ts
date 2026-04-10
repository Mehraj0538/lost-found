import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User, getTier } from '@/lib/models/User';
import { EcoTransaction } from '@/lib/models/EcoTransaction';
import { signToken, createAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      ecoPoints: 25,
      tier: 'Seedling',
    });

    // Log welcome bonus transaction
    await EcoTransaction.create({
      userId: user._id,
      action: 'register',
      points: 25,
      description: 'Welcome bonus — thanks for joining EcoSort AI!',
    });

    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name });
    const cookie = createAuthCookie(token);

    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        ecoPoints: user.ecoPoints,
        tier: user.tier,
      },
    }, { status: 201 });

    response.cookies.set(cookie);
    return response;
  } catch (err) {
    console.error('[REGISTER]', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
