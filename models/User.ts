import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'admin' | 'super-admin' | 'user';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  phoneVerificationToken?: string;
  phoneVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'super-admin', 'user'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    phoneVerificationToken: {
      type: String,
    },
    phoneVerificationExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index is already created via unique: true in schema definition
// No need for explicit index creation

const User = getOrCreateModel<IUser>('User', UserSchema);

export default User;
