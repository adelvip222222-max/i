import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface IProject extends Document {
  siteId: mongoose.Types.ObjectId;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  category: string;
  client?: string;
  date?: Date;
  technologies?: string[];
  url?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    siteId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Site', 
      required: true
    },
    titleAr: { type: String, required: true },
    titleEn: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    client: { type: String },
    date: { type: Date },
    technologies: [{ type: String }],
    url: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProjectSchema.index({ siteId: 1, order: 1 });

const Project = getOrCreateModel<IProject>('Project', ProjectSchema);

export default Project;
