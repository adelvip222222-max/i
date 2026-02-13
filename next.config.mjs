import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. إنشاء رقم عشوائي (Nonce)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // 2. كتابة سياسة الأمان باستخدام هذا الرقم
  // لاحظ كيف استبدلنا 'unsafe-inline' بـ 'nonce-${nonce}'
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
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;

  // إزالة المسافات الزائدة والأسطر الجديدة لجعل الهيدر نظيفاً
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  // 3. إعداد الهيدرز للطلب
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce); // نمرر الرقم للصفحة
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 4. وضع الهيدر في الاستجابة النهائية
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  return response;
}

// تحديد الصفحات التي يطبق عليها (استثناء الصور والملفات الثابتة)
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
