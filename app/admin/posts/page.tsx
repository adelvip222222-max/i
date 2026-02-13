import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Post, User } from '@/models';
import { connectDB } from '@/lib/db';
import PostsManager from '@/components/admin/PostsManager';

export const runtime = 'nodejs';

async function getAllPosts() {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function AdminPostsPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/admin/login');
  }

  const posts = await getAllPosts();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المنشورات</h1>
        <p className="text-gray-600">
          إجمالي المنشورات: {posts.length}
        </p>
      </div>

      <PostsManager initialPosts={posts} />
    </div>
  );
}
