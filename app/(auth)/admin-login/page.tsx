import LoginForm from '@/components/admin/LoginForm';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">منصة 4IT</h1>
          <p className="text-gray-600">تسجيل الدخول إلى لوحة التحكم</p>
        </div>
        <LoginForm />
        <div className="mt-6 text-center space-y-3">
          <div>
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
            >
              <span>🔑</span>
              <span>هل نسيت كلمة المرور؟</span>
            </Link>
          </div>
          <div>
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
