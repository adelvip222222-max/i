import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  siteId: mongoose.Types.ObjectId;
  plan: 'trial' | 'monthly' | 'semi-annual' | 'annual';
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  amount: number;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
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
      enum: ['trial', 'monthly', 'semi-annual', 'annual'],
      default: 'trial',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound indexes for efficient queries
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ siteId: 1, status: 1 });
SubscriptionSchema.index({ endDate: 1, status: 1 });

const Subscription = getOrCreateModel<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
