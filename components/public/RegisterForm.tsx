'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // التحقق من قوة كلمة المرور
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    if (!hasUpperCase) {
      return 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل';
    }
    if (!hasLowerCase) {
      return 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل';
    }
    if (!hasNumbers) {
      return 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل';
    }
    if (!hasSpecialChar) {
      return 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)';
    }
    return null;
  };

  // حساب قوة كلمة المرور
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500'];
  const strengthLabels = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية', 'قوية جداً'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      setError('رقم الهاتف يجب أن يكون 10 أرقام على الأقل');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء التسجيل');
        setLoading(false);
        return;
      }

      // نجح التسجيل - عرض نموذج تسجيل الدخول
      setShowLogin(true);
    } catch (err) {
      setError('حدث خطأ في الاتصال');
      setLoading(false);
    }
  };

  // إذا تم التسجيل بنجاح، عرض نموذج تسجيل الدخول
  if (showLogin) {
    return <LoginForm onBackToRegister={() => setShowLogin(false)} />;
  }

  return (
    <div className="w-full max-w-md mt-10 mx-auto bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          أنشئ موقعك الآن
        </h2>
        <p className="text-slate-400 text-sm">
          ابدأ رحلتك الرقمية معنا في دقائق
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

      {/* رسالة تحذيرية حول التأكيد */}
      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="text-yellow-300 font-bold mb-1 text-sm">تنبيه مهم</h3>
            <p className="text-yellow-200 text-xs leading-relaxed">
              بعد التسجيل، لديك <span className="font-bold">7 أيام</span> لتأكيد بريدك الإلكتروني ورقم هاتفك. 
              إذا لم تقم بالتأكيد خلال هذه المدة، سيتم حجب موقعك تلقائياً حتى تقوم بتأكيد بياناتك.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-300 mb-2 text-sm font-medium">
            الاسم الكامل
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pr-10 pl-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="أدخل اسمك الكامل"
            />
          </div>
        </div>

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
          <label className="block text-slate-300 mb-2 text-sm font-medium">
            رقم الهاتف
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full pr-10 pl-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="05xxxxxxxx"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-2 text-sm font-medium">
            كلمة المرور
          </label>
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
              placeholder="8 أحرف، حروف كبيرة وصغيرة، أرقام ورموز"
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
          
          {/* مؤشر قوة كلمة المرور */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs ${passwordStrength < 3 ? 'text-red-400' : passwordStrength < 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                قوة كلمة المرور: {strengthLabels[passwordStrength - 1] || 'ضعيفة جداً'}
              </p>
            </div>
          )}
          
          <div className="mt-2 text-xs text-slate-400 space-y-1">
            <p className="flex items-center gap-1">
              <span className={formData.password.length >= 8 ? 'text-green-400' : ''}>
                {formData.password.length >= 8 ? '✓' : '○'}
              </span>
              8 أحرف على الأقل
            </p>
            <p className="flex items-center gap-1">
              <span className={/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}>
                {/[A-Z]/.test(formData.password) ? '✓' : '○'}
              </span>
              حرف كبير واحد على الأقل
            </p>
            <p className="flex items-center gap-1">
              <span className={/[a-z]/.test(formData.password) ? 'text-green-400' : ''}>
                {/[a-z]/.test(formData.password) ? '✓' : '○'}
              </span>
              حرف صغير واحد على الأقل
            </p>
            <p className="flex items-center gap-1">
              <span className={/\d/.test(formData.password) ? 'text-green-400' : ''}>
                {/\d/.test(formData.password) ? '✓' : '○'}
              </span>
              رقم واحد على الأقل
            </p>
            <p className="flex items-center gap-1">
              <span className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-400' : ''}>
                {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓' : '○'}
              </span>
              رمز خاص واحد على الأقل (!@#$%^&*)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-2 text-sm font-medium">
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pr-10 pl-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="أعد إدخال كلمة المرور"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
            >
              {showConfirmPassword ? (
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
          {formData.confirmPassword && (
            <p className={`mt-1 text-xs ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
              {formData.password === formData.confirmPassword ? '✓ كلمات المرور متطابقة' : '✗ كلمات المرور غير متطابقة'}
            </p>
          )}
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
              <span>جاري التسجيل...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>إنشاء حساب</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <p className="text-center text-slate-400 text-sm">
          لديك حساب بالفعل؟{' '}
          <button 
            onClick={() => setShowLogin(true)}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1"
          >
            <span>تسجيل الدخول</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </p>
      </div>
    </div>
  );
}
