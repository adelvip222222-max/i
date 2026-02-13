import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface IContactInfo extends Document {
  siteId: mongoose.Types.ObjectId; // حقل جديد
  phone: string;
  email: string;
  address: string;
  mapUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInfoSchema = new Schema<IContactInfo>(
  {
    siteId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Site', 
      required: true,
      unique: true // معلومات تواصل واحدة لكل سيت
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    mapUrl: String,
  },
  { timestamps: true }
);

const ContactInfo = getOrCreateModel<IContactInfo>('ContactInfo', ContactInfoSchema);

export default ContactInfo;