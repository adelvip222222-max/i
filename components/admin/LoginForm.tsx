'use client';

import { useActionState } from 'react'; // أو useFormState حسب إصدار React/Next.js
import { authenticate } from '@/lib/actions/auth';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden" dir="rtl">
      {/* Background Decor */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/30">
              4
            </div>
            <h1 className="text-2xl font-bold text-slate-800">تسجيل دخول المسؤول</h1>
            <p className="text-slate-500 mt-2 text-sm">أدخل بيانات الاعتماد للمتابعة</p>
          </div>

          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none font-medium placeholder:text-slate-400"
                placeholder="admin@4it.com"
                disabled={isPending}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none font-medium placeholder:text-slate-400"
                placeholder="••••••••"
                disabled={isPending}
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-pulse">
                ⚠️ {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  جاري التحقق...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}