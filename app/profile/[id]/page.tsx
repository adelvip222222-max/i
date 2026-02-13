'use client';

import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '@/lib/actions/publicUsers';
import { getUserPosts, deletePost } from '@/lib/actions/posts';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  views: number;
  createdAt: string;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '', bio: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    loadProfile();
    loadPosts();
  }, [userId]);

  const loadProfile = async () => {
    const result = await getUserProfile(userId);
    if (result.success) {
      setProfile(result.data);
      setEditData({
        name: result.data.name,
        phone: result.data.phone || '',
        bio: result.data.bio || '',
      });
    }
    setLoading(false);
  };

  const loadPosts = async () => {
    const result = await getUserPosts(userId);
    if (result.success) {
      setPosts(result.data);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editData.name);
    formData.append('phone', editData.phone);
    formData.append('bio', editData.bio);

    const result = await updateUserProfile(userId, formData);
    if (result.success) {
      setProfile(result.data);
      setIsEditing(false);
      
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.name = result.data.name;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;

    const result = await deletePost(postId, userId);
    if (result.success) {
      setPosts(posts.filter((p) => p._id !== postId));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">المستخدم غير موجود</p>
          <Link href="/posts" className="text-blue-600 hover:text-blue-700">
            العودة للمنشورات
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && currentUser.id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/posts" className="text-2xl font-bold text-blue-600">
              4IT
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/posts" className="text-gray-600 hover:text-gray-900">
                المنشورات
              </Link>
              {isOwner && (
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  تسجيل الخروج
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-4xl">
                  {profile.name.charAt(0)}
                </span>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="الاسم"
                    />
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="رقم الهاتف"
                    />
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="نبذة عنك"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        حفظ
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                      {isOwner && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          ✏️ تعديل
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">📧 {profile.email}</p>
                    {profile.phone && (
                      <p className="text-gray-600 mb-2">📱 {profile.phone}</p>
                    )}
                    {profile.bio && (
                      <p className="text-gray-700 mt-4 p-4 bg-gray-50 rounded-lg">
                        {profile.bio}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-4">
                      انضم في {new Date(profile.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              المنشورات ({posts.length})
            </h2>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">لا توجد منشورات بعد</p>
                {isOwner && (
                  <Link
                    href="/posts/new"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                  >
                    إنشاء منشور
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link
                            href={`/posts/${post._id}`}
                            className="text-xl font-bold text-gray-900 hover:text-blue-600"
                          >
                            {post.title}
                          </Link>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              post.status === 'approved'
                                ? 'bg-green-100 text-green-600'
                                : post.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {post.status === 'approved'
                              ? 'منشور'
                              : post.status === 'pending'
                              ? 'قيد المراجعة'
                              : 'مرفوض'}
                          </span>
                        </div>
                        <p className="text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                            {post.category}
                          </span>
                          <span>👁️ {post.views}</span>
                          <span>{new Date(post.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-600 hover:text-red-700 ml-4"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
