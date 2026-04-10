import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Tier } from './User';

export interface IStoreItem extends Document {
  name: string;
  description: string;
  ecoBenefit: string;
  category: 'Home' | 'Tech' | 'Apparel' | 'Wellness';
  pointsCost: number;
  tierRequired: Tier;
  stock: number;
  emoji: string;
  featured: boolean;
  exclusive: boolean; // exclusive to high tiers
}

const StoreItemSchema = new Schema<IStoreItem>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ecoBenefit: { type: String, required: true },
    category: {
      type: String,
      enum: ['Home', 'Tech', 'Apparel', 'Wellness'],
      required: true,
    },
    pointsCost: { type: Number, required: true },
    tierRequired: {
      type: String,
      enum: ['Seedling', 'Green', 'EcoWarrior', 'EarthChampion', 'PlanetGuardian'],
      default: 'Green',
    },
    stock: { type: Number, default: 100 },
    emoji: { type: String, default: '🌿' },
    featured: { type: Boolean, default: false },
    exclusive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const StoreItem: Model<IStoreItem> =
  mongoose.models.StoreItem ||
  mongoose.model<IStoreItem>('StoreItem', StoreItemSchema);
