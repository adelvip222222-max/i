'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/actions/auth';
import { getUserSite } from '@/lib/actions/site';

import {
  LayoutDashboard,
  Globe,
  Wrench,
  FolderKanban,
  Mail,
  Settings,
  CreditCard,
  LogOut,
  Menu
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [siteSlug, setSiteSlug] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    getUserSite().then((res) => {
      if (res.success && res.data) {
        setSiteSlug(res.data.slug);
      }
    });
  }, []);

  const menuItems = [
    { href: '/admin/dashboard', label: 'لوحة المعلومات', icon: LayoutDashboard },
    { href: '/admin/site', label: 'إدارة الموقع', icon: Globe },
    { href: '/admin/services', label: 'الخدمات', icon: Wrench },
    { href: '/admin/projects', label: 'المشاريع', icon: FolderKanban },
    { href: '/admin/messages', label: 'الرسائل', icon: Mail },
    { href: '/admin/settings', label: 'إعدادات السيت', icon: Settings },
    { href: '/admin/subscription', label: 'الإشتراك', icon: CreditCard },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-right" dir="rtl">
      
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 relative flex flex-col shadow-2xl z-20`}>

        <div className="h-20 flex items-center justify-center border-b border-slate-800/50">
          <h1 className={`font-bold text-xl transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 hidden'}`}>
            مدير الموقع
          </h1>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={22} className="group-hover:scale-110 transition-transform" />

                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 ${
                    !isSidebarOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 bg-slate-800 hover:bg-red-600/90 text-slate-300 hover:text-white rounded-xl transition-all duration-300 group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-medium">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              <Menu size={22} />
            </button>

            <h2 className="text-2xl font-bold text-slate-800">
              {menuItems.find((item) => item.href === pathname)?.label || 'لوحة التحكم'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {siteSlug && (
              <Link
                href={`/s/${siteSlug}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold"
              >
                <Globe size={18} />
                <span>عرض الموقع</span>
              </Link>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
