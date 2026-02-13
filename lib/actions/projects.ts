'use server';

import { connectDB } from '@/lib/db';
import { Project } from '@/models';
import { auth } from '@/auth';

export async function getAllProjects() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    
    const { Site } = await import('@/models');
    const site = await Site.findOne({ userId: session.user.id }).lean();
    
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }

    const projects = await Project.find({ siteId: site._id })
      .sort({ order: 1 })
      .lean();

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(projects))
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: 'فشل في جلب المشاريع' };
  }
}

export async function createProject(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    
    const { Site } = await import('@/models');
    const site = await Site.findOne({ userId: session.user.id }).lean();
    
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }

    const project = await Project.create({
      siteId: site._id,
      titleAr: formData.get('titleAr'),
      titleEn: formData.get('titleEn'),
      descriptionAr: formData.get('descriptionAr'),
      descriptionEn: formData.get('descriptionEn'),
      image: formData.get('image'),
      category: formData.get('category'),
      client: formData.get('client') || undefined,
      date: formData.get('date') ? new Date(formData.get('date') as string) : undefined,
      url: formData.get('url') || undefined,
      isActive: formData.get('isActive') === 'true',
      order: parseInt(formData.get('order') as string) || 0,
    });

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(project))
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'فشل في إنشاء المشروع' };
  }
}

export async function updateProject(id: string, formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();

    const project = await Project.findByIdAndUpdate(
      id,
      {
        titleAr: formData.get('titleAr'),
        titleEn: formData.get('titleEn'),
        descriptionAr: formData.get('descriptionAr'),
        descriptionEn: formData.get('descriptionEn'),
        image: formData.get('image'),
        category: formData.get('category'),
        client: formData.get('client') || undefined,
        date: formData.get('date') ? new Date(formData.get('date') as string) : undefined,
        url: formData.get('url') || undefined,
        isActive: formData.get('isActive') === 'true',
        order: parseInt(formData.get('order') as string) || 0,
      },
      { new: true }
    ).lean();

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(project))
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'فشل في تحديث المشروع' };
  }
}

export async function deleteProject(id: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    await Project.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'فشل في حذف المشروع' };
  }
}
