'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestPasswordReset } from '@/lib/actions/password-reset';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const result = await requestPasswordReset(email);

    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'تم إرسال رابط إعادة التعيين');
    } else {
      setStatus('error');
      setMessage(result.error || 'حدث خطأ');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">نسيت كلمة المرور؟</h1>
          <p className="text-gray-600">
            أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-bold">✅ {message}</p>
            </div>
            <p className="text-sm text-gray-600">
              تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور
            </p>
            <Link
              href="/admin-login"
              className="inline-block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-center"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="example@email.com"
                required
              />
            </div>

            {status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-50"
            >
              {status === 'loading' ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
            </button>

            <div className="text-center">
              <Link
                href="/admin-login"
                className="text-blue-600 hover:text-blue-700 text-sm font-bold"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
