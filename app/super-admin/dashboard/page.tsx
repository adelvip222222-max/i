import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { User, Site, Subscription } from '@/models';

export const runtime = 'nodejs';

export default async function SuperAdminDashboard() {
  const session = await auth();
  
  // التحقق من أن المستخدم super admin
  if (!session?.user?.email || session.user.email !== process.env.SUPER_ADMIN_EMAIL) {
    redirect('/super-admin/login');
  }

  await connectDB();

  // إحصائيات
  const [totalUsers, totalSites, activeSubscriptions, expiredSubscriptions] = await Promise.all([
    User.countDocuments(),
    Site.countDocuments(),
    Subscription.countDocuments({ status: 'active' }),
    Subscription.countDocuments({ status: 'expired' }),
  ]);

  // الاشتراكات القريبة من الانتهاء (خلال 7 أيام)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const expiringSubscriptions = await Subscription.countDocuments({
    status: 'active',
    endDate: { $lte: sevenDaysFromNow, $gte: new Date() }
  });

  const stats = [
    { label: 'إجمالي المستخدمين', value: totalUsers, icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'إجمالي المواقع', value: totalSites, icon: '🌐', color: 'from-green-500 to-green-600' },
    { label: 'اشتراكات نشطة', value: activeSubscriptions, icon: '✅', color: 'from-purple-500 to-purple-600' },
    { label: 'اشتراكات منتهية', value: expiredSubscriptions, icon: '⚠️', color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">لوحة التحكم الرئيسية</h1>
        <p className="text-blue-100">مرحباً بك في لوحة Super Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                {stat.icon}
              </div>
              <span className="text-3xl font-black text-slate-800">{stat.value}</span>
            </div>
            <p className="text-slate-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {expiringSubscriptions > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏰</span>
            <div>
              <h3 className="font-bold text-orange-900 mb-1">تنبيه: اشتراكات قريبة من الانتهاء</h3>
              <p className="text-orange-700">
                هناك {expiringSubscriptions} اشتراك سينتهي خلال 7 أيام
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/super-admin/users"
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              👥
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">إدارة المستخدمين</h3>
              <p className="text-sm text-slate-500">عرض وإدارة جميع المستخدمين</p>
            </div>
          </div>
        </a>

        <a
          href="/super-admin/sites"
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-green-200 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              🌐
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">إدارة المواقع</h3>
              <p className="text-sm text-slate-500">عرض وإدارة جميع المواقع</p>
            </div>
          </div>
        </a>

        <a
          href="/super-admin/subscriptions"
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              💳
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">إدارة الاشتراكات</h3>
              <p className="text-sm text-slate-500">عرض وإدارة الاشتراكات</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
