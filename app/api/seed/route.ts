import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RecyclingCenter } from '@/lib/models/RecyclingCenter';
import { StoreItem } from '@/lib/models/StoreItem';

const CENTERS = [
  { name: 'GreenTech Recyclers', address: '12 Eco Park Road', city: 'Mumbai', phone: '+91 98765 43210', hours: 'Mon–Sat, 9 AM – 6 PM', accepts: ['E-Waste', 'Batteries', 'Screens'], verified: true, mapsUrl: 'https://maps.google.com' },
  { name: 'E-Cycle Hub', address: '45 Industrial Estate', city: 'Pune', phone: '+91 87654 32109', hours: 'Mon–Fri, 8 AM – 5 PM', accepts: ['E-Waste', 'Metals', 'Cables', 'Batteries'], verified: true, mapsUrl: 'https://maps.google.com' },
  { name: 'EcoWaste Solutions', address: '78 Green Valley', city: 'Bangalore', phone: '+91 76543 21098', hours: 'Tue–Sun, 10 AM – 7 PM', accepts: ['Screens', 'Laptops', 'Phones'], verified: false, mapsUrl: 'https://maps.google.com' },
  { name: 'CleanCircle India', address: '9 Tech Park Avenue', city: 'Hyderabad', phone: '+91 65432 10987', hours: 'Mon–Sat, 7 AM – 8 PM', accepts: ['E-Waste', 'Batteries', 'Metals', 'Screens', 'Cables'], verified: true, mapsUrl: 'https://maps.google.com' },
  { name: 'Metal-X Recyclers', address: '33 Recycle Street', city: 'Chennai', phone: '+91 54321 09876', hours: 'Mon–Fri, 9 AM – 5 PM', accepts: ['Metals', 'Cables', 'Batteries'], verified: true, mapsUrl: 'https://maps.google.com' },
  { name: 'BatteryBack', address: '21 Power Block', city: 'Delhi', phone: '+91 43210 98765', hours: 'Mon–Sun, 8 AM – 9 PM', accepts: ['Batteries'], verified: false, mapsUrl: 'https://maps.google.com' },
  { name: 'ScreenSafe Recycling', address: '56 Display Lane', city: 'Mumbai', phone: '+91 32109 87654', hours: 'Wed–Mon, 10 AM – 6 PM', accepts: ['Screens', 'Laptops', 'Phones', 'E-Waste'], verified: true, mapsUrl: 'https://maps.google.com' },
  { name: 'Prakruthi Eco Centre', address: '88 Nature Park', city: 'Bangalore', phone: '+91 21098 76543', hours: 'Mon–Sat, 9 AM – 7 PM', accepts: ['E-Waste', 'Metals', 'Cables', 'Phones'], verified: true, mapsUrl: 'https://maps.google.com' },
];

const STORE_ITEMS = [
  { name: 'Seed Paper Notebook', description: 'A plantable notebook made from recycled paper embedded with wildflower seeds.', ecoBenefit: 'Made from 100% recycled materials. Plant it when done!', category: 'Home', pointsCost: 80, tierRequired: 'Green', stock: 200, emoji: '📓', featured: false, exclusive: false },
  { name: 'Beeswax Food Wraps Set', description: 'Reusable beeswax wraps replacing single-use plastic cling film. Set of 3.', ecoBenefit: 'Replaces up to 1000 pieces of plastic wrap per year.', category: 'Home', pointsCost: 100, tierRequired: 'Green', stock: 150, emoji: '🍯', featured: false, exclusive: false },
  { name: 'Compostable Phone Stand', description: 'Desktop phone stand made from compostable bamboo fiber.', ecoBenefit: 'Fully biodegradable in 6 months in compost conditions.', category: 'Tech', pointsCost: 120, tierRequired: 'Green', stock: 100, emoji: '📱', featured: false, exclusive: false },
  { name: 'Bamboo Phone Case', description: 'Protective phone case crafted from natural bamboo with biodegradable lining.', ecoBenefit: 'Saves 35g of plastic per case compared to conventional cases.', category: 'Tech', pointsCost: 150, tierRequired: 'Green', stock: 80, emoji: '🎋', featured: true, exclusive: false },
  { name: 'Organic Cotton Tote Bag', description: 'Durable tote bag made from GOTS-certified organic cotton.', ecoBenefit: 'Replaces ~700 plastic bags over its lifetime.', category: 'Apparel', pointsCost: 180, tierRequired: 'Green', stock: 120, emoji: '👜', featured: false, exclusive: false },
  { name: 'Recycled Plastic Wallet', description: 'Ultra-slim RFID-blocking wallet crafted from ocean-recovered plastic bottles.', ecoBenefit: 'Made from 4 recycled ocean plastic bottles.', category: 'Apparel', pointsCost: 200, tierRequired: 'Green', stock: 90, emoji: '👝', featured: true, exclusive: false },
  { name: 'Reusable Stainless Bottle', description: 'Insulated stainless steel water bottle that keeps drinks cold 24hr / hot 12hr.', ecoBenefit: 'Eliminates ~156 plastic bottles per person per year.', category: 'Wellness', pointsCost: 250, tierRequired: 'Green', stock: 200, emoji: '🫙', featured: false, exclusive: false },
  { name: 'Recycled Glass Terrarium', description: 'Beautiful mini-ecosystem in a jar made from 100% recycled glass.', ecoBenefit: 'Made from 100% upcycled glass materials.', category: 'Home', pointsCost: 300, tierRequired: 'Green', stock: 60, emoji: '🌿', featured: false, exclusive: false },
  { name: 'Hemp Canvas Backpack', description: 'Spacious and durable backpack woven from natural hemp canvas.', ecoBenefit: 'Hemp requires 50% less water to grow than conventional cotton.', category: 'Apparel', pointsCost: 600, tierRequired: 'EcoWarrior', stock: 50, emoji: '🎒', featured: true, exclusive: false },
  { name: 'Solar LED Garden Lights', description: 'Set of 6 solar-powered LED pathway lights. No wiring needed.', ecoBenefit: 'Generates 0 carbon emissions. Charges in 6 hours of sunlight.', category: 'Home', pointsCost: 800, tierRequired: 'EcoWarrior', stock: 40, emoji: '☀️', featured: false, exclusive: false },
  { name: 'Solar-Powered Charger', description: '20W foldable solar panel charger compatible with all USB-C devices.', ecoBenefit: 'Power your devices with pure sunlight energy.', category: 'Tech', pointsCost: 1000, tierRequired: 'EarthChampion', stock: 30, emoji: '⚡', featured: true, exclusive: false },
  { name: 'Smart Compost Bin', description: 'Odor-free electric composter that turns food waste into fertilizer in 24h.', ecoBenefit: 'Diverts up to 150kg of food waste from landfill annually.', category: 'Home', pointsCost: 1500, tierRequired: 'EarthChampion', stock: 20, emoji: '♻️', featured: false, exclusive: false },
  { name: 'Bamboo Laptop Stand', description: 'Elegant ergonomic laptop stand precision-crafted from sustainable bamboo.', ecoBenefit: 'Bamboo is the fastest-growing plant — no deforestation.', category: 'Tech', pointsCost: 2000, tierRequired: 'PlanetGuardian', stock: 15, emoji: '💻', featured: true, exclusive: true },
];

// Only allow seeding in non-production or with a secret key
export async function GET() {
  if (process.env.NODE_ENV === 'production' && !process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Seeding disabled in production' }, { status: 403 });
  }

  try {
    await connectDB();

    const [centerCount, itemCount] = await Promise.all([
      RecyclingCenter.countDocuments(),
      StoreItem.countDocuments(),
    ]);

    const seeded: Record<string, number> = {};

    if (centerCount === 0) {
      await RecyclingCenter.insertMany(CENTERS);
      seeded.recyclingCenters = CENTERS.length;
    } else {
      seeded.recyclingCenters = 0;
    }

    if (itemCount === 0) {
      await StoreItem.insertMany(STORE_ITEMS);
      seeded.storeItems = STORE_ITEMS.length;
    } else {
      seeded.storeItems = 0;
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      seeded,
    });
  } catch (err) {
    console.error('[SEED]', err);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
