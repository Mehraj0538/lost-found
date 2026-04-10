import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { StoreItem } from '@/lib/models/StoreItem';

export async function GET() {
  try {
    await connectDB();
    const items = await StoreItem.find({ stock: { $gt: 0 } }).sort({ pointsCost: 1 }).lean();
    return NextResponse.json({ items });
  } catch (err) {
    console.error('[STORE ITEMS]', err);
    return NextResponse.json({ error: 'Failed to fetch store items' }, { status: 500 });
  }
}
