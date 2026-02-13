import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Subscription, User, Site } from '@/models';
import SubscriptionsManager from '@/components/super-admin/SubscriptionsManager';

export const runtime = 'nodejs';

export default async function SubscriptionsPage() {
  const session = await auth();
  
  if (!session?.user?.email || session.user.email !== process.env.SUPER_ADMIN_EMAIL) {
    redirect('/super-admin/login');
  }

  await connectDB();

  // جلب جميع الاشتراكات مع بيانات المستخدم والموقع
  const subscriptions = await Subscription.find()
    .populate('userId', 'name email')
    .populate('siteId', 'nameAr slug')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">إدارة الاشتراكات</h1>
        <p className="text-purple-100">عرض وإدارة جميع اشتراكات المستخدمين</p>
      </div>

      {/* Pricing Plans Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
          <div className="text-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-bold text-slate-800 mb-2">شهري</h3>
            <p className="text-3xl font-black text-blue-600 mb-2">150 ج</p>
            <p className="text-sm text-slate-500">كل شهر</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-green-200">
          <div className="text-center">
            <div className="text-4xl mb-3">📆</div>
            <h3 className="font-bold text-slate-800 mb-2">نصف سنوي</h3>
            <p className="text-3xl font-black text-green-600 mb-2">500 ج</p>
            <p className="text-sm text-slate-500">كل 6 شهور</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-slate-800 mb-2">سنوي</h3>
            <p className="text-3xl font-black text-purple-600 mb-2">1200 ج</p>
            <p className="text-sm text-slate-500">كل سنة</p>
          </div>
        </div>
      </div>

      <SubscriptionsManager initialSubscriptions={JSON.parse(JSON.stringify(subscriptions))} />
    </div>
  );
}
