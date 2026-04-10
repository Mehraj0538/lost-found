import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User, getTier, TIER_THRESHOLDS, TIER_DISCOUNTS } from '@/lib/models/User';
import { StoreItem } from '@/lib/models/StoreItem';
import { Redemption } from '@/lib/models/Redemption';
import { EcoTransaction } from '@/lib/models/EcoTransaction';

export async function POST(req: NextRequest) {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { itemId } = await req.json();
    if (!itemId) return NextResponse.json({ error: 'itemId required' }, { status: 400 });

    await connectDB();

    const [user, item] = await Promise.all([
      User.findById(payload.userId),
      StoreItem.findById(itemId),
    ]);

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    // Check tier requirement
    const userTierLevel = TIER_THRESHOLDS[user.tier];
    const requiredTierLevel = TIER_THRESHOLDS[item.tierRequired];
    if (userTierLevel < requiredTierLevel) {
      return NextResponse.json({
        error: `This item requires ${item.tierRequired} tier or higher`,
      }, { status: 403 });
    }

    // Apply tier discount
    const discount = TIER_DISCOUNTS[user.tier];
    const finalCost = Math.round(item.pointsCost * (1 - discount / 100));

    if (user.ecoPoints < finalCost) {
      return NextResponse.json({
        error: `Insufficient eco-points. You need ${finalCost} pts, you have ${user.ecoPoints} pts.`,
      }, { status: 402 });
    }

    // Atomically decrement stock — prevents race condition with concurrent requests
    const updatedItem = await StoreItem.findOneAndUpdate(
      { _id: itemId, stock: { $gt: 0 } },
      { $inc: { stock: -1 } },
      { new: true }
    );
    if (!updatedItem) {
      return NextResponse.json({ error: 'Out of stock' }, { status: 409 });
    }

    // Deduct points and update tier
    user.ecoPoints -= finalCost;
    user.tier = getTier(user.ecoPoints);
    await user.save();

    await Promise.all([
      Redemption.create({
        userId: user._id,
        itemId: item._id,
        itemName: item.name,
        pointsSpent: finalCost,
      }),
      EcoTransaction.create({
        userId: user._id,
        action: 'redeem',
        points: -finalCost,
        description: `Redeemed: ${item.name}`,
        metadata: { itemId: item._id, itemName: item.name, discount },
      }),
    ]);

    return NextResponse.json({
      success: true,
      pointsSpent: finalCost,
      remaining: user.ecoPoints,
      discount,
      item: item.name,
    });
  } catch (err) {
    console.error('[STORE REDEEM]', err);
    return NextResponse.json({ error: 'Redemption failed' }, { status: 500 });
  }
}
