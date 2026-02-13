import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { User, Post, Comment } from '@/models';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // Delete all user's posts
    const userPosts = await Post.find({ userId });
    const postIds = userPosts.map(post => post._id);
    
    // Delete all comments on user's posts
    await Comment.deleteMany({ postId: { $in: postIds } });
    
    // Delete all user's comments
    await Comment.deleteMany({ userId });
    
    // Delete all user's posts
    await Post.deleteMany({ userId });
    
    // Delete the user
    await User.findByIdAndDelete(userId);

    revalidatePath('/admin/users');
    revalidatePath('/posts');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'فشل في حذف المستخدم' }, { status: 500 });
  }
}
