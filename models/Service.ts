import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface IService extends Document {
  siteId: mongoose.Types.ObjectId;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  image?: string; // صورة الخدمة
  features?: string[]; // مميزات الخدمة
  projects?: {
    name: string;
    description: string;
    image?: string;
    url?: string;
  }[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    siteId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Site', 
      required: true
    },
    nameAr: { type: String, required: true },
    nameEn: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    icon: { type: String, required: true },
    image: { type: String }, // صورة الخدمة
    features: [{ type: String }], // مميزات الخدمة
    projects: [{
      name: { type: String },
      description: { type: String },
      image: { type: String },
      url: { type: String }
    }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index for ordering services within a site
ServiceSchema.index({ siteId: 1, order: 1 });

const Service = getOrCreateModel<IService>('Service', ServiceSchema);

export default Service;