import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'معرف المستخدم ورمز التحقق مطلوبان' },
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

    if (user.isPhoneVerified) {
      return NextResponse.json(
        { error: 'رقم الهاتف مؤكد بالفعل' },
        { status: 400 }
      );
    }

    if (!user.phoneVerificationToken || !user.phoneVerificationExpires) {
      return NextResponse.json(
        { error: 'لم يتم إرسال رمز التحقق' },
        { status: 400 }
      );
    }

    if (new Date() > user.phoneVerificationExpires) {
      return NextResponse.json(
        { error: 'انتهت صلاحية رمز التحقق' },
        { status: 400 }
      );
    }

    if (user.phoneVerificationToken !== code) {
      return NextResponse.json(
        { error: 'رمز التحقق غير صحيح' },
        { status: 400 }
      );
    }

    // تأكيد رقم الهاتف
    user.isPhoneVerified = true;
    user.phoneVerificationToken = undefined;
    user.phoneVerificationExpires = undefined;
    await user.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'تم تأكيد رقم الهاتف بنجاح' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error verifying phone:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق' },
      { status: 500 }
    );
  }
}
