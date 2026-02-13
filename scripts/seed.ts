import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Service, Content, ContactInfo, SocialLink, SiteSettings } from '../models';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/4it-platform';

async function seed() {
  try {
    console.log('🌱 Starting seed...');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);
    const existingUser = await User.findOne({ email: 'admin@4it.com' });
    
    if (!existingUser) {
      await User.create({
        email: 'admin@4it.com',
        password: hashedPassword,
        name: 'مدير النظام',
      });
      console.log('✅ Admin user created: admin@4it.com');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create services
    const services = [
      {
        nameAr: 'تطوير المواقع',
        nameEn: 'Web Development',
        descriptionAr: 'نقدم خدمات تطوير مواقع احترافية باستخدام أحدث التقنيات',
        descriptionEn: 'Professional web development services using latest technologies',
        icon: '🌐',
        order: 1,
      },
      {
        nameAr: 'تطوير التطبيقات',
        nameEn: 'App Development',
        descriptionAr: 'تطوير تطبيقات الجوال لأنظمة iOS و Android',
        descriptionEn: 'Mobile app development for iOS and Android',
        icon: '📱',
        order: 2,
      },
      {
        nameAr: 'التسويق الرقمي',
        nameEn: 'Digital Marketing',
        descriptionAr: 'استراتيجيات تسويق رقمي فعالة لنمو أعمالك',
        descriptionEn: 'Effective digital marketing strategies for business growth',
        icon: '📊',
        order: 3,
      },
      {
        nameAr: 'تصميم UI/UX',
        nameEn: 'UI/UX Design',
        descriptionAr: 'تصميم واجهات مستخدم جذابة وسهلة الاستخدام',
        descriptionEn: 'Attractive and user-friendly interface design',
        icon: '🎨',
        order: 4,
      },
    ];

    for (const service of services) {
      const existing = await Service.findOne({ nameAr: service.nameAr });
      if (!existing) {
        await Service.create(service);
      }
    }
    console.log('✅ Services created');

    // Create Hero content
    const heroExists = await Content.findOne({ type: 'hero' });
    if (!heroExists) {
      await Content.create({
        type: 'hero',
        titleAr: 'نحول أفكارك إلى واقع رقمي',
        titleEn: 'We Turn Your Ideas Into Digital Reality',
        subtitleAr: 'حلول تقنية متكاملة لنجاح أعمالك',
        subtitleEn: 'Integrated technical solutions for your business success',
        descriptionAr: 'نقدم خدمات تطوير المواقع والتطبيقات والتسويق الرقمي بأعلى معايير الجودة',
        descriptionEn: 'We provide web and app development and digital marketing services with highest quality standards',
      });
      console.log('✅ Hero content created');
    }

    // Create About content
    const aboutExists = await Content.findOne({ type: 'about' });
    if (!aboutExists) {
      await Content.create({
        type: 'about',
        titleAr: 'من نحن',
        titleEn: 'About Us',
        descriptionAr: 'نحن فريق من المحترفين المتخصصين في تقديم حلول تقنية مبتكرة تساعد الشركات على النمو والتطور في العالم الرقمي',
        descriptionEn: 'We are a team of professionals specialized in providing innovative technical solutions that help companies grow and develop in the digital world',
        features: {
          items: [
            { titleAr: 'خبرة واسعة', titleEn: 'Wide Experience', icon: '⭐' },
            { titleAr: 'جودة عالية', titleEn: 'High Quality', icon: '✨' },
            { titleAr: 'دعم مستمر', titleEn: 'Continuous Support', icon: '🤝' },
            { titleAr: 'أسعار تنافسية', titleEn: 'Competitive Prices', icon: '💰' },
          ],
        },
      });
      console.log('✅ About content created');
    }

    // Create contact info
    const contactExists = await ContactInfo.findOne();
    if (!contactExists) {
      await ContactInfo.create({
        phone: '+966501234567',
        email: 'info@4it.com',
        address: 'الرياض، المملكة العربية السعودية',
        mapUrl: 'https://maps.google.com',
      });
      console.log('✅ Contact info created');
    }

    // Create social links
    const socialLinks = [
      { platform: 'facebook', url: 'https://facebook.com/4it', order: 1 },
      { platform: 'twitter', url: 'https://twitter.com/4it', order: 2 },
      { platform: 'instagram', url: 'https://instagram.com/4it', order: 3 },
      { platform: 'linkedin', url: 'https://linkedin.com/company/4it', order: 4 },
    ];

    for (const link of socialLinks) {
      const existing = await SocialLink.findOne({ platform: link.platform });
      if (!existing) {
        await SocialLink.create(link);
      }
    }
    console.log('✅ Social links created');

    // Create site settings
    const logoExists = await SiteSettings.findOne({ key: 'logo' });
    if (!logoExists) {
      await SiteSettings.create({
        key: 'logo',
        value: '/logo.png',
      });
      console.log('✅ Site settings created');
    }

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
