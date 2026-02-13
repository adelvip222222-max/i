'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPassword, verifyResetToken, requestPasswordReset } from '@/lib/actions/password-reset';
import { Suspense } from 'react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'success'>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setStatus('invalid');
    }
  }, [token]);

  const verifyToken = async () => {
    if (!token) return;

    const result = await verifyResetToken(token);

    if (result.success) {
      setStatus('valid');
    } else {
      setStatus('invalid');
      setError(result.error || 'رابط غير صالح');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (!token) return;

    setSubmitting(true);
    const result = await resetPassword(token, password);
    setSubmitting(false);

    if (result.success) {
      setStatus('success');
      setTimeout(() => {
        router.push('/admin-login');
      }, 3000);
    } else {
      setError(result.error || 'فشل في إعادة تعيين كلمة المرور');
    }
  };

  const handleRequestNew = async () => {
    const email = prompt('أدخل بريدك الإلكتروني:');
    if (!email) return;

    const result = await requestPasswordReset(email);
    alert(result.message || result.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="text-6xl mb-4 animate-spin">⏳</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">جاري التحقق...</h1>
            <p className="text-gray-600">يرجى الانتظار</p>
          </div>
        )}

        {status === 'valid' && (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔐</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">إعادة تعيين كلمة المرور</h1>
              <p className="text-gray-600">أدخل كلمة المرور الجديدة</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="أدخل كلمة المرور الجديدة"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition disabled:opacity-50"
              >
                {submitting ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
              </button>
            </form>
          </>
        )}

        {status === 'invalid' && (
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">رابط غير صالح</h1>
            <p className="text-gray-600 mb-6">{error || 'الرابط منتهي الصلاحية أو غير صحيح'}</p>

            <div className="space-y-3">
              <button
                onClick={handleRequestNew}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition"
              >
                طلب رابط جديد
              </button>

              <button
                onClick={() => router.push('/admin-login')}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition"
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">تم بنجاح!</h1>
            <p className="text-gray-600 mb-4">تم إعادة تعيين كلمة المرور بنجاح</p>
            <p className="text-sm text-gray-500">سيتم توجيهك لتسجيل الدخول...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-6xl animate-spin">⏳</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
