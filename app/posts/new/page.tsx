'use client';

import { useState, useEffect } from 'react';
import { createPost } from '@/lib/actions/posts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createPost(user.id, formData);

      if (result.success) {
        setMessage({ type: 'success', text: 'تم نشر المنشور بنجاح! 🚀' });
        setTimeout(() => {
          router.push('/posts');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.error || 'فشل في إنشاء المنشور' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ غير متوقع' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // أو شاشة تحميل بسيطة
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Decorative Header Background */}
      <div className="bg-slate-900 h-64 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Navigation Bar inside Header */}
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Link 
            href="/posts" 
            className="inline-flex items-center text-slate-300 hover:text-white transition-colors group mb-4"
          >
            <span className="bg-white/10 p-2 rounded-lg ml-3 group-hover:bg-white/20 transition-all">
              ←
            </span>
            العودة للمنشورات
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">إضافة موضوع جديد</h1>
          <p className="text-slate-400 mt-2">شاركنا مشكلتك التقنية أو استفسارك ليقوم المجتمع بمساعدتك</p>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">
                  عنوان الموضوع <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="مثال: مشكلة في تثبيت React على Windows..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none font-medium placeholder:text-slate-400"
                  disabled={isSubmitting}
                />
              </div>

              {/* Category Select */}
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">
                  التصنيف
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none appearance-none font-medium cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option value="عام">🌍 عام</option>
                    <option value="تقني">💻 تقني</option>
                    <option value="برمجة">⚙️ برمجة</option>
                    <option value="تصميم">🎨 تصميم</option>
                    <option value="شبكات">📡 شبكات</option>
                    <option value="أمن معلومات">🛡️ أمن معلومات</option>
                    <option value="أخرى">📝 أخرى</option>
                  </select>
                  {/* Custom Arrow Icon */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    ▼
                  </div>
                </div>
              </div>

              {/* Content Textarea */}
              <div>
                <label htmlFor="content" className="block text-sm font-bold text-slate-700 mb-2">
                  تفاصيل الموضوع <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={12}
                    placeholder="اشرح المشكلة بالتفصيل، الأكواد المستخدمة، أو الخطوات التي قمت بها..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none resize-none leading-relaxed placeholder:text-slate-400"
                    disabled={isSubmitting}
                  />
                  <div className="absolute bottom-4 left-4 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                    يدعم Markdown البسيط
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                  <span>💡</span>
                  <span>نصيحة: الوصف الدقيق يساعد الخبراء في فهم مشكلتك بشكل أسرع.</span>
                </p>
              </div>

              {/* Messages Area */}
              {message && (
                <div
                  className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <span className="text-xl">{message.type === 'success' ? '✅' : '⚠️'}</span>
                  <span className="font-medium">{message.text}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-slate-100">
                <Link
                  href="/posts"
                  className="px-8 py-4 text-center rounded-xl font-bold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                >
                  إلغاء
                </Link>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري النشر...
                    </span>
                  ) : (
                    'نشر الموضوع الآن 🚀'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}