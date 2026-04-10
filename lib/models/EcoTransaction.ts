import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEcoTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  action: 'register' | 'scan' | 'recycle' | 'redeem' | 'bonus';
  points: number;           // positive = earned, negative = spent
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const EcoTransactionSchema = new Schema<IEcoTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: {
      type: String,
      enum: ['register', 'scan', 'recycle', 'redeem', 'bonus'],
      required: true,
    },
    points: { type: Number, required: true },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const EcoTransaction: Model<IEcoTransaction> =
  mongoose.models.EcoTransaction ||
  mongoose.model<IEcoTransaction>('EcoTransaction', EcoTransactionSchema);

// Points awarded per action (server-authoritative, never rely on client)
export const ECO_POINTS = {
  register: 25,
  scan: 5,
  recycle: {
    E_Waste: 150,
    Battery: 120,          // Batteries are high hazard — bonus points
    Metal: 100,
    Glass: 75,
    Plastic: 50,
    General_Recyclable: 60,
    Non_Recyclable: 30,    // Still rewarded for responsible disposal
    default: 50,
  },
} as const;

