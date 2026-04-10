import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecyclingCenter extends Document {
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  accepts: string[];
  verified: boolean;
  mapsUrl: string;
  submittedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const RecyclingCenterSchema = new Schema<IRecyclingCenter>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    hours: { type: String, required: true },
    accepts: [{ type: String }],
    verified: { type: Boolean, default: false },
    mapsUrl: { type: String, default: 'https://maps.google.com' },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export const RecyclingCenter: Model<IRecyclingCenter> =
  mongoose.models.RecyclingCenter ||
  mongoose.model<IRecyclingCenter>('RecyclingCenter', RecyclingCenterSchema);
