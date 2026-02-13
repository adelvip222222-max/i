import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface ISubscriber extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'subscriber' | 'admin'; // 'admin' is you, 'subscriber' is the client
  isActive: boolean;
  sites: mongoose.Types.ObjectId[]; // Array of Site IDs they own
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { 
      type: String, 
      enum: ['subscriber', 'admin'], 
      default: 'subscriber' 
    },
    isActive: { type: Boolean, default: true },
    sites: [{ type: Schema.Types.ObjectId, ref: 'Site' }]
  },
  { timestamps: true }
);

const Subscriber = getOrCreateModel<ISubscriber>('Subscriber', SubscriberSchema);
export default Subscriber;