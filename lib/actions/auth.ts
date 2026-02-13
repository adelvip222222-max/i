'use server';

import { auth, signIn, signOut } from '@/auth';
import Site from '@/models/Site';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { connectDB } from '../db';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    const validatedFields = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return 'بيانات غير صحيحة';
    }

    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: true,
      redirectTo: '/admin/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        default:
          return 'حدث خطأ أثناء تسجيل الدخول';
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}

// دالة مساعدة لجلب معرف السيت الخاص بالمستخدم الحالي
export async function getCurrentSiteId() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectDB();
  const site = await Site.findOne({ userId: session.user.id }).select('_id');
  return site ? site._id : null;
}
