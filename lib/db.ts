import mongoose from 'mongoose';
// نقوم باستيراد الـ logger لكن سنستخدمه بحذر
import { logger } from './logger';

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || '';

// Validate MongoDB URI exists
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI or DATABASE_URL environment variable in .env file'
  );
}

// Security: Ensure URI doesn't contain sensitive data in logs
const sanitizeURI = (uri: string): string => {
  try {
    const url = new URL(uri.replace('mongodb://', 'http://').replace('mongodb+srv://', 'https://'));
    return `mongodb://${url.hostname}:${url.port || '27017'}/${url.pathname.slice(1).split('?')[0]}`;
  } catch {
    return 'mongodb://[hidden]';
  }
};

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend globalThis instead of global for better compatibility
declare global {
  var mongoose: MongooseCache | undefined;
}

// Use globalThis which is available in all environments
const globalForMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

// Initialize cache
let cached: MongooseCache = globalForMongoose.mongoose || { conn: null, promise: null };

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached;
}

// Connection state tracking
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;
const CONNECTION_TIMEOUT = 10000; // 10 seconds

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    if (cached.conn.connection.readyState === 1) {
      return cached.conn;
    }
    cached.conn = null;
    cached.promise = null;
  }

  // Create new connection if no promise exists
  if (!cached.promise) {
    connectionAttempts++;

    // Check max attempts
    if (connectionAttempts > MAX_CONNECTION_ATTEMPTS) {
      const error = new Error('Maximum database connection attempts exceeded');
      
      // 🛑 تعديل هام: استخدام console.error بدلاً من logger لتجنب الحلقة المفرغة
      console.error('❌ CRITICAL: Database connection failed too many times', {
        attempts: connectionAttempts,
        maxAttempts: MAX_CONNECTION_ATTEMPTS,
      });
      
      throw error;
    }

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
      family: 4,
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: CONNECTION_TIMEOUT,
      heartbeatFrequencyMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    
    // Reset connection attempts on success
    connectionAttempts = 0;

    // Connection successful - no logging needed in production
    // Uncomment below for debugging if needed:
    // logger.info('Connected to MongoDB successfully', {
    //   host: cached.conn.connection.host || 'unknown',
    //   name: cached.conn.connection.name || 'unknown',
    //   readyState: cached.conn.connection.readyState,
    // });

    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    cached.conn = null;

    // 🛑 تعديل هام: استخدام console.error عند الفشل
    console.error('❌ MongoDB connection error:', {
      message: error.message,
      attempt: connectionAttempts,
    });

    throw new Error(`فشل الاتصال بقاعدة البيانات: ${error.message}`);
  }
}

// ... (باقي دوال disconnectDB و checkDBHealth يمكن إبقاؤها كما هي)

export default mongoose;