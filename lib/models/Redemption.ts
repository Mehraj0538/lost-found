import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRedemption extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  itemName: string;
  pointsSpent: number;
  createdAt: Date;
}

const RedemptionSchema = new Schema<IRedemption>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'StoreItem', required: true },
    itemName: { type: String, required: true },
    pointsSpent: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Redemption: Model<IRedemption> =
  mongoose.models.Redemption ||
  mongoose.model<IRedemption>('Redemption', RedemptionSchema);
