import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SubscriptionRequestsManager from '@/components/super-admin/SubscriptionRequestsManager';
import { connectDB } from '@/lib/db';
import { SubscriptionRequest } from '@/models';

export const runtime = 'nodejs';

async function getSubscriptionRequests() {
  await connectDB();

  const requests = await SubscriptionRequest.find()
    .populate('userId', 'name email')
    .populate('siteId', 'nameAr nameEn slug')
    .sort({ requestDate: -1 })
    .lean();

  return JSON.parse(JSON.stringify(requests));
}

export default async function SubscriptionRequestsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'super-admin') {
    redirect('/unauthorized');
  }

  const requests = await getSubscriptionRequests();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">طلبات تجديد الاشتراكات</h1>
        <p className="text-slate-600">مراجعة والموافقة على طلبات تجديد الاشتراكات</p>
      </div>

      <SubscriptionRequestsManager requests={requests} />
    </div>
  );
}
