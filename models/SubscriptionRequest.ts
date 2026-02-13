import mongoose, { Schema, Document } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface ISubscriptionRequest extends Document {
  userId: mongoose.Types.ObjectId;
  siteId: mongoose.Types.ObjectId;
  plan: 'monthly' | 'semi-annual' | 'annual';
  amount: number;
  paymentMethod: string;
  phoneNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionRequestSchema = new Schema<ISubscriptionRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: 'Site',
      required: true
    },
    plan: {
      type: String,
      enum: ['monthly', 'semi-annual', 'annual'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedDate: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// Indexes
SubscriptionRequestSchema.index({ userId: 1, status: 1 });
SubscriptionRequestSchema.index({ status: 1, requestDate: -1 });

const SubscriptionRequest = getOrCreateModel<ISubscriptionRequest>('SubscriptionRequest', SubscriptionRequestSchema);

export default SubscriptionRequest;
