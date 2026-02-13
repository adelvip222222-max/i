'use server';

import { connectDB } from '@/lib/db';
import { Message } from '@/models';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { validateMessageForm, sanitizeInput } from '@/lib/validations';

export async function createMessage(formData: FormData) {
  try {
    const data = {
      name: sanitizeInput(formData.get('name') as string),
      email: sanitizeInput(formData.get('email') as string),
      phone: formData.get('phone') ? sanitizeInput(formData.get('phone') as string) : undefined,
      subject: formData.get('subject') ? sanitizeInput(formData.get('subject') as string) : 'استفسار عام',
      message: sanitizeInput(formData.get('message') as string),
    };

    const validation = validateMessageForm(data);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      return { success: false, error: firstError };
    }

    await connectDB();
    const message = await Message.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    });

    revalidatePath('/admin/messages');

    return { success: true, data: JSON.parse(JSON.stringify(message)) };
  } catch (error: any) {
    console.error('Error creating message:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return { success: false, error: 'خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى.' };
    }
    
    if (error.name === 'ValidationError') {
      return { success: false, error: 'البيانات المدخلة غير صحيحة. يرجى التحقق من جميع الحقول.' };
    }
    
    return { success: false, error: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' };
  }
}

export async function getMessages() {
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
    
    // Get only messages for this site
    const messages = await Message.find({ siteId: site._id })
      .sort({ createdAt: -1 })
      .lean();
      
    return { success: true, data: JSON.parse(JSON.stringify(messages)) };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { success: false, error: 'فشل في جلب الرسائل' };
  }
}

export async function markMessageAsRead(id: string) {
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
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }
    
    // Update only if message belongs to user's site
    const message = await Message.findOneAndUpdate(
      { _id: id, siteId: site._id },
      { isRead: true },
      { new: true }
    ).lean();

    if (!message) {
      return { success: false, error: 'الرسالة غير موجودة أو لا تملك صلاحية الوصول' };
    }

    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');

    return { success: true, data: JSON.parse(JSON.stringify(message)) };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return { success: false, error: 'فشل في تحديث الرسالة' };
  }
}

export async function deleteMessage(id: string) {
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
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }
    
    // Delete only if message belongs to user's site
    const result = await Message.findOneAndDelete({ 
      _id: id, 
      siteId: site._id 
    });

    if (!result) {
      return { success: false, error: 'الرسالة غير موجودة أو لا تملك صلاحية الوصول' };
    }

    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: 'فشل في حذف الرسالة' };
  }
}

export async function getUnreadCount() {
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
      return { success: true, data: 0 };
    }
    
    // Count only unread messages for this site
    const count = await Message.countDocuments({ 
      siteId: site._id,
      isRead: false 
    });
    
    return { success: true, data: count };
  } catch (error) {
    console.error('Error counting unread messages:', error);
    return { success: false, error: 'فشل في حساب الرسائل' };
  }
}
