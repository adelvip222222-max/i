'use client';

import { useState } from 'react';

interface Subscription {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  siteId: {
    _id: string;
    nameAr: string;
    slug: string;
  };
  plan: 'monthly' | 'semi-annual' | 'annual';
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  autoRenew: boolean;
}

interface Props {
  initialSubscriptions: Subscription[];
}

const PLAN_LABELS = {
  monthly: 'شهري',
  'semi-annual': 'نصف سنوي',
  annual: 'سنوي'
};


const STATUS_LABELS = {
  active: 'نشط',
  expired: 'منتهي',
  cancelled: 'ملغي',
  trial: 'تجريبي'
};

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700 border-green-200',
  expired: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  trial: 'bg-blue-100 text-blue-700 border-blue-200'
};

export default function SubscriptionsManager({ initialSubscriptions }: Props) {
  const [subscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.userId.name.includes(searchQuery) ||
    sub.userId.email.includes(searchQuery) ||
    sub.siteId.nameAr.includes(searchQuery)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative">
          <input
            type="text"
            placeholder="بحث في الاشتراكات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-5 text-sm font-bold text-slate-600">المستخدم</th>
                <th className="p-5 text-sm font-bold text-slate-600">الموقع</th>
                <th className="p-5 text-sm font-bold text-slate-600">الخطة</th>
                <th className="p-5 text-sm font-bold text-slate-600">المبلغ</th>
                <th className="p-5 text-sm font-bold text-slate-600">تاريخ البدء</th>
                <th className="p-5 text-sm font-bold text-slate-600">تاريخ الانتهاء</th>
                <th className="p-5 text-sm font-bold text-slate-600">الحالة</th>
                <th className="p-5 text-sm font-bold text-slate-600">التجديد التلقائي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription._id} className="hover:bg-slate-50 transition">
                  <td className="p-5">
                    <div>
                      <p className="font-bold text-slate-800">{subscription.userId.name}</p>
                      <p className="text-sm text-slate-500">{subscription.userId.email}</p>
                    </div>
                  </td>
                  <td className="p-5">
                    <div>
                      <p className="font-bold text-slate-800">{subscription.siteId.nameAr}</p>
                      <p className="text-sm text-slate-500">/{subscription.siteId.slug}</p>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                      {PLAN_LABELS[subscription.plan]}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="font-bold text-slate-800">{subscription.amount} ر.س</span>
                  </td>
                  <td className="p-5 text-slate-600">{formatDate(subscription.startDate)}</td>
                  <td className="p-5 text-slate-600">{formatDate(subscription.endDate)}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${STATUS_COLORS[subscription.status]}`}>
                      {STATUS_LABELS[subscription.status]}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`text-2xl ${subscription.autoRenew ? 'text-green-600' : 'text-gray-400'}`}>
                      {subscription.autoRenew ? '✓' : '✗'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubscriptions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-lg font-bold">لا توجد اشتراكات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
