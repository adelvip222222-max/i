'use server';

import { connectDB } from '@/lib/db';
import { ContactInfo, SocialLink } from '@/models';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { isValidEmail, isValidPhone, isValidURL } from '@/lib/validations';

export async function getContactInfo() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, data: null };
  }

  try {
    await connectDB();
    
    // Get user's site
    const { Site } = await import('@/models');
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return { success: false, data: null };
    }
    
    const contact = await ContactInfo.findOne({ siteId: site._id }).lean();
    return { success: true, data: contact ? JSON.parse(JSON.stringify(contact)) : null };
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return { success: false, error: 'فشل في جلب معلومات الاتصال' };
  }
}

export async function updateContactInfo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const mapUrl = formData.get('mapUrl') as string;

    if (!isValidPhone(phone)) {
      return { success: false, error: 'رقم الهاتف غير صحيح' };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: 'البريد الإلكتروني غير صحيح' };
    }

    if (mapUrl && !isValidURL(mapUrl)) {
      return { success: false, error: 'رابط الخريطة غير صحيح' };
    }

    await connectDB();
    
    // Get user's site
    const { Site } = await import('@/models');
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }
    
    const contact = await ContactInfo.findOneAndUpdate(
      { siteId: site._id },
      { siteId: site._id, phone, email, address, mapUrl },
      { new: true, upsert: true }
    ).lean();

    revalidatePath('/');
    revalidatePath('/admin/settings');

    return { success: true, data: JSON.parse(JSON.stringify(contact)) };
  } catch (error) {
    console.error('Error updating contact info:', error);
    return { success: false, error: 'فشل في تحديث معلومات الاتصال' };
  }
}

export async function getSocialLinks() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, data: [] };
  }

  try {
    await connectDB();
    
    // Get user's site
    const { Site } = await import('@/models');
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return { success: false, data: [] };
    }
    
    const links = await SocialLink.find({ siteId: site._id, isActive: true }).sort({ order: 1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(links)) };
  } catch (error) {
    console.error('Error fetching social links:', error);
    return { success: false, error: 'فشل في جلب روابط التواصل' };
  }
}

export async function getAllSocialLinks() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    
    // Get user's site
    const { Site } = await import('@/models');
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return { success: false, data: [] };
    }
    
    const links = await SocialLink.find({ siteId: site._id }).sort({ order: 1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(links)) };
  } catch (error) {
    console.error('Error fetching all social links:', error);
    return { success: false, error: 'فشل في جلب روابط التواصل' };
  }
}

export async function updateSocialLink(id: string, formData: FormData) {
  const session = await auth();
  if (!session) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    const url = formData.get('url') as string;
    const isActive = formData.get('isActive') === 'true';

    if (url && !isValidURL(url)) {
      return { success: false, error: 'الرابط غير صحيح' };
    }

    await connectDB();
    const link = await SocialLink.findByIdAndUpdate(id, { url, isActive }, { new: true }).lean();

    if (!link) {
      return { success: false, error: 'الرابط غير موجود' };
    }

    revalidatePath('/');
    revalidatePath('/admin/settings');

    return { success: true, data: JSON.parse(JSON.stringify(link)) };
  } catch (error) {
    console.error('Error updating social link:', error);
    return { success: false, error: 'فشل في تحديث الرابط' };
  }
}

export async function createSocialLink(platform: string, url: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    if (!url || !isValidURL(url)) {
      return { success: false, error: 'الرابط غير صحيح' };
    }

    if (!platform) {
      return { success: false, error: 'المنصة مطلوبة' };
    }

    await connectDB();
    
    // Get user's site
    const { Site } = await import('@/models');
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }
    
    // Check if platform already exists for this site
    const existingLink = await SocialLink.findOne({ siteId: site._id, platform });
    if (existingLink) {
      return { success: false, error: 'هذه المنصة موجودة بالفعل' };
    }

    const newLink = await SocialLink.create({
      siteId: site._id,
      platform,
      url,
      isActive: true,
      order: await SocialLink.countDocuments({ siteId: site._id }) + 1,
    });

    revalidatePath('/');
    revalidatePath('/admin/settings');

    return { success: true, data: JSON.parse(JSON.stringify(newLink)) };
  } catch (error) {
    console.error('Error creating social link:', error);
    return { success: false, error: 'فشل في إضافة الرابط' };
  }
}

export async function deleteSocialLink(id: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    const link = await SocialLink.findByIdAndDelete(id);

    if (!link) {
      return { success: false, error: 'الرابط غير موجود' };
    }

    revalidatePath('/');
    revalidatePath('/admin/settings');

    return { success: true };
  } catch (error) {
    console.error('Error deleting social link:', error);
    return { success: false, error: 'فشل في حذف الرابط' };
  }
}
