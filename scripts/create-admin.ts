import 'dotenv/config';
import { connectDB } from '../lib/db';
import User from '../models/User';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    await connectDB();
    
    // بيانات المستخدم Admin
    const adminData = {
      email: 'admin@4it.com',
      password: 'Admin@123456',
      name: 'Super Admin'
    };

    console.log('🔍 التحقق من وجود المستخدم...');
    
    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email: adminData.email });
    
    if (existingUser) {
      console.log('⚠️  المستخدم موجود بالفعل!');
      console.log('📧 البريد الإلكتروني:', adminData.email);
      console.log('🔑 كلمة المرور:', adminData.password);
      console.log('\n✅ يمكنك تسجيل الدخول باستخدام هذه البيانات');
      return;
    }

    console.log('🔐 تشفير كلمة المرور...');
    
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    console.log('💾 إنشاء المستخدم...');
    
    // إنشاء المستخدم
    const admin = await User.create({
      email: adminData.email,
      password: hashedPassword,
      name: adminData.name
    });

    console.log('\n✅ تم إنشاء مستخدم Admin بنجاح!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 البريد الإلكتروني:', adminData.email);
    console.log('🔑 كلمة المرور:', adminData.password);
    console.log('👤 الاسم:', adminData.name);
    console.log('🆔 ID:', admin._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🚀 يمكنك الآن تسجيل الدخول على:');
    console.log('   http://localhost:3000/admin-login');
    console.log('\n⚠️  تأكد من حفظ هذه البيانات في مكان آمن!');
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم:', error);
  } finally {
    process.exit();
  }
}

// تشغيل الدالة
createAdmin();
