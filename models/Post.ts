import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface IPost extends Document {
  siteId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category?: string;
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'عام',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.index({ siteId: 1, createdAt: -1 });
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ status: 1, createdAt: -1 });

const Post = getOrCreateModel<IPost>('Post', PostSchema);

export default Post;
