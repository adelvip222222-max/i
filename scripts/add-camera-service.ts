import { connectDB } from '../lib/db';
import { Service } from '../models';

async function addCameraService() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();

    console.log('📹 Adding camera surveillance service...');

    const cameraService = {
      nameAr: 'تركيب وصيانة كاميرات المراقبة',
      nameEn: 'CCTV Installation & Maintenance',
      descriptionAr: 'نوفر خدمات تركيب وصيانة أنظمة كاميرات المراقبة الحديثة بأعلى جودة وكفاءة. نقدم حلول مراقبة متكاملة للمنازل والشركات والمؤسسات مع دعم فني متواصل وضمان شامل.',
      descriptionEn: 'We provide installation and maintenance services for modern CCTV surveillance systems with the highest quality and efficiency. We offer comprehensive monitoring solutions for homes, companies, and institutions with continuous technical support and comprehensive warranty.',
      icon: '📹',
      isActive: true,
      order: 11,
    };

    // Check if service already exists
    const existingService = await Service.findOne({ nameAr: cameraService.nameAr });
    
    if (existingService) {
      console.log('⚠️  Service already exists, updating...');
      await Service.findByIdAndUpdate(existingService._id, cameraService);
      console.log('✅ Service updated successfully!');
    } else {
      await Service.create(cameraService);
      console.log('✅ Camera surveillance service added successfully!');
    }

    console.log('\n📋 Service Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📹 العنوان (AR): ${cameraService.nameAr}`);
    console.log(`📹 Title (EN): ${cameraService.nameEn}`);
    console.log(`📝 الوصف (AR): ${cameraService.descriptionAr}`);
    console.log(`📝 Description (EN): ${cameraService.descriptionEn}`);
    console.log(`🎯 الأيقونة: ${cameraService.icon}`);
    console.log(`✅ الحالة: ${cameraService.isActive ? 'مفعّلة' : 'غير مفعّلة'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Display all services
    const allServices = await Service.find().sort({ order: 1 });
    console.log(`📊 Total services in database: ${allServices.length}`);
    console.log('\n📋 All Services:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    allServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.icon} ${service.nameAr}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding camera service:', error);
    process.exit(1);
  }
}

addCameraService();
