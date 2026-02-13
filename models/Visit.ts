import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface IVisit extends Document {
  page: string;
  ip?: string;
  userAgent?: string;
  referer?: string;
  createdAt: Date;
}

const VisitSchema = new Schema<IVisit>(
  {
    page: {
      type: String,
      required: true,
    },
    ip: String,
    userAgent: String,
    referer: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

VisitSchema.index({ page: 1 });
VisitSchema.index({ createdAt: -1 });

const Visit = getOrCreateModel<IVisit>('Visit', VisitSchema);

export default Visit;
