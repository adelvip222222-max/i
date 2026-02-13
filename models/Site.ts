import mongoose, { Schema, Document, Model } from 'mongoose';
import { getOrCreateModel } from './modelHelper';

export interface ISite extends Document {
  userId: mongoose.Types.ObjectId;
  nameAr: string;
  slug: string; // الرابط الفريد (مثلاً: company-name)
  logo?: string;
  heroImages?: string[]; // صور Hero Section (حد أقصى 3 صور)
  
  // Theme & Branding
  siteType: 'contracting' | 'technology' | 'medical' | 'other';
  themeColors: {
    primary: string;
    secondary: string;
  };

  // SEO
  description?: string;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSchema = new Schema<ISite>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', // تغيير من PubliUser إلى User
      required: true, 
      unique: true // كل مستخدم يملك سيت واحد فقط
    },
    nameAr: { 
      type: String, 
      required: true,
      trim: true 
    },
    slug: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true 
    },
    logo: String,
    heroImages: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 3;
        },
        message: 'يمكن إضافة 3 صور كحد أقصى'
      }
    },
    siteType: { 
      type: String, 
      enum: ['contracting', 'technology', 'medical', 'other'],
      default: 'other'
    },
    themeColors: {
      primary: { type: String, default: '#2563eb' }, // Default Blue
      secondary: { type: String, default: '#1e293b' } // Default Slate
    },
    description: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// فهرسة للبحث السريع عن طريق الرابط
SiteSchema.index({ slug: 1 });

const Site = getOrCreateModel<ISite>('Site', SiteSchema);
export default Site;