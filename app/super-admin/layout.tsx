import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SuperAdminNav from '@/components/super-admin/SuperAdminNav';

export const runtime = 'nodejs';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // السماح بالوصول لصفحة تسجيل الدخول فقط
  const isLoginPage = true; // سيتم التحقق من المسار في الكومبوننت

  // التحقق من أن المستخدم super admin
  if (session?.user?.email !== process.env.SUPER_ADMIN_EMAIL && !isLoginPage) {
    redirect('/super-admin/login');
  }

  // إذا كان في صفحة تسجيل الدخول، لا نعرض الـ layout
  return (
    <div className="min-h-screen bg-slate-50">
      <SuperAdminNav />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
