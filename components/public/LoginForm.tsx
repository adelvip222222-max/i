'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface LoginFormProps {
  onBackToRegister?: () => void;
}

export default function LoginForm({ onBackToRegister }: LoginFormProps) {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // استخدام API route للتسجيل
      const res = await fetch('/api/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
        setLoading(false);
        return;
      }

      // حفظ بيانات المستخدم في localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // حفظ بيانات الموقع في localStorage إن وُجد
      if (data.site) {
        localStorage.setItem('userSite', JSON.stringify(data.site));
      } else {
        // إزالة بيانات الموقع القديمة إن لم يكن للمستخدم موقع
        localStorage.removeItem('userSite');
      }

      // التحقق من وجود redirect parameter
      const redirectUrl = searchParams?.get('redirect');
      
      // نجح تسجيل الدخول - توجيه للصفحة المطلوبة
      if (redirectUrl) {
        // إذا كان هناك redirect محدد، استخدمه
        window.location.href = redirectUrl;
      } else if (data.site) {
        // إذا كان للمستخدم موقع، توجيه إلى موقعه
        window.location.href = `/s/${data.site.slug}`;
      } else {
        // إذا لم يكن للمستخدم موقع، توجيه إلى صفحة إنشاء موقع
        window.location.href = '/onboarding';
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-12 max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          تسجيل الدخول
        </h2>
        <p className="text-slate-400 text-sm">
          مرحباً بعودتك! سجل دخولك للمتابعة
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-300 mb-2 text-sm font-medium">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pr-10 pl-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-slate-300 text-sm font-medium">
              كلمة المرور
            </label>
            <a
              href="/forgot-password"
              className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>نسيت كلمة المرور؟</span>
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pr-10 pl-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="أدخل كلمة المرور"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>جاري تسجيل الدخول...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>تسجيل الدخول</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <p className="text-center text-slate-400 text-sm">
          ليس لديك حساب؟{' '}
          <button 
            onClick={onBackToRegister}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1"
          >
            <span>إنشاء حساب جديد</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </p>
      </div>
    </div>
  );
}
