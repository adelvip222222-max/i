import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface ISiteSettings extends Document {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = getOrCreateModel<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
