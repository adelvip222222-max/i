// Types for the application

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Service {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface Content {
  id: string;
  type: 'hero' | 'about';
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  images?: string[];
  features?: any;
}

export interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
  mapUrl?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Visit {
  id: string;
  page: string;
  ip?: string;
  userAgent?: string;
  referer?: string;
  createdAt: Date;
}

export interface AnalyticsStats {
  totalVisits: number;
  todayVisits: number;
  monthVisits: number;
  chartData: { date: string; visits: number }[];
  topPages: { page: string; visits: number }[];
}
