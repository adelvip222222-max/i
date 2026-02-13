/** @type {import('next').NextConfig} */
const nextConfig = {
  // تفعيل مترجم React الجديد (تجريبي - تأكد أن نسختك تدعمه)
  reactCompiler: true,

  // إعدادات Turbopack
  turbopack: {},

  // الحزم التي يجب استثناؤها من التجميع (للتعامل مع Mongoose)
  serverExternalPackages: ['mongoose'],

  // إعدادات Server Actions (لرفع الملفات الكبيرة)
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  // تحسينات الصور
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // يسمح بكل الصور من روابط HTTPS
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  // إعدادات الأمان (Headers)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // إعدادات Content-Security-Policy
          // ملاحظة: إذا كنت تستخدم Middleware للـ CSP، يفضل إزالة هذا الجزء لتجنب التكرار
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:", // تمت إضافة blob لدعم رفع الصور
              "font-src 'self' data:",
              "connect-src 'self' https:", // تمت إضافة https للسماح بالاتصال بالـ APIs الخارجية
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ];
  },

  // تحسينات الإنتاج
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
