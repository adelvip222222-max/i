'use client';

import { useState } from 'react';

interface VerificationManagerProps {
  user: {
    id: string;
    email: string;
    phone?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  };
}

export default function VerificationManager({ user }: VerificationManagerProps) {
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const handleSendEmailVerification = async () => {
    setEmailLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/verification/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'فشل في إرسال البريد' });
      } else {
        setMessage({ type: 'success', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSendPhoneVerification = async () => {
    setPhoneLoading(true);
    setMessage(null);
    setDevCode(null);

    try {
      const res = await fetch('/api/verification/send-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'فشل في إرسال الرمز' });
      } else {
        setMessage({ type: 'success', text: data.message });
        setVerifyingPhone(true);
        // في بيئة التطوير، نعرض الكود
        if (data.code) {
          setDevCode(data.code);
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneCode || phoneCode.length !== 6) {
      setMessage({ type: 'error', text: 'يرجى إدخال رمز مكون من 6 أرقام' });
      return;
    }

    setPhoneLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/verification/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, code: phoneCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'فشل في التحقق' });
      } else {
        setMessage({ type: 'success', text: data.message });
        setVerifyingPhone(false);
        setPhoneCode('');
        // إعادة تحميل الصفحة لتحديث الحالة
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setPhoneLoading(false);
    }
  };

  const allVerified = user.isEmailVerified && user.isPhoneVerified;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">تأكيد الحساب</h2>
        <p className="text-slate-600">
          يجب تأكيد بريدك الإلكتروني ورقم هاتفك لتفعيل موقعك بالكامل
        </p>
      </div>

      {!allVerified && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-bold text-red-700 mb-1">تنبيه مهم</h3>
              <p className="text-red-600 text-sm">
                موقعك محجوب حالياً ولن يكون متاحاً للزوار حتى تقوم بتأكيد بريدك الإلكتروني ورقم هاتفك.
              </p>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <span className="text-xl">{message.type === 'success' ? '✓' : '✗'}</span>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* تأكيد البريد الإلكتروني */}
        <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
                📧
              </div>
              <div>
                <h3 className="font-bold text-slate-900">البريد الإلكتروني</h3>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
            </div>
            {user.isEmailVerified ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                <span>✓</span>
                <span>مؤكد</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">
                <span>✗</span>
                <span>غير مؤكد</span>
              </div>
            )}
          </div>

          {!user.isEmailVerified && (
            <button
              onClick={handleSendEmailVerification}
              disabled={emailLoading}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {emailLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>إرسال رابط التأكيد</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* تأكيد رقم الهاتف */}
        {user.phone && (
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
                  📱
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">رقم الهاتف</h3>
                  <p className="text-sm text-slate-600" dir="ltr">{user.phone}</p>
                </div>
              </div>
              {user.isPhoneVerified ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                  <span>✓</span>
                  <span>مؤكد</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">
                  <span>✗</span>
                  <span>غير مؤكد</span>
                </div>
              )}
            </div>

            {!user.isPhoneVerified && (
              <>
                {!verifyingPhone ? (
                  <button
                    onClick={handleSendPhoneVerification}
                    disabled={phoneLoading}
                    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {phoneLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>إرسال رمز التحقق</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    {devCode && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 mb-1 font-medium">
                          🔧 وضع التطوير - الرمز:
                        </p>
                        <p className="text-2xl font-bold text-yellow-900 text-center tracking-widest" dir="ltr">
                          {devCode}
                        </p>
                      </div>
                    )}
                    <input
                      type="text"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="أدخل الرمز المكون من 6 أرقام"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-2xl tracking-widest font-bold"
                      dir="ltr"
                      maxLength={6}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleVerifyPhone}
                        disabled={phoneLoading || phoneCode.length !== 6}
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {phoneLoading ? 'جاري التحقق...' : 'تأكيد'}
                      </button>
                      <button
                        onClick={() => {
                          setVerifyingPhone(false);
                          setPhoneCode('');
                          setDevCode(null);
                        }}
                        className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {allVerified && (
        <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✅</div>
            <div>
              <h3 className="font-bold text-green-700 mb-1">تم التأكيد بنجاح!</h3>
              <p className="text-green-600 text-sm">
                تم تأكيد جميع بياناتك. موقعك الآن متاح للزوار.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
