'use server';

import { connectDB } from '@/lib/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { AuthError } from 'next-auth';

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;

    if (!name || !email || !password) {
      return { success: false, error: 'جميع الحقول مطلوبة' };
    }

    if (password.length < 6) {
      return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return {
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  } catch (error: any) {
    console.error('Error registering user:', error);
    return { success: false, error: 'فشل في إنشاء الحساب' };
  }
}

// export async function loginPublicUser(formData: FormData) {
//   try {
//     const email = formData.get('email') as string;
//     const password = formData.get('password') as string;

//     if (!email || !password) {
//       return { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' };
//     }

//     await signInPublic('credentials', {
//       email,
//       password,
//       redirect: false,
//     });

//     return { success: true };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
//     }
//     console.error('Error logging in:', error);
//     return { success: false, error: 'فشل في تسجيل الدخول' };
//   }
// }

// Keep old function for backward compatibility


export async function getUserProfile(userId: string) {
  try {
    await connectDB();

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return { success: false, error: 'المستخدم غير موجود' };
    }

    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: 'فشل في جلب الملف الشخصي' };
  }
}

export async function updateUserProfile(userId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const bio = formData.get('bio') as string;

    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, bio },
      { new: true }
    ).select('-password').lean();

    if (!user) {
      return { success: false, error: 'المستخدم غير موجود' };
    }

    revalidatePath(`/profile/${userId}`);

    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'فشل في تحديث الملف الشخصي' };
  }
}
