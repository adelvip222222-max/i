import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Subscription, Site, SubscriptionRequest } from '@/models';
import SubscriptionManager from '@/components/admin/SubscriptionManager';

export const runtime = 'nodejs';

async function getUserSubscription(userId: string) {
  try {
    await connectDB();

    const site = await Site.findOne({ userId }).lean();
    if (!site) return { subscription: null, pendingRequests: [] };

    const subscription = await Subscription.findOne({
      userId,
      siteId: site._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const pendingRequests = await SubscriptionRequest.find({
      userId,
      siteId: site._id,
      status: 'pending',
    })
      .sort({ requestDate: -1 })
      .lean();

    return {
      subscription: subscription ? JSON.parse(JSON.stringify(subscription)) : null,
      pendingRequests: JSON.parse(JSON.stringify(pendingRequests)),
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return { subscription: null, pendingRequests: [] };
  }
}

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/admin-login');
  }

  const { subscription, pendingRequests } = await getUserSubscription(session.user.id);
  const params = await searchParams;
  const isExpired = params.expired === 'true';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الاشتراك</h1>
        <p className="text-gray-600">تابع حالة اشتراكك وقم بالتجديد</p>
      </div>

      {isExpired && (
        <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="text-xl font-bold text-red-700 mb-2">
                انتهى اشتراكك!
              </h3>
              <p className="text-red-600 mb-3">
                موقعك غير متاح حالياً للزوار. يرجى تجديد اشتراكك لاستعادة الوصول الكامل.
              </p>
              <p className="text-sm text-red-500">
                لن تتمكن من الوصول إلى أي صفحة أخرى حتى تقوم بتجديد الاشتراك.
              </p>
            </div>
          </div>
        </div>
      )}

      {pendingRequests.length > 0 && (
        <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⏳</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                لديك {pendingRequests.length} طلب تجديد قيد المراجعة
              </h3>
              <p className="text-blue-600 mb-3">
                تم إرسال طلب التجديد إلى الإدارة. سيتم مراجعته والموافقة عليه قريباً.
              </p>
              <div className="space-y-2">
                {pendingRequests.map((req: any) => (
                  <div key={req._id} className="p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {req.plan === 'monthly' ? 'شهري' : req.plan === 'semi-annual' ? 'نصف سنوي' : 'سنوي'}
                        </p>
                        <p className="text-xs text-slate-600">
                          تاريخ الطلب: {new Date(req.requestDate).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">{req.amount} ج.م</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <SubscriptionManager subscription={subscription} />
    </div>
  );
}
