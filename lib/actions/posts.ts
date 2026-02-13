'use server';

import { connectDB } from '@/lib/db';
import { Post, Comment, User } from '@/models';
import { revalidatePath } from 'next/cache';
import { 
  sanitizeInput, 
  sanitizeHTML, 
  validatePostContent, 
  validateComment,
  sanitizeUsername 
} from '@/lib/validations';
import { logger } from '@/lib/logger';

export async function createPost(userId: string, formData: FormData) {
  try {
    const rawTitle = formData.get('title') as string;
    const rawContent = formData.get('content') as string;
    const rawCategory = formData.get('category') as string;

    // Sanitize inputs
    const title = sanitizeInput(rawTitle);
    const content = sanitizeHTML(rawContent);
    const category = sanitizeInput(rawCategory) || 'عام';

    // Validate
    const validation = validatePostContent(title, content);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      return { success: false, error: firstError };
    }

    await connectDB();

    const post = await Post.create({
      userId,
      title,
      content,
      category,
      status: 'approved',
    });

    logger.info('Post created', { postId: post._id.toString(), userId });

    revalidatePath('/posts');
    revalidatePath(`/profile/${userId}`);

    return { success: true, data: JSON.parse(JSON.stringify(post)) };
  } catch (error: any) {
    logger.error('Error creating post', error, { userId });
    return { success: false, error: 'فشل في إنشاء المنشور' };
  }
}

export async function getPosts(status = 'approved') {
  try {
    await connectDB();

    const posts = await Post.find({ status })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(100) // Limit results to prevent DoS
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(posts)) };
  } catch (error: any) {
    logger.error('Error fetching posts', error);
    return { success: false, error: 'فشل في جلب المنشورات' };
  }
}

export async function getPostById(postId: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(postId)) {
      return { success: false, error: 'معرف المنشور غير صحيح' };
    }

    await connectDB();

    const post = await Post.findById(postId)
      .populate('userId', 'name avatar bio')
      .lean();

    if (!post) {
      return { success: false, error: 'المنشور غير موجود' };
    }

    // Increment views
    await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });

    return { success: true, data: JSON.parse(JSON.stringify(post)) };
  } catch (error: any) {
    logger.error('Error fetching post', error, { postId });
    return { success: false, error: 'فشل في جلب المنشور' };
  }
}

export async function getUserPosts(userId: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return { success: false, error: 'معرف المستخدم غير صحيح' };
    }

    await connectDB();

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100) // Limit results
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(posts)) };
  } catch (error: any) {
    logger.error('Error fetching user posts', error, { userId });
    return { success: false, error: 'فشل في جلب المنشورات' };
  }
}

export async function addComment(
  postId: string, 
  userId: string | null, 
  rawContent: string, 
  rawGuestName?: string
) {
  try {
    // Sanitize inputs
    const content = sanitizeInput(rawContent);
    const guestName = rawGuestName ? sanitizeUsername(rawGuestName) : undefined;

    // Validate
    const validation = validateComment(content, guestName);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      return { success: false, error: firstError };
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(postId)) {
      return { success: false, error: 'معرف المنشور غير صحيح' };
    }

    await connectDB();

    // Check if post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return { success: false, error: 'المنشور غير موجود' };
    }

    // If no userId, create a guest comment
    if (!userId) {
      const comment = await Comment.create({
        postId,
        userId: null,
        content,
        guestName,
      });

      const populatedComment = {
        _id: comment._id,
        postId: comment.postId,
        content: comment.content,
        guestName: comment.guestName,
        createdAt: comment.createdAt,
        userId: null,
      };

      logger.info('Guest comment added', { postId, guestName });

      revalidatePath(`/posts/${postId}`);

      return { success: true, data: JSON.parse(JSON.stringify(populatedComment)) };
    }

    // Regular user comment
    const comment = await Comment.create({
      postId,
      userId,
      content,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name avatar')
      .lean();

    logger.info('User comment added', { postId, userId });

    revalidatePath(`/posts/${postId}`);

    return { success: true, data: JSON.parse(JSON.stringify(populatedComment)) };
  } catch (error: any) {
    logger.error('Error adding comment', error, { postId, userId });
    return { success: false, error: 'فشل في إضافة التعليق' };
  }
}

export async function getPostComments(postId: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(postId)) {
      return { success: false, error: 'معرف المنشور غير صحيح' };
    }

    await connectDB();

    const comments = await Comment.find({ postId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(500) // Limit results
      .lean();

    // Format comments to handle both user and guest comments
    const formattedComments = comments.map((comment: any) => ({
      _id: comment._id,
      postId: comment.postId,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId || null,
      guestName: comment.guestName || null,
    }));

    return { success: true, data: JSON.parse(JSON.stringify(formattedComments)) };
  } catch (error: any) {
    logger.error('Error fetching comments', error, { postId });
    return { success: false, error: 'فشل في جلب التعليقات' };
  }
}

export async function deletePost(postId: string, userId: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(postId) || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return { success: false, error: 'معرف غير صحيح' };
    }

    await connectDB();

    const post = await Post.findOne({ _id: postId, userId });
    if (!post) {
      logger.securityEvent('unauthorized_post_deletion_attempt', { postId, userId });
      return { success: false, error: 'المنشور غير موجود أو ليس لديك صلاحية' };
    }

    await Post.findByIdAndDelete(postId);
    await Comment.deleteMany({ postId });

    logger.info('Post deleted', { postId, userId });

    revalidatePath('/posts');
    revalidatePath(`/profile/${userId}`);

    return { success: true };
  } catch (error: any) {
    logger.error('Error deleting post', error, { postId, userId });
    return { success: false, error: 'فشل في حذف المنشور' };
  }
}
