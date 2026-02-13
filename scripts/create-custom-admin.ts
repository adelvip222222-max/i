import 'dotenv/config';
import { connectDB } from '../lib/db';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createCustomAdmin() {
  try {
    await connectDB();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   إنشاء مستخدم Admin مخصص');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // جمع البيانات من المستخدم
    const name = await question('👤 أدخل الاسم: ');
    const email = await question('📧 أدخل البريد الإلكتروني: ');
    const password = await question('🔑 أدخل كلمة المرور (8 أحرف على الأقل): ');

    // التحقق من البيانات
    if (!name || !email || !password) {
      console.log('\n❌ جميع الحقول مطلوبة!');
      rl.close();
      process.exit(1);
    }

    if (password.length < 8) {
      console.log('\n❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل!');
      rl.close();
      process.exit(1);
    }

    if (!email.includes('@')) {
      console.log('\n❌ البريد الإلكتروني غير صحيح!');
      rl.close();
      process.exit(1);
    }

    console.log('\n🔍 التحقق من وجود المستخدم...');
    
    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      console.log('⚠️  المستخدم موجود بالفعل بهذا البريد الإلكتروني!');
      rl.close();
      process.exit(1);
    }

    console.log('🔐 تشفير كلمة المرور...');
    
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('💾 إنشاء المستخدم...');
    
    // إنشاء المستخدم
    const admin = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name
    });

    console.log('\n✅ تم إنشاء مستخدم Admin بنجاح!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 البريد الإلكتروني:', email);
    console.log('🔑 كلمة المرور:', password);
    console.log('👤 الاسم:', name);
    console.log('🆔 ID:', admin._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🚀 يمكنك الآن تسجيل الدخول على:');
    console.log('   http://localhost:3000/admin-login');
    console.log('\n⚠️  تأكد من حفظ هذه البيانات في مكان آمن!');
    
    rl.close();
  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم:', error);
    rl.close();
  } finally {
    process.exit();
  }
}

// تشغيل الدالة
createCustomAdmin();
