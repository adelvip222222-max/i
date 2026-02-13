'use client';

import { useEffect, useState } from 'react';
import { getPosts } from '@/lib/actions/posts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views'>('newest');

  const categories = ['الكل', 'عام', 'تقني', 'برمجة', 'تصميم', 'شبكات', 'أمن معلومات', 'أخرى'];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadPosts();
  }, []);

  useEffect(() => {
    let result = [...posts];

    // Filter by category
    if (selectedCategory !== 'الكل') {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'views') return b.views - a.views;
      return 0;
    });

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const loadPosts = async () => {
    try {
      const result = await getPosts();
      if (result.success && result.data) {
        setPosts(result.data);
        setFilteredPosts(result.data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      {/* Page Header Area */}
      <div className="bg-slate-900 text-white py-16 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">المدونة التقنية</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            اكتشف أحدث المقالات والأخبار في عالم التكنولوجيا، البرمجة، وحلول الأعمال.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 mb-10 -mt-20 relative z-20">
          <div className="flex flex-col gap-6">
            
            {/* Top Row: Search & Create */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:max-w-md group">
                <input
                  type="text"
                  placeholder="ابحث عن موضوع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  🔍
                </span>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    if (user) {
                      router.push('/posts/new');
                    } else {
                      router.push('/login?redirect=/posts/new');
                    }
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-600/30"
                >
                  <span>✍️</span>
                  <span>مقال جديد</span>
                </button>
                
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="flex-1 md:flex-none bg-slate-50 border border-slate-200 text-slate-700 py-3.5 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option value="newest">الأحدث نشرًا</option>
                  <option value="oldest">الأقدم نشرًا</option>
                  <option value="views">الأكثر مشاهدة</option>
                </select>
              </div>
            </div>

            {/* Categories Tags */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-md transform scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 h-80 animate-pulse border border-slate-100 shadow-sm">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد مقالات</h3>
            <p className="text-slate-500">لم يتم العثور على مقالات تطابق بحثك.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post._id} href={`/posts/${post._id}`} className="group h-full">
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                  
                  {/* Card Header (User Info) */}
                  <div className="p-6 pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {post.userId.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-slate-800">{post.userId.name}</span>
                         <span className="text-xs text-slate-500">
                           {new Date(post.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' })}
                         </span>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                       <span>👁️</span> {post.views} مشاهدة
                    </div>
                    <div className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform text-blue-500 font-medium opacity-0 group-hover:opacity-100">
                      اقرأ المزيد <span>←</span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}