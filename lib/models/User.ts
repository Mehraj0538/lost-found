import mongoose, { Schema, Document, Model } from 'mongoose';

export type Tier = 'Seedling' | 'Green' | 'EcoWarrior' | 'EarthChampion' | 'PlanetGuardian';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  ecoPoints: number;
  tier: Tier;
  recycledCount: number;
  scanCount: number;
  joinedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    ecoPoints: { type: Number, default: 25 }, // 25 welcome points
    tier: {
      type: String,
      enum: ['Seedling', 'Green', 'EcoWarrior', 'EarthChampion', 'PlanetGuardian'],
      default: 'Seedling',
    },
    recycledCount: { type: Number, default: 0 },
    scanCount: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TIER_THRESHOLDS: Record<Tier, number> = {
  Seedling: 0,
  Green: 100,
  EcoWarrior: 500,
  EarthChampion: 1000,
  PlanetGuardian: 2500,
};

export const TIER_DISCOUNTS: Record<Tier, number> = {
  Seedling: 0,
  Green: 0,
  EcoWarrior: 10,
  EarthChampion: 20,
  PlanetGuardian: 30,
};

export function getTier(points: number): Tier {
  if (points >= 2500) return 'PlanetGuardian';
  if (points >= 1000) return 'EarthChampion';
  if (points >= 500) return 'EcoWarrior';
  if (points >= 100) return 'Green';
  return 'Seedling';
}

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
