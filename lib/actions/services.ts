'use server';

import { connectDB } from '@/lib/db';
import { Service, Site, User } from '@/models';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

/**
 * Get services for super-admin site only (for homepage)
 */
export async function getSuperAdminServices() {
  try {
    await connectDB();
    
    // Find super-admin user
    const superAdmin = await User.findOne({ role: 'super-admin' });
    
    if (!superAdmin) {
      return { success: true, data: [] };
    }
    
    // Find super-admin's site
    const superAdminSite = await Site.findOne({ userId: superAdmin._id });
    
    if (!superAdminSite) {
      return { success: true, data: [] };
    }
    
    // Get services for super-admin site only
    const services = await Service.find({ 
      siteId: superAdminSite._id,
      isActive: true 
    }).sort({ order: 1, createdAt: -1 }).lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(services)) };
  } catch (error) {
    console.error('Error fetching super-admin services:', error);
    return { success: false, error: 'فشل في جلب الخدمات' };
  }
}

/**
 * Get all services from all sites (for subscribers directory)
 */
export async function getServices() {
  try {
    await connectDB();
    // Get all active services from all sites for public display
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(services)) };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { success: false, error: 'فشل في جلب الخدمات' };
  }
}

export async function getAllServices() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    
    // Get user's site
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return { success: false, data: [] };
    }

    // Get services for this site only
    const services = await Service.find({ siteId: site._id }).sort({ order: 1, createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(services)) };
  } catch (error) {
    console.error('Error fetching all services:', error);
    return { success: false, error: 'فشل في جلب الخدمات' };
  }
}

export async function createService(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    const nameAr = formData.get('nameAr') as string;
    const nameEn = formData.get('nameEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const icon = formData.get('icon') as string;
    const isActive = formData.get('isActive') === 'true';
    const imageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('imageFile') as File;

    if (!nameAr || !nameEn || !descriptionAr || !descriptionEn || !icon) {
      return { success: false, error: 'جميع الحقول مطلوبة' };
    }

    await connectDB();
    
    // Get user's site
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }

    let finalImageUrl = imageUrl || '';

    // Handle image file upload
    if (imageFile && imageFile.size > 0) {
      try {
        // Convert image to base64
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Check file size (max 5MB)
        if (buffer.length > 5 * 1024 * 1024) {
          return { success: false, error: 'حجم الصورة يجب أن يكون أقل من 5MB' };
        }

        // Compress and convert to base64
        const sharp = require('sharp');
        const compressedBuffer = await sharp(buffer)
          .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        const base64Image = `data:${imageFile.type};base64,${compressedBuffer.toString('base64')}`;
        finalImageUrl = base64Image;
      } catch (error) {
        console.error('Error processing image:', error);
        // Continue without image if processing fails
      }
    }

    await Service.create({
      siteId: site._id,
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      icon,
      image: finalImageUrl,
      isActive,
    });

    revalidatePath('/admin/services');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, error: 'فشل في إنشاء الخدمة' };
  }
}

export async function updateService(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    const nameAr = formData.get('nameAr') as string;
    const nameEn = formData.get('nameEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const icon = formData.get('icon') as string;
    const isActive = formData.get('isActive') === 'true';
    const imageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('imageFile') as File;

    if (!nameAr || !nameEn || !descriptionAr || !descriptionEn || !icon) {
      return { success: false, error: 'جميع الحقول مطلوبة' };
    }

    await connectDB();
    
    // Verify the service belongs to the user's site
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }

    const service = await Service.findOne({ _id: id, siteId: site._id });
    
    if (!service) {
      return { success: false, error: 'الخدمة غير موجودة' };
    }

    let finalImageUrl = imageUrl || service.image || '';

    // Handle image file upload
    if (imageFile && imageFile.size > 0) {
      try {
        // Convert image to base64
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Check file size (max 5MB)
        if (buffer.length > 5 * 1024 * 1024) {
          return { success: false, error: 'حجم الصورة يجب أن يكون أقل من 5MB' };
        }

        // Compress and convert to base64
        const sharp = require('sharp');
        const compressedBuffer = await sharp(buffer)
          .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        const base64Image = `data:${imageFile.type};base64,${compressedBuffer.toString('base64')}`;
        finalImageUrl = base64Image;
      } catch (error) {
        console.error('Error processing image:', error);
        // Continue with existing image if processing fails
      }
    }

    await Service.findByIdAndUpdate(id, {
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      icon,
      image: finalImageUrl,
      isActive,
    });

    revalidatePath('/admin/services');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error updating service:', error);
    return { success: false, error: 'فشل في تحديث الخدمة' };
  }
}

export async function deleteService(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    
    // Verify the service belongs to the user's site
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }

    const service = await Service.findOne({ _id: id, siteId: site._id });
    
    if (!service) {
      return { success: false, error: 'الخدمة غير موجودة' };
    }

    await Service.findByIdAndDelete(id);

    revalidatePath('/admin/services');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: 'فشل في حذف الخدمة' };
  }
}
