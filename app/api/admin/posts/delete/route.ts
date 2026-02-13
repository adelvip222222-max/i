import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Post, Comment } from '@/models';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'المنشور غير موجود' }, { status: 404 });
    }

    // Delete all comments for this post
    await Comment.deleteMany({ postId });

    // Delete the post
    await Post.findByIdAndDelete(postId);

    revalidatePath('/admin/posts');
    revalidatePath('/posts');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'فشل في حذف المنشور' }, { status: 500 });
  }
}
