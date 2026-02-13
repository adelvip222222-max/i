import { NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { connectDB } from '@/lib/db';
import { User, Site } from '@/models';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    // جلب بيانات المستخدم بعد تسجيل الدخول الناجح
    await connectDB();
    const user = await User.findOne({ email }).select('-password').lean();

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // جلب بيانات الموقع الخاص بالمستخدم إن وُجد
    const site = await Site.findOne({ userId: user._id }).lean();

    return NextResponse.json(
      { 
        success: true, 
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        site: site ? {
          id: site._id.toString(),
          nameAr: site.nameAr,
          slug: site.slug,
          isActive: site.isActive,
        } : null
      },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
