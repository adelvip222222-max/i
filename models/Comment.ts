import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId | null;
  guestName?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    guestName: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1 });

const Comment = getOrCreateModel<IComment>('Comment', CommentSchema);

export default Comment;
