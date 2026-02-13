'use client';

import { Suspense } from 'react';
import LoginForm from '@/components/public/LoginForm';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginPageContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full">
        <Suspense fallback={<div className="text-center text-slate-300">جاري التحميل...</div>}>
          <LoginForm onBackToRegister={() => router.push('/#hero')} />
        </Suspense>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">جاري التحميل...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
