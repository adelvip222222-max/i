import 'dotenv/config';
import { connectDB } from '../lib/db';
import Service from '../models/Service';
import Site from '../models/Site';

async function addSampleServices() {
  try {
    await connectDB();
    
    // ابحث عن أول موقع في قاعدة البيانات
    const site = await Site.findOne();
    
    if (!site) {
      console.log('لا يوجد موقع في قاعدة البيانات');
      return;
    }

    console.log(`إضافة خدمات تجريبية للموقع: ${site.nameAr}`);

    // حذف الخدمات القديمة
    await Service.deleteMany({ siteId: site._id });

    // إضافة خدمات جديدة
    const services = [
      {
        siteId: site._id,
        nameAr: 'تطوير تطبيقات الويب',
        nameEn: 'Web Development',
        descriptionAr: 'نقوم بتطوير تطبيقات ويب حديثة وسريعة باستخدام أحدث التقنيات مثل React و Next.js',
        descriptionEn: 'We develop modern and fast web applications using the latest technologies like React and Next.js',
        icon: '💻',
        features: [
          'تصميم واجهات مستخدم عصرية',
          'تطوير Backend قوي وآمن',
          'تحسين الأداء والسرعة',
          'دعم فني مستمر'
        ],
        projects: [
          {
            name: 'منصة التجارة الإلكترونية',
            description: 'متجر إلكتروني متكامل مع نظام دفع آمن',
          },
          {
            name: 'نظام إدارة المحتوى',
            description: 'CMS مخصص لإدارة المواقع',
          }
        ],
        order: 1,
        isActive: true
      },
      {
        siteId: site._id,
        nameAr: 'تطوير تطبيقات الموبايل',
        nameEn: 'Mobile Development',
        descriptionAr: 'تطوير تطبيقات موبايل أصلية وهجينة لنظامي iOS و Android',
        descriptionEn: 'Developing native and hybrid mobile apps for iOS and Android',
        icon: '📱',
        features: [
          'تطبيقات iOS و Android',
          'تصميم UX/UI احترافي',
          'تكامل مع APIs',
          'نشر على المتاجر'
        ],
        projects: [
          {
            name: 'تطبيق توصيل الطعام',
            description: 'تطبيق شامل للمطاعم والعملاء',
          },
          {
            name: 'تطبيق اللياقة البدنية',
            description: 'متابعة التمارين والتغذية',
          }
        ],
        order: 2,
        isActive: true
      },
      {
        siteId: site._id,
        nameAr: 'تصميم UI/UX',
        nameEn: 'UI/UX Design',
        descriptionAr: 'تصميم تجربة مستخدم مميزة وواجهات جذابة تحقق أهدافك التجارية',
        descriptionEn: 'Designing exceptional user experiences and attractive interfaces',
        icon: '🎨',
        features: [
          'بحث وتحليل المستخدمين',
          'تصميم Wireframes و Prototypes',
          'اختبار قابلية الاستخدام',
          'دليل الهوية البصرية'
        ],
        projects: [
          {
            name: 'تصميم منصة تعليمية',
            description: 'واجهة سهلة للطلاب والمعلمين',
          },
          {
            name: 'تطبيق بنكي',
            description: 'تجربة آمنة وسلسة',
          }
        ],
        order: 3,
        isActive: true
      },
      {
        siteId: site._id,
        nameAr: 'الاستشارات التقنية',
        nameEn: 'Technical Consulting',
        descriptionAr: 'نقدم استشارات تقنية متخصصة لمساعدتك في اتخاذ القرارات الصحيحة',
        descriptionEn: 'We provide specialized technical consulting',
        icon: '💡',
        features: [
          'تحليل المتطلبات',
          'اختيار التقنيات المناسبة',
          'تخطيط البنية التحتية',
          'تقييم الأمان'
        ],
        order: 4,
        isActive: true
      }
    ];

    await Service.insertMany(services);
    
    console.log('✅ تم إضافة الخدمات التجريبية بنجاح!');
    console.log(`عدد الخدمات: ${services.length}`);
    
  } catch (error) {
    console.error('❌ خطأ في إضافة الخدمات:', error);
  } finally {
    process.exit();
  }
}

addSampleServices();
