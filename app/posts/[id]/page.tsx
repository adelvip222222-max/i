'use client';

import { useEffect, useState } from 'react';
import { getPostById, getPostComments, addComment } from '@/lib/actions/posts';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

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
    bio?: string;
  };
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    avatar?: string;
  } | null;
  guestName?: string | null;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Comment Form States
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchData();
  }, [postId]);

  const fetchData = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        getPostById(postId),
        getPostComments(postId),
      ]);

      if (postRes.success) setPost(postRes.data);
      if (commentsRes.success) setComments(commentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await addComment(
        postId,
        user?.id || null,
        commentText,
        user ? undefined : guestName
      );

      if (result.success) {
        setCommentText('');
        if (!user) setGuestName('');
        // Refresh comments only
        const newComments = await getPostComments(postId);
        if (newComments.success) setComments(newComments.data);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">جاري تحميل المقال...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">404</h1>
        <p className="text-slate-600 text-lg mb-8">عذراً، المقال الذي تبحث عنه غير موجود.</p>
        <Link href="/posts" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          العودة للمقالات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. Article Hero Header */}
      <div className="relative bg-slate-900 pt-32 pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
           {/* Breadcrumbs */}
           <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
             <Link href="/posts" className="hover:text-blue-400 transition">المدونة</Link>
             <span>/</span>
             <span className="text-slate-200 truncate max-w-[200px]">{post.category}</span>
           </div>

           <div className="max-w-4xl">
             <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6 backdrop-blur-sm">
               {post.category}
             </span>
             <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
               {post.title}
             </h1>

             <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm md:text-base border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {post.userId.name.charAt(0).toUpperCase()}
                   </div>
                   <span className="font-medium text-white">{post.userId.name}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span>📅</span>
                   <span>
                     {new Date(post.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                   </span>
                </div>
                <div className="flex items-center gap-2">
                   <span>👁️</span>
                   <span>{post.views} مشاهدة</span>
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 2. Main Content Column */}
          <div className="lg:w-3/4">
            
            {/* Post Body Card */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-10">
               <div className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 hover:prose-a:text-blue-700 max-w-none leading-loose">
                  {/* We are rendering plain text here. If you have Markdown/HTML, you'd use a parser */}
                  <div className="whitespace-pre-line">
                    {post.content}
                  </div>
               </div>
            </div>

            {/* 3. Comments Section */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-100">
               <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                 💬 النقاشات 
                 <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">{comments.length}</span>
               </h3>

               {/* Add Comment Form */}
               <div className="mb-12 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4">أضف تعليقك</h4>
                  
                  {user ? (
                    <form onSubmit={handleCommentSubmit}>
                      <div className="mb-4">
                        <textarea 
                          required
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="شاركنا برأيك أو استفسارك..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 flex items-center gap-2"
                      >
                        {isSubmitting ? 'جاري النشر...' : 'نشر التعليق ↵'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">🔒</div>
                      <p className="text-slate-600 mb-6">يجب تسجيل الدخول لإضافة تعليق</p>
                      <button
                        onClick={() => router.push(`/login?redirect=/posts/${postId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg inline-flex items-center gap-2"
                      >
                        <span>🔑</span>
                        <span>تسجيل الدخول</span>
                      </button>
                    </div>
                  )}
               </div>

               {/* Comments List */}
               <div className="space-y-6">
                  {comments.length === 0 ? (
                    <p className="text-center text-slate-500 py-4">لا توجد تعليقات بعد. كن أول من يشارك!</p>
                  ) : (
                    comments.map((comment) => {
                      const isGuest = !comment.userId;
                      const displayName = comment.userId ? comment.userId.name : (comment.guestName || 'زائر');
                      
                      return (
                        <div key={comment._id} className="flex gap-4 animate-fade-in-up">
                          <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold border-2 ${isGuest ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                             {displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                             <div className="bg-slate-50 p-5 rounded-2xl rounded-tr-none border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900">{displayName}</span>
                                      {isGuest && <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">ضيف</span>}
                                   </div>
                                   <span className="text-xs text-slate-400">
                                     {new Date(comment.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                                   </span>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                                  {comment.content}
                                </p>
                             </div>
                          </div>
                        </div>
                      );
                    })
                  )}
               </div>
            </div>
          </div>

          {/* 4. Sidebar (Author & Info) */}
          <div className="lg:w-1/4 space-y-6">
             
             {/* Author Card */}
             <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-50 to-transparent"></div>
                <div className="relative">
                   <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full mb-4 border-4 border-white shadow-md flex items-center justify-center text-3xl overflow-hidden">
                      {post.userId.avatar ? (
                        <img src={post.userId.avatar} alt={post.userId.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>👤</span>
                      )}
                   </div>
                   <h3 className="text-xl font-bold text-slate-900">{post.userId.name}</h3>
                   <p className="text-slate-500 text-sm mb-4">كاتب تقني وعضو في 4IT</p>
                   <button className="w-full py-2.5 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                     تصفح كل مقالاته
                   </button>
                </div>
             </div>

             {/* Share Card (Static for design) */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-4">شارك المقال</h4>
                <div className="flex gap-2 justify-center">
                   {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
                     <button key={platform} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 text-sm font-medium transition">
                        {platform}
                     </button>
                   ))}
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}