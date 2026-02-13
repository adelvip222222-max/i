'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail, resendVerificationEmail } from '@/lib/actions/register';
import { Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setStatus('error');
      setMessage('رابط التحقق غير صالح');
    }
  }, [token]);

  const handleVerification = async () => {
    if (!token) return;

    const result = await verifyEmail(token);

    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'تم تفعيل حسابك بنجاح!');
      setTimeout(() => {
        router.push('/admin-login');
      }, 3000);
    } else {
      setStatus('error');
      setMessage(result.error || 'فشل في التحقق من البريد');
    }
  };

  const handleResend = async () => {
    const email = prompt('أدخل بريدك الإلكتروني:');
    if (!email) return;

    setResending(true);
    const result = await resendVerificationEmail(email);
    setResending(false);

    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="text-6xl mb-4 animate-spin">⏳</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">جاري التحقق...</h1>
              <p className="text-gray-600">يرجى الانتظار</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">تم التفعيل بنجاح!</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">سيتم توجيهك لتسجيل الدخول...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">فشل التحقق</h1>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-50"
                >
                  {resending ? 'جاري الإرسال...' : 'إعادة إرسال بريد التحقق'}
                </button>

                <button
                  onClick={() => router.push('/admin-login')}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-6xl animate-spin">⏳</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
