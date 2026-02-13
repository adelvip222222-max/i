import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface ILog extends Document {
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  context?: any;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

const LogSchema = new Schema<ILog>(
  {
    level: {
      type: String,
      enum: ['INFO', 'WARN', 'ERROR'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    context: {
      type: Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ip: String,
    userAgent: String,
  },
  {
    timestamps: false,
  }
);

// Indexes for efficient querying
LogSchema.index({ timestamp: -1 });
LogSchema.index({ level: 1 });
LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // TTL: 30 days

const Log = getOrCreateModel<ILog>('Log', LogSchema);

export default Log;
