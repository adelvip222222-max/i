import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// استدعاء Auth من إعدادات NextAuth
const { auth } = NextAuth(authConfig);

export default async function middleware(request: NextRequest) {
  // 1. توليد رقم عشوائي (Nonce) لهذا الطلب
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // 2. إعداد سياسة الأمان (CSP)
  // لاحظ استخدام 'nonce-${nonce}' للسماح بالسكربتات الشرعية فقط
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // تنظيف النص (إزالة المسافات الزائدة)
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  // 3. تجهيز الهيدرز للطلب (Request)
  // هذا ضروري لكي يتمكن Next.js (Server Components) من قراءة الـ Nonce
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  // 4. تطبيق المصادقة (Auth)
  const authResult = await auth(request);

  // 5. إنشاء الاستجابة (Response)
  // إذا أرجع Auth استجابة (مثل Redirect)، نستخدمها.
  // وإلا، ننشئ استجابة عادية ونمرر لها requestHeaders المعدلة
  let response = authResult instanceof NextResponse
    ? authResult
    : NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

  // 6. إضافة هيدر CSP إلى الاستجابة النهائية (ليراه المتصفح ويطبقه)
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  // 7. (الكود السابق الخاص بك) إضافة هيدرز تحديد السرعة للـ API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-RateLimit-Limit', '60');
    response.headers.set('X-RateLimit-Remaining', '59');
    response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 60000).toISOString());
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|unauthorized|.*\\.png$).*)'],
};
