import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export const runtime = 'nodejs';

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل')
    .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل')
    .regex(/\d/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = validatedData.data;

    await connectDB();

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    
    if (existingEmail) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    
    if (existingPhone) {
      return NextResponse.json(
        { error: 'رقم الهاتف مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء رمز التحقق
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعة

    // Create new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: 'user',
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // إرسال بريد التحقق
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // لا نفشل التسجيل إذا فشل إرسال البريد
    }

    logger.info('New user registered', { userId: newUser._id, email, phone });

    return NextResponse.json(
      { 
        success: true, 
        message: 'تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك.',
        userId: newUser._id 
      },
      { status: 201 }
    );

  } catch (error) {
    logger.error('Registration error', error as Error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التسجيل' },
      { status: 500 }
    );
  }
}
