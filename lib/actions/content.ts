'use server';

import { connectDB } from '@/lib/db';
import { Content } from '@/models';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const contentSchema = z.object({
  titleAr: z.string().optional(),
  titleEn: z.string().optional(),
  subtitleAr: z.string().optional(),
  subtitleEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  images: z.array(z.string()).optional(),
  features: z.any().optional(),
});

export async function getContent(type: 'hero' | 'about') {
  try {
    await connectDB();
    const content = await Content.findOne({ type }).lean();
    return { success: true, data: content ? JSON.parse(JSON.stringify(content)) : null };
  } catch (error) {
    console.error('Error fetching content:', error);
    return { success: false, error: 'فشل في جلب المحتوى' };
  }
}

export async function updateContent(type: 'hero' | 'about', formData: FormData) {
  const session = await auth();
  if (!session) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    const data: any = {
      titleAr: formData.get('titleAr') as string || undefined,
      titleEn: formData.get('titleEn') as string || undefined,
      subtitleAr: formData.get('subtitleAr') as string || undefined,
      subtitleEn: formData.get('subtitleEn') as string || undefined,
      descriptionAr: formData.get('descriptionAr') as string || undefined,
      descriptionEn: formData.get('descriptionEn') as string || undefined,
    };

    // Handle features for about section
    if (type === 'about' && formData.get('features')) {
      try {
        data.features = JSON.parse(formData.get('features') as string);
      } catch {
        data.features = undefined;
      }
    }

    const validated = contentSchema.parse(data);

    await connectDB();
    const content = await Content.findOneAndUpdate(
      { type },
      { ...validated, type },
      { new: true, upsert: true }
    ).lean();

    revalidatePath('/');
    revalidatePath('/admin/content');

    return { success: true, data: JSON.parse(JSON.stringify(content)) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Error updating content:', error);
    return { success: false, error: 'فشل في تحديث المحتوى' };
  }
}
