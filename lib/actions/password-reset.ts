'use server';

import { connectDB } from '@/lib/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { sendPasswordResetEmail } from '@/lib/email';

const emailSchema = z.string().email('البريد الإلكتروني غير صحيح');
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');

/**
 * طلب إعادة تعيين كلمة المرور
 */
export async function requestPasswordReset(email: string) {
  try {
    // Validate email
    const validatedEmail = emailSchema.safeParse(email);

    if (!validatedEmail.success) {
      return {
        success: false,
        error: validatedEmail.error.errors[0].message,
      };
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if email exists for security
      return {
        success: true,
        message: 'إذا كان البريد الإلكتروني موجوداً، سيتم إرسال رابط إعادة التعيين',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (!emailResult.success) {
      logger.error('Failed to send password reset email', undefined, { email });
    }

    logger.info('Password reset requested', { userId: user._id, email });

    return {
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
    };
  } catch (error) {
    logger.error('Password reset request error', error as Error);
    return {
      success: false,
      error: 'حدث خطأ أثناء معالجة الطلب',
    };
  }
}

/**
 * إعادة تعيين كلمة المرور
 */
export async function resetPassword(token: string, newPassword: string) {
  try {
    // Validate password
    const validatedPassword = passwordSchema.safeParse(newPassword);

    if (!validatedPassword.success) {
      return {
        success: false,
        error: validatedPassword.error.errors[0].message,
      };
    }

    await connectDB();

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return {
        success: false,
        error: 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية',
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info('Password reset successful', { userId: user._id, email: user.email });

    return {
      success: true,
      message: 'تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.',
    };
  } catch (error) {
    logger.error('Password reset error', error as Error);
    return {
      success: false,
      error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور',
    };
  }
}

/**
 * التحقق من صلاحية رابط إعادة التعيين
 */
export async function verifyResetToken(token: string) {
  try {
    await connectDB();

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return {
        success: false,
        error: 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية',
      };
    }

    return {
      success: true,
      message: 'الرابط صالح',
    };
  } catch (error) {
    logger.error('Token verification error', error as Error);
    return {
      success: false,
      error: 'حدث خطأ أثناء التحقق من الرابط',
    };
  }
}
