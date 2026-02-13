import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Post, User } from '@/models';
import { connectDB } from '@/lib/db';
import UsersManager from '@/components/admin/UsersManager';

export const runtime = 'nodejs';

async function getAllUsers() {
  try {
    await connectDB();
    
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    
    // Get post count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const postCount = await Post.countDocuments({ userId: user._id });
        return {
          ...user,
          postCount,
        };
      })
    );
    
    return JSON.parse(JSON.stringify(usersWithStats));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/admin-login');
  }

  const users = await getAllUsers();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
        <p className="text-gray-600">
          إجمالي المستخدمين: {users.length}
        </p>
      </div>

      <UsersManager initialUsers={users} />
    </div>
  );
}
