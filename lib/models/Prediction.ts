import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPrediction extends Document {
  userId?: mongoose.Types.ObjectId;
  wasteType: string;
  confidence: number;
  damageLevel?: string;
  recommendation: string;
  imageUrl?: string;
  recycled: boolean;
  ecoPointsAwarded: number;
  createdAt: Date;
}

const PredictionSchema = new Schema<IPrediction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, default: null },
    wasteType: { type: String, required: true },
    confidence: { type: Number, required: true },
    damageLevel: { type: String },
    recommendation: { type: String, required: true },
    imageUrl: { type: String },
    recycled: { type: Boolean, default: false },
    ecoPointsAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Prediction: Model<IPrediction> =
  mongoose.models.Prediction ||
  mongoose.model<IPrediction>('Prediction', PredictionSchema);
