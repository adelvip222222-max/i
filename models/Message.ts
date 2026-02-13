import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface IMessage extends Document {
  siteId: mongoose.Types.ObjectId; // حقل جديد
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    siteId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Site', 
      required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index for efficient querying
MessageSchema.index({ siteId: 1, createdAt: -1 });

const Message = getOrCreateModel<IMessage>('Message', MessageSchema);

export default Message;