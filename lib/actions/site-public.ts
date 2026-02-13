'use server';

import { connectDB } from '@/lib/db';
import { Site, Service, ContactInfo, SocialLink, Project } from '@/models';

export async function getSiteBySlug(slug: string) {
  try {
    await connectDB();
    const site = await Site.findOne({ slug, isActive: true }).lean();
    
    if (!site) {
      return { success: false, error: 'الموقع غير موجود' };
    }

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(site))
    };
  } catch (error) {
    console.error('Error fetching site:', error);
    return { success: false, error: 'فشل في جلب بيانات الموقع' };
  }
}

export async function getSiteServices(siteId: string) {
  try {
    await connectDB();
    
    // تحويل siteId إلى ObjectId إذا كان string
    const mongoose = await import('mongoose');
    const objectId = new mongoose.Types.ObjectId(siteId);
    
    const services = await Service.find({ 
      siteId: objectId, 
      isActive: true 
    }).sort({ order: 1 }).lean();
    
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(services))
    };
  } catch (error) {
    console.error('Error fetching site services:', error);
    return { success: false, data: [] };
  }
}

export async function getSiteContactInfo(siteId: string) {
  try {
    await connectDB();
    
    // تحويل siteId إلى ObjectId إذا كان string
    const mongoose = await import('mongoose');
    const objectId = new mongoose.Types.ObjectId(siteId);
    
    const contact = await ContactInfo.findOne({ siteId: objectId }).lean();
    
    return { 
      success: true, 
      data: contact ? JSON.parse(JSON.stringify(contact)) : null
    };
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return { success: false, data: null };
  }
}

export async function getSiteSocialLinks(siteId: string) {
  try {
    await connectDB();
    
    // تحويل siteId إلى ObjectId إذا كان string
    const mongoose = await import('mongoose');
    const objectId = new mongoose.Types.ObjectId(siteId);
    
    const links = await SocialLink.find({ 
      siteId: objectId,
      isActive: true 
    }).sort({ order: 1 }).lean();
    
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(links))
    };
  } catch (error) {
    console.error('Error fetching social links:', error);
    return { success: false, data: [] };
  }
}

export async function getSiteProjects(siteId: string) {
  try {
    await connectDB();
    
    // تحويل siteId إلى ObjectId إذا كان string
    const mongoose = await import('mongoose');
    const objectId = new mongoose.Types.ObjectId(siteId);
    
    const projects = await Project.find({ 
      siteId: objectId, 
      isActive: true 
    }).sort({ order: 1 }).lean();
    
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(projects))
    };
  } catch (error) {
    console.error('Error fetching site projects:', error);
    return { success: false, data: [] };
  }
}

export async function submitContactMessage(siteId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      return { success: false, error: 'جميع الحقول مطلوبة' };
    }

    await connectDB();

    const { Message } = await import('@/models');
    
    await Message.create({
      siteId,
      name,
      email,
      subject: subject || 'رسالة من الموقع', // استخدام الموضوع المدخل أو القيمة الافتراضية
      message,
      isRead: false,
    });

    return { success: true, message: 'تم إرسال رسالتك بنجاح' };
  } catch (error) {
    console.error('Error submitting message:', error);
    return { success: false, error: 'فشل في إرسال الرسالة' };
  }
}

export async function getSitePosts(siteId: string) {
  try {
    await connectDB();
    
    const mongoose = await import('mongoose');
    const objectId = new mongoose.Types.ObjectId(siteId);
    
    const { Post } = await import('@/models');
    
    const posts = await Post.find({ 
      siteId: objectId,
      status: 'approved'
    })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .lean();
    
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(posts))
    };
  } catch (error) {
    console.error('Error fetching site posts:', error);
    return { success: false, data: [] };
  }
}

export async function getPostComments(postId: string) {
  try {
    await connectDB();
    
    const mongoose = await import('mongoose');
    const objectId = new mongoose.Types.ObjectId(postId);
    
    const { Comment } = await import('@/models');
    
    const comments = await Comment.find({ postId: objectId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name')
      .lean();
    
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(comments))
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, data: [] };
  }
}

export async function submitComment(postId: string, formData: FormData) {
  try {
    const content = formData.get('content') as string;
    const guestName = formData.get('guestName') as string;

    if (!content || !guestName) {
      return { success: false, error: 'الاسم والتعليق مطلوبان' };
    }

    await connectDB();

    const { Comment } = await import('@/models');
    
    const comment = await Comment.create({
      postId,
      guestName,
      content,
    });

    return { 
      success: true, 
      message: 'تم إضافة تعليقك بنجاح',
      data: JSON.parse(JSON.stringify(comment))
    };
  } catch (error) {
    console.error('Error submitting comment:', error);
    return { success: false, error: 'فشل في إضافة التعليق' };
  }
}
