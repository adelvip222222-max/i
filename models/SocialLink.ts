import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface ISocialLink extends Document {
  siteId: mongoose.Types.ObjectId;
  platform: string;
  url: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    siteId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Site', 
      required: true
    },
    platform: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
SocialLinkSchema.index({ siteId: 1, order: 1 });
SocialLinkSchema.index({ siteId: 1, platform: 1 }, { unique: true });

const SocialLink = getOrCreateModel<ISocialLink>('SocialLink', SocialLinkSchema);

export default SocialLink;
