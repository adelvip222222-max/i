import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Message } from '@/models';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { messageId } = await request.json();

    if (!messageId) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    await connectDB();
    
    // Get user's site
    const { Site } = await import('@/models');
    const site = await Site.findOne({ userId: session.user.id });
    
    if (!site) {
      return NextResponse.json({ error: 'لم يتم العثور على الموقع' }, { status: 404 });
    }

    // Update only if message belongs to user's site
    const message = await Message.findOneAndUpdate(
      { _id: messageId, siteId: site._id },
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return NextResponse.json({ error: 'الرسالة غير موجودة أو لا تملك صلاحية الوصول' }, { status: 404 });
    }

    revalidatePath('/admin/messages');

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json({ error: 'فشل في تحديث الرسالة' }, { status: 500 });
  }
}
