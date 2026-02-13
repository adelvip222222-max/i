'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function SuperAdminNav() {
  const pathname = usePathname();

  // لا نعرض الـ nav في صفحة تسجيل الدخول
  if (pathname === '/super-admin/login') {
    return null;
  }

  const menuItems = [
    { href: '/super-admin/dashboard', label: 'لوحة التحكم', icon: '📊' },
    { href: '/super-admin/users', label: 'المستخدمين', icon: '👥' },
    { href: '/super-admin/sites', label: 'المواقع', icon: '🌐' },
    { href: '/super-admin/subscriptions', label: 'الاشتراكات', icon: '💳' },
    { href: '/super-admin/subscription-requests', label: 'طلبات التجديد', icon: '📝' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-slate-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/super-admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
              👑
            </div>
            <span className="text-white font-bold text-lg">Super Admin</span>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => signOut({ callbackUrl: '/super-admin/login' })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all ml-4"
            >
              <span>🚪</span>
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
