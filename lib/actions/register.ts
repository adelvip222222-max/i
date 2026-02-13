'use server';

import { connectDB } from '@/lib/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { sendVerificationEmail } from '@/lib/email';

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

/**
 * تسجيل مستخدم جديد مع إرسال بريد التحقق
 */
export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    // Validate input
    const validatedData = registerSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.errors[0].message,
      };
    }

    const { name, email, password } = validatedData.data;

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return {
        success: false,
        error: 'البريد الإلكتروني مستخدم بالفعل',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      role: 'admin',
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken);

    if (!emailResult.success) {
      logger.error('Failed to send verification email', undefined, { email });
    }

    logger.info('New user registered', { userId: newUser._id, email });

    return {
      success: true,
      message: 'تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.',
      userId: newUser._id.toString(),
    };
  } catch (error) {
    logger.error('Registration error', error as Error);
    return {
      success: false,
      error: 'حدث خطأ أثناء التسجيل',
    };
  }
}

/**
 * التحقق من البريد الإلكتروني
 */
export async function verifyEmail(token: string) {
  try {
    await connectDB();

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return {
        success: false,
        error: 'رابط التحقق غير صالح أو منتهي الصلاحية',
      };
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    logger.info('Email verified', { userId: user._id, email: user.email });

    return {
      success: true,
      message: 'تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.',
    };
  } catch (error) {
    logger.error('Email verification error', error as Error);
    return {
      success: false,
      error: 'حدث خطأ أثناء التحقق من البريد',
    };
  }
}

/**
 * إعادة إرسال بريد التحقق
 */
export async function resendVerificationEmail(email: string) {
  try {
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return {
        success: false,
        error: 'البريد الإلكتروني غير موجود',
      };
    }

    if (user.isEmailVerified) {
      return {
        success: false,
        error: 'البريد الإلكتروني مفعل بالفعل',
      };
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken);

    if (!emailResult.success) {
      return {
        success: false,
        error: 'فشل في إرسال البريد',
      };
    }

    return {
      success: true,
      message: 'تم إرسال بريد التحقق بنجاح',
    };
  } catch (error) {
    logger.error('Resend verification email error', error as Error);
    return {
      success: false,
      error: 'حدث خطأ أثناء إرسال البريد',
    };
  }
}
