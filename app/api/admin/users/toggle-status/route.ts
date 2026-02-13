import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { userId, isActive } = await request.json();

    if (!userId || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    revalidatePath('/admin/users');

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json({ error: 'فشل في تحديث حالة المستخدم' }, { status: 500 });
  }
}
