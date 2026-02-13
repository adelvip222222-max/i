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

    // Delete only if message belongs to user's site
    const message = await Message.findOneAndDelete({ 
      _id: messageId, 
      siteId: site._id 
    });

    if (!message) {
      return NextResponse.json({ error: 'الرسالة غير موجودة أو لا تملك صلاحية الوصول' }, { status: 404 });
    }

    revalidatePath('/admin/messages');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'فشل في حذف الرسالة' }, { status: 500 });
  }
}
