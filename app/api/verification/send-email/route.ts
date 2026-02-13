import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export const runtime = 'nodejs';

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

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مؤكد بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء رمز التحقق
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعة

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // إرسال البريد الإلكتروني
    const result = await sendVerificationEmail(user.email, verificationToken);

    if (!result.success) {
      return NextResponse.json(
        { error: 'فشل في إرسال البريد الإلكتروني' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'تم إرسال رابط التحقق إلى بريدك الإلكتروني' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال البريد' },
      { status: 500 }
    );
  }
}
