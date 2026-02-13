import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Post } from '@/models';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { postId, status } = await request.json();

    if (!postId || !status) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'حالة غير صحيحة' }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findByIdAndUpdate(
      postId,
      { status },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: 'المنشور غير موجود' }, { status: 404 });
    }

    revalidatePath('/admin/posts');
    revalidatePath('/posts');
    revalidatePath(`/posts/${postId}`);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error updating post status:', error);
    return NextResponse.json({ error: 'فشل في تحديث الحالة' }, { status: 500 });
  }
}
