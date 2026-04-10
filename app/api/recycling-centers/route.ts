import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RecyclingCenter } from '@/lib/models/RecyclingCenter';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const material = searchParams.get('material');

    const query: Record<string, unknown> = {};
    if (city && city !== 'All Cities') query.city = city;
    if (material && material !== 'All') query.accepts = material;

    const centers = await RecyclingCenter.find(query).sort({ verified: -1, name: 1 }).lean();
    return NextResponse.json({ centers });
  } catch (err) {
    console.error('[CENTERS GET]', err);
    return NextResponse.json({ error: 'Failed to fetch centers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    await connectDB();
    const data = await req.json();

    if (!data.name?.trim() || !data.address?.trim() || !data.city?.trim() || !data.phone?.trim()) {
      return NextResponse.json({ error: 'name, address, city, and phone are required' }, { status: 400 });
    }

    const center = await RecyclingCenter.create({
      name: data.name.trim(),
      address: data.address.trim(),
      city: data.city.trim(),
      phone: data.phone.trim(),
      hours: data.hours?.trim() || '',
      accepts: Array.isArray(data.accepts) ? data.accepts : [],
      mapsUrl: data.mapsUrl || 'https://maps.google.com',
      verified: false,
      submittedBy: payload.userId,
    });
    return NextResponse.json({ center }, { status: 201 });
  } catch (err) {
    console.error('[CENTERS POST]', err);
    return NextResponse.json({ error: 'Failed to submit center' }, { status: 500 });
  }
}
