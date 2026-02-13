import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-red-100 p-8 md:p-12 text-center border border-red-100">
          
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-red-200 animate-pulse">
              <svg 
                className="w-16 h-16 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            غير مصرح بالدخول
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8">
            عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة
          </p>

          {/* Description */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 leading-relaxed">
              هذه الصفحة مخصصة للمسؤولين فقط. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المسؤول.
            </p>
          </div>

          {/* Error Code */}
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
              خطأ 403 - Forbidden
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              العودة للصفحة الرئيسية
            </Link>

            <Link
              href="/admin-login"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              تسجيل دخول المسؤول
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              هل تحتاج إلى مساعدة؟{' '}
              <Link href="/#contact" className="text-blue-600 hover:text-blue-700 font-semibold">
                تواصل معنا
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            💡 نصيحة: تأكد من تسجيل الدخول بحساب المسؤول للوصول إلى لوحة التحكم
          </p>
        </div>
      </div>
    </div>
  );
}
