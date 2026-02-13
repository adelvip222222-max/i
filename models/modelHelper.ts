import mongoose, { Model, Schema } from 'mongoose';

/**
 * Helper function to safely get or create a mongoose model
 * Prevents "Cannot read properties of undefined" errors
 */
export function getOrCreateModel<T>(
  modelName: string,
  schema: Schema<T>
): Model<T> {
  try {
    // Try to get existing model
    return mongoose.model<T>(modelName);
  } catch {
    // If model doesn't exist, create it
    return mongoose.model<T>(modelName, schema);
  }
}
