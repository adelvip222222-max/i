import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface IContent extends Document {
  type: 'hero' | 'about';
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
   siteId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Site', 
        required: true,
        unique: true // معلومات تواصل واحدة لكل سيت
      },
  descriptionAr?: string;
  descriptionEn?: string;
  images?: string[];
  features?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ['hero', 'about'],
    },
    titleAr: String,
    titleEn: String,
    subtitleAr: String,
    subtitleEn: String,
    descriptionAr: String,
    descriptionEn: String,
    images: [String],
    features: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

const Content = getOrCreateModel<IContent>('Content', ContentSchema);

export default Content;
