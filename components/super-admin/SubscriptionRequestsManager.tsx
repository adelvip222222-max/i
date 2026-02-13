'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Request {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  siteId: {
    _id: string;
    nameAr: string;
    nameEn: string;
    slug: string;
  };
  plan: 'monthly' | 'semi-annual' | 'annual';
  amount: number;
  paymentMethod: string;
  phoneNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedDate?: string;
  rejectionReason?: string;
}

interface Props {
  requests: Request[];
}

const PLAN_LABELS = {
  monthly: 'شهري',
  'semi-annual': 'نصف سنوي',
  annual: 'سنوي',
};

const STATUS_LABELS = {
  pending: 'قيد المراجعة',
  approved: 'موافق عليه',
  rejected: 'مرفوض',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  'instapay': 'InstaPay',
  'vodafone-cash': 'Vodafone Cash',
  'orange-money': 'Orange Money',
  'etisalat-cash': 'Etisalat Cash',
};

export default function SubscriptionRequestsManager({ requests }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const handleApprove = async (requestId: string) => {
    if (!confirm('هل أنت متأكد من الموافقة على هذا الطلب؟')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/super-admin/subscription-requests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      if (res.ok) {
        alert('تمت الموافقة على الطلب بنجاح! ✅');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'فشل في الموافقة على الطلب');
      }
    } catch (error) {
      alert('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert('يرجى إدخال سبب الرفض');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/super-admin/subscription-requests/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          rejectionReason,
        }),
      });

      if (res.ok) {
        alert('تم رفض الطلب ✅');
        setShowModal(false);
        setSelectedRequest(null);
        setRejectionReason('');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'فشل في رفض الطلب');
      }
    } catch (error) {
      alert('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📊</span>
            <div>
              <p className="text-sm text-slate-500">إجمالي الطلبات</p>
              <p className="text-3xl font-bold text-slate-800">{requests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-200">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⏳</span>
            <div>
              <p className="text-sm text-yellow-700">قيد المراجعة</p>
              <p className="text-3xl font-bold text-yellow-800">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-200">
          <div className="flex items-center gap-3">
            <span className="text-4xl">✅</span>
            <div>
              <p className="text-sm text-green-700">موافق عليها</p>
              <p className="text-3xl font-bold text-green-800">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-200">
          <div className="flex items-center gap-3">
            <span className="text-4xl">❌</span>
            <div>
              <p className="text-sm text-red-700">مرفوضة</p>
              <p className="text-3xl font-bold text-red-800">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-slate-600 font-medium">تصفية:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              الكل ({requests.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              قيد المراجعة ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              موافق عليها ({approvedCount})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              مرفوضة ({rejectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-600 text-lg">لا توجد طلبات</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-800">
                      {request.siteId.nameAr}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold border ${
                        STATUS_COLORS[request.status]
                      }`}
                    >
                      {STATUS_LABELS[request.status]}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-1">
                    المستخدم: {request.userId.name} ({request.userId.email})
                  </p>
                  <p className="text-slate-500 text-sm">
                    تاريخ الطلب: {new Date(request.requestDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">الباقة</p>
                  <p className="text-lg font-bold text-slate-800">
                    {PLAN_LABELS[request.plan]}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">المبلغ</p>
                  <p className="text-lg font-bold text-blue-600">{request.amount} ج.م</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">طريقة الدفع</p>
                  <p className="text-sm font-bold text-slate-800">
                    {PAYMENT_METHOD_LABELS[request.paymentMethod] || request.paymentMethod}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">رقم الهاتف</p>
                  <p className="text-sm font-bold text-slate-800" dir="ltr">
                    {request.phoneNumber}
                  </p>
                </div>
              </div>

              {request.status === 'rejected' && request.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-sm text-red-700">
                    <span className="font-bold">سبب الرفض:</span> {request.rejectionReason}
                  </p>
                </div>
              )}

              {request.status === 'approved' && request.approvedDate && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="text-sm text-green-700">
                    <span className="font-bold">تمت الموافقة في:</span>{' '}
                    {new Date(request.approvedDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(request._id)}
                    disabled={loading}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                  >
                    ✓ الموافقة
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowModal(true);
                    }}
                    disabled={loading}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                  >
                    ✕ رفض
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">❌</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">رفض الطلب</h3>
              <p className="text-slate-600">
                يرجى إدخال سبب رفض طلب {selectedRequest.siteId.nameAr}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                سبب الرفض
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="اكتب سبب رفض الطلب..."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition disabled:opacity-50"
              >
                {loading ? 'جاري الرفض...' : 'تأكيد الرفض'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                disabled={loading}
                className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
