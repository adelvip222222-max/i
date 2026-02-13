'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SITE_TYPES = [
  { value: 'contracting', label: 'شركة مقاولات', icon: '🏗️' },
  { value: 'technology', label: 'شركة تقنية', icon: '💻' },
  { value: 'medical', label: 'مركز طبي', icon: '🏥' },
  { value: 'other', label: 'أخرى', icon: '🏢' },
];

const COLORS = [
  { name: 'أزرق', value: '#2563eb' },
  { name: 'أخضر', value: '#16a34a' },
  { name: 'أحمر', value: '#dc2626' },
  { name: 'بنفسجي', value: '#9333ea' },
  { name: 'برتقالي', value: '#ea580c' },
  { name: 'وردي', value: '#db2777' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nameAr: '',
    slug: '',
    siteType: 'other',
    primaryColor: '#2563eb',
  });

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      nameAr: name,
      slug: name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
        .substring(0, 50),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/site/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء إنشاء الموقع');
        setLoading(false);
        return;
      }

      // نجح إنشاء الموقع - توجيه للوحة التحكم
      router.push('/admin/dashboard');
    } catch (err) {
      setError('حدث خطأ في الاتصال');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-4">
            <span className="text-5xl">🚀</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            مرحباً بك!
          </h1>
          <p className="text-gray-300 text-lg">
            دعنا ننشئ موقعك الإلكتروني في خطوات بسيطة
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step >= s
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-1 transition ${
                      step > s ? 'bg-blue-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    معلومات أساسية
                  </h2>
                </div>

                <div>
                  <label className="block text-white mb-2 text-sm font-medium">
                    اسم الموقع
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: شركة البناء الحديث"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 text-sm font-medium">
                    رابط الموقع (Slug)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">yoursite.com/</span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="company-name"
                      dir="ltr"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    سيتم استخدامه في رابط موقعك
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Site Type */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    نوع الموقع
                  </h2>
                  <p className="text-gray-300 mb-6">
                    اختر نوع موقعك لتخصيص المحتوى المناسب
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {SITE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, siteType: type.value as any })
                      }
                      className={`p-6 rounded-xl border-2 transition ${
                        formData.siteType === type.value
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="text-4xl mb-3">{type.icon}</div>
                      <div className="text-white font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Theme Color */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    اللون الأساسي
                  </h2>
                  <p className="text-gray-300 mb-6">
                    اختر اللون الذي يمثل علامتك التجارية
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, primaryColor: color.value })
                      }
                      className={`p-4 rounded-xl border-2 transition ${
                        formData.primaryColor === color.value
                          ? 'border-white bg-white/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded-lg mb-2"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="text-white text-sm font-medium">
                        {color.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition"
                >
                  السابق
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
                >
                  التالي
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري الإنشاء...' : 'إنشاء الموقع 🚀'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
