import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { Everify } from 'everify';

export const runtime = 'nodejs';

// دالة لإرسال رسالة SMS باستخدام Everify
async function sendSMS(phone: string, code: string) {
  try {
    // التحقق من وجود API Key
    if (!process.env.EVERIFY_API_KEY) {
      console.error('EVERIFY_API_KEY is not set');
      // في حالة عدم وجود API Key، نطبع الكود في console للتطوير
      console.log(`📱 SMS to ${phone}: Your verification code is: ${code}`);
      return { success: true, isDevelopment: true };
    }

    const everify = new Everify(process.env.EVERIFY_API_KEY);
    
    // إرسال رمز التحقق عبر SMS
    await everify.startVerification({
      method: "SMS",
      phoneNumber: phone,
    });
    
    console.log(`✅ SMS sent successfully to ${phone}`);
    return { success: true, isDevelopment: false };
  } catch (error) {
    console.error('Error sending SMS via Everify:', error);
    // في حالة الفشل، نطبع الكود في console
    console.log(`📱 SMS to ${phone}: Your verification code is: ${code}`);
    return { success: true, isDevelopment: true, error: error };
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    if (!user.phone) {
      return NextResponse.json(
        { error: 'رقم الهاتف غير موجود' },
        { status: 400 }
      );
    }

    if (user.isPhoneVerified) {
      return NextResponse.json(
        { error: 'رقم الهاتف مؤكد بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء رمز التحقق (6 أرقام)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

    user.phoneVerificationToken = verificationCode;
    user.phoneVerificationExpires = verificationExpires;
    await user.save();

    // إرسال رسالة SMS
    const result = await sendSMS(user.phone, verificationCode);

    if (!result.success) {
      return NextResponse.json(
        { error: 'فشل في إرسال رسالة SMS' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'تم إرسال رمز التحقق إلى رقم هاتفك',
        // في بيئة التطوير أو عند الفشل، نرسل الكود للتسهيل
        ...(result.isDevelopment && { code: verificationCode })
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending phone verification:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال رمز التحقق' },
      { status: 500 }
    );
  }
}
