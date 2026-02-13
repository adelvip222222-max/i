'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

interface PostsManagerProps {
  initialPosts: Post[];
}

export default function PostsManager({ initialPosts }: PostsManagerProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const updatePostStatus = async (postId: string, newStatus: 'approved' | 'rejected') => {
    // محاكاة التحديث
    setPosts(posts.map(post => 
      post._id === postId ? { ...post, status: newStatus } : post
    ));
  };

  const deletePost = async (postId: string) => {
    if(!confirm('حذف المقال؟')) return;
    setPosts(posts.filter(p => p._id !== postId));
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' ? true : post.status === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
       {/* Filters */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="بحث في المقالات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
         </div>
         <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'all' ? 'الكل' : f === 'pending' ? 'قيد المراجعة' : f === 'approved' ? 'منشور' : 'مرفوض'}
              </button>
            ))}
         </div>
       </div>

       {/* Table */}
       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-right">
             <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-bold">
               <tr>
                 <th className="p-5 whitespace-nowrap">العنوان</th>
                 <th className="p-5 whitespace-nowrap">الكاتب</th>
                 <th className="p-5 whitespace-nowrap">الحالة</th>
                 <th className="p-5 whitespace-nowrap">المشاهدات</th>
                 <th className="p-5 text-center whitespace-nowrap">الإجراءات</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredPosts.map((post) => (
                 <tr key={post._id} className="hover:bg-blue-50/20 transition-colors group">
                   <td className="p-5">
                     <p className="font-bold text-slate-800 line-clamp-1 max-w-xs" title={post.title}>{post.title}</p>
                     <p className="text-xs text-slate-400 mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                   </td>
                   <td className="p-5">
                     <div className="flex items-center gap-2">
                       <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                         {post.userId.name.charAt(0)}
                       </span>
                       <span className="text-sm font-medium text-slate-700">{post.userId.name}</span>
                     </div>
                   </td>
                   <td className="p-5">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                       post.status === 'approved' ? 'bg-green-100 text-green-700' :
                       post.status === 'rejected' ? 'bg-red-100 text-red-700' :
                       'bg-yellow-100 text-yellow-700'
                     }`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${
                          post.status === 'approved' ? 'bg-green-500' :
                          post.status === 'rejected' ? 'bg-red-500' :
                          'bg-yellow-500'
                       }`}></span>
                       {post.status === 'approved' ? 'منشور' : post.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                     </span>
                   </td>
                   <td className="p-5 font-mono text-sm text-slate-600">{post.views}</td>
                   <td className="p-5">
                     <div className="flex justify-center gap-2 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                        <Link href={`/posts/${post._id}`} target="_blank" className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-lg transition" title="عرض">
                          👁️
                        </Link>
                        {post.status !== 'approved' && (
                          <button onClick={() => updatePostStatus(post._id, 'approved')} className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg font-bold transition" title="قبول">
                            ✓
                          </button>
                        )}
                        {post.status !== 'rejected' && (
                          <button onClick={() => updatePostStatus(post._id, 'rejected')} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold transition" title="رفض">
                            ✗
                          </button>
                        )}
                        <button onClick={() => deletePost(post._id)} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg transition" title="حذف">
                          🗑️
                        </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           {filteredPosts.length === 0 && (
              <div className="p-10 text-center text-slate-400">
                لا توجد مقالات مطابقة
              </div>
           )}
         </div>
       </div>
    </div>
  );
}