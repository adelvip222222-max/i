'use server';

import { connectDB } from '@/lib/db';
import Site from '@/models/Site';
import { auth } from '@/auth';

export async function checkUserSite() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { hasSite: false, needsAuth: true };
  }
  console.log("session" , session)

  try {
    await connectDB();
    const site = await Site.findOne({ userId: session.user.id });
    
    return { 
      hasSite: !!site, 
      needsAuth: false,
      site: site ? JSON.parse(JSON.stringify(site)) : null
    };
  } catch (error) {
    console.error('Error checking user site:', error);
    return { hasSite: false, needsAuth: false, error: true };
  }
}

export async function getUserSite() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    const site = await Site.findOne({ userId: session.user.id }).lean();
    
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(site))
    };
  } catch (error) {
    console.error('Error fetching user site:', error);
    return { success: false, error: 'فشل في جلب بيانات الموقع' };
  }
}

export async function updateSiteInfo(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    
    const nameAr = formData.get('nameAr') as string;
    const description = formData.get('description') as string;
    const siteType = formData.get('siteType') as string;
    const primaryColor = formData.get('primaryColor') as string;
    const secondaryColor = formData.get('secondaryColor') as string;
    const isActive = formData.get('isActive') === 'on';
    const logoData = formData.get('logoData') as string; // الصورة المضغوطة

    // جلب صور Hero (حد أقصى 3)
    const heroImage1 = formData.get('heroImage1') as string;
    const heroImage2 = formData.get('heroImage2') as string;
    const heroImage3 = formData.get('heroImage3') as string;

    // التحقق من الحقول المطلوبة
    if (!nameAr || !siteType) {
      return { success: false, error: 'الاسم ونوع الموقع مطلوبان' };
    }

    // إعداد البيانات للتحديث
    const updateData: any = {
      nameAr,
      description,
      siteType,
      themeColors: {
        primary: primaryColor,
        secondary: secondaryColor,
      },
      isActive,
    };

    // إضافة الشعار إذا تم رفعه (الصورة المضغوطة)
    if (logoData && logoData.startsWith('data:')) {
      updateData.logo = logoData;
    }

    // إضافة صور Hero
    const heroImages: string[] = [];
    if (heroImage1 && heroImage1.startsWith('data:')) heroImages.push(heroImage1);
    if (heroImage2 && heroImage2.startsWith('data:')) heroImages.push(heroImage2);
    if (heroImage3 && heroImage3.startsWith('data:')) heroImages.push(heroImage3);
    
    if (heroImages.length > 0) {
      updateData.heroImages = heroImages;
    }

    // تحديث الموقع
    const site = await Site.findOneAndUpdate(
      { userId: session.user.id },
      updateData,
      { new: true }
    ).lean();

    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(site))
    };
  } catch (error) {
    console.error('Error updating site:', error);
    return { success: false, error: 'فشل في تحديث بيانات الموقع' };
  }
}
