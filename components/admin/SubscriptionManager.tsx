'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Subscription {
  _id: string;
  plan: 'trial' | 'monthly' | 'semi-annual' | 'annual';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  amount: number;
  autoRenew: boolean;
}

interface Props {
  subscription: Subscription | null;
}

const PLANS = [
  {
    id: 'monthly',
    name: 'شهري',
    price: 99,
    duration: 'شهر واحد',
    features: ['جميع المميزات', 'دعم فني', 'تحديثات مستمرة', 'استضافة مجانية'],
    icon: '📅',
  },
  {
    id: 'semi-annual',
    name: 'نصف سنوي',
    price: 499,
    originalPrice: 594,
    duration: '6 أشهر',
    features: ['جميع المميزات', 'دعم فني', 'تحديثات مستمرة', 'استضافة مجانية', 'خصم 15%'],
    badge: 'الأكثر شعبية',
    icon: '⭐',
  },
  {
    id: 'annual',
    name: 'سنوي',
    price: 899,
    originalPrice: 1188,
    duration: 'سنة كاملة',
    features: ['جميع المميزات', 'دعم فني', 'تحديثات مستمرة', 'استضافة مجانية', 'خصم 25%', 'أولوية في الدعم'],
    badge: 'أفضل قيمة',
    icon: '🏆',
  },
];

const PAYMENT_METHODS = [
  {
    id: 'instapay',
    name: 'InstaPay',
    icon: '💳',
    description: 'الدفع الفوري عبر InstaPay',
    color: 'from-purple-500 to-purple-700',
    phoneNumber: '01002840633',
  },
  {
    id: 'vodafone-cash',
    name: 'Vodafone Cash',
    icon: '📱',
    description: 'محفظة فودافون كاش',
    color: 'from-red-500 to-red-700',
    phoneNumber: '01140558803',
  },
  {
    id: 'orange-money',
    name: 'Orange Money',
    icon: '🟠',
    description: 'محفظة أورانج موني',
    color: 'from-orange-500 to-orange-700',
    phoneNumber: '01140558803',
  },
  {
    id: 'etisalat-cash',
    name: 'Etisalat Cash',
    icon: '💚',
    description: 'محفظة اتصالات كاش',
    color: 'from-green-500 to-green-700',
    phoneNumber: '01140558803',
  },
];

const STATUS_LABELS = {
  active: 'نشط',
  expired: 'منتهي',
  cancelled: 'ملغي',
  trial: 'تجريبي',
};

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700 border-green-200',
  expired: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  trial: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function SubscriptionManager({ subscription }: Props) {
  const router = useRouter();
  const [daysLeft, setDaysLeft] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'confirm'>('select');

  useEffect(() => {
    if (subscription && subscription.status === 'active') {
      const end = new Date(subscription.endDate);
      const now = new Date();
      const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
    }
  }, [subscription]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
    setPaymentStep('select');
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayment(paymentId);
    setPaymentStep('details');
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan || !selectedPayment || !phoneNumber) {
      alert('يرجى إكمال جميع البيانات');
      return;
    }

    setLoading(true);
    try {
      const plan = PLANS.find((p) => p.id === selectedPlan);
      if (!plan) return;

      const res = await fetch('/api/subscription/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          amount: plan.price,
          paymentMethod: selectedPayment,
          phoneNumber,
        }),
      });

      if (res.ok) {
        setShowPaymentModal(false);
        setPaymentStep('select');
        setSelectedPlan(null);
        setSelectedPayment(null);
        setPhoneNumber('');
        router.refresh();
        alert('تم إرسال طلب التجديد بنجاح! سيتم مراجعته من قبل الإدارة. ✅');
      } else {
        const data = await res.json();
        alert(data.error || 'فشل في إرسال طلب التجديد');
      }
    } catch (error) {
      alert('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = PLANS.find((p) => p.id === selectedPlan);
  const selectedPaymentData = PAYMENT_METHODS.find((p) => p.id === selectedPayment);

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      {subscription ? (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">الاشتراك الحالي</h2>
            {subscription.status === 'active' && (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                ✓ نشط
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">
                  {subscription.plan === 'trial' ? '🎁' : 
                   subscription.plan === 'monthly' ? '📅' :
                   subscription.plan === 'semi-annual' ? '⭐' : '🏆'}
                </span>
                <div>
                  <p className="text-sm text-slate-500">الخطة</p>
                  <p className="text-xl font-bold text-slate-800">
                    {subscription.plan === 'trial' ? 'تجريبي' : 
                     subscription.plan === 'monthly' ? 'شهري' :
                     subscription.plan === 'semi-annual' ? 'نصف سنوي' : 'سنوي'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">
                  {subscription.status === 'active' ? '✅' : 
                   subscription.status === 'expired' ? '❌' : '⏸️'}
                </span>
                <div>
                  <p className="text-sm text-slate-500">الحالة</p>
                  <p className="text-xl font-bold text-slate-800">
                    {STATUS_LABELS[subscription.status]}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">
                  {subscription.status === 'active' ? '⏰' : '📅'}
                </span>
                <div>
                  <p className="text-sm text-slate-500">
                    {subscription.status === 'active' ? 'الأيام المتبقية' : 'انتهى في'}
                  </p>
                  <p className="text-xl font-bold text-slate-800">
                    {subscription.status === 'active'
                      ? `${daysLeft} يوم`
                      : new Date(subscription.endDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {subscription.status === 'active' && daysLeft <= 7 && (
            <div className="mt-6 p-5 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <p className="text-orange-800 font-bold text-lg mb-1">
                    اشتراكك على وشك الانتهاء!
                  </p>
                  <p className="text-orange-600">
                    قم بالتجديد الآن لتجنب انقطاع الخدمة والحفاظ على موقعك متاحاً للزوار.
                  </p>
                </div>
              </div>
            </div>
          )}

          {subscription.status === 'expired' && (
            <div className="mt-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">❌</span>
                <div>
                  <p className="text-red-800 font-bold text-lg mb-1">
                    انتهى اشتراكك!
                  </p>
                  <p className="text-red-600">
                    موقعك غير متاح حالياً للزوار. قم بالتجديد الآن لاستعادة الوصول الكامل.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 shadow-lg border-2 border-blue-200 text-center">
          <div className="text-7xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">لا يوجد اشتراك نشط</h3>
          <p className="text-slate-600 text-lg">اختر خطة مناسبة للبدء في استخدام الخدمة</p>
        </div>
      )}

      {/* Pricing Plans */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            {subscription?.status === 'active' ? 'ترقية الاشتراك' : 'اختر خطتك'}
          </h2>
          <p className="text-slate-600 text-lg">
            اختر الباقة المناسبة لك واستمتع بجميع المميزات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all hover:shadow-2xl ${
                plan.badge ? 'border-blue-500 shadow-xl scale-105' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{plan.name}</h3>
                
                <div className="mb-2">
                  {plan.originalPrice && (
                    <span className="text-lg text-slate-400 line-through mr-2">
                      {plan.originalPrice} ج.م
                    </span>
                  )}
                  <div className="text-5xl font-black text-blue-600">
                    {plan.price}
                    <span className="text-xl text-slate-600"> ج.م</span>
                  </div>
                </div>
                
                <p className="text-slate-500 font-medium">{plan.duration}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <span className="text-green-600 text-xl">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-4 font-bold rounded-xl transition-all shadow-md hover:shadow-xl ${
                  plan.badge
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                اختر هذه الخطة
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">إتمام عملية الدفع</h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentStep('select');
                    setSelectedPayment(null);
                    setPhoneNumber('');
                  }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${paymentStep === 'select' ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      paymentStep === 'select' ? 'bg-blue-600 text-white' : 'bg-slate-200'
                    }`}>
                      1
                    </div>
                    <span className="font-medium">اختر طريقة الدفع</span>
                  </div>
                  
                  <div className="w-12 h-0.5 bg-slate-300"></div>
                  
                  <div className={`flex items-center gap-2 ${paymentStep === 'details' ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      paymentStep === 'details' ? 'bg-blue-600 text-white' : 'bg-slate-200'
                    }`}>
                      2
                    </div>
                    <span className="font-medium">أدخل البيانات</span>
                  </div>
                  
                  <div className="w-12 h-0.5 bg-slate-300"></div>
                  
                  <div className={`flex items-center gap-2 ${paymentStep === 'confirm' ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      paymentStep === 'confirm' ? 'bg-blue-600 text-white' : 'bg-slate-200'
                    }`}>
                      3
                    </div>
                    <span className="font-medium">تأكيد</span>
                  </div>
                </div>
              </div>

              {/* Selected Plan Summary */}
              {selectedPlanData && (
                <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{selectedPlanData.icon}</span>
                      <div>
                        <p className="text-sm text-slate-600">الباقة المختارة</p>
                        <p className="text-xl font-bold text-slate-800">{selectedPlanData.name}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-slate-600">المبلغ الإجمالي</p>
                      <p className="text-3xl font-black text-blue-600">{selectedPlanData.price} ج.م</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Select Payment Method */}
              {paymentStep === 'select' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-800 mb-4">اختر طريقة الدفع</h4>
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleSelectPayment(method.id)}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-right ${
                        selectedPayment === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-3xl shadow-lg`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-slate-800">{method.name}</p>
                          <p className="text-sm text-slate-600">{method.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span dir="ltr">{method.phoneNumber}</span>
                          </div>
                        </div>
                        {selectedPayment === method.id && (
                          <span className="text-blue-600 text-2xl">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Enter Payment Details */}
              {paymentStep === 'details' && selectedPaymentData && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => {
                        setPaymentStep('select');
                        setPhoneNumber('');
                      }}
                      className="text-slate-600 hover:text-slate-800"
                    >
                      ← رجوع
                    </button>
                  </div>

                  <div className={`p-5 rounded-xl bg-gradient-to-br ${selectedPaymentData.color} text-white`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{selectedPaymentData.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm opacity-90">طريقة الدفع</p>
                        <p className="text-xl font-bold">{selectedPaymentData.name}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/20">
                      <p className="text-sm opacity-90 mb-1">قم بتحويل المبلغ إلى:</p>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-lg font-bold" dir="ltr">{selectedPaymentData.phoneNumber}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedPaymentData.phoneNumber);
                            alert('تم نسخ الرقم!');
                          }}
                          className="mr-auto bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
                        >
                          نسخ
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1">خطوات الدفع:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>قم بتحويل المبلغ <span className="font-bold">{selectedPlanData?.price} ج.م</span> إلى الرقم أعلاه</li>
                          <li>أدخل رقم هاتفك الذي حولت منه في الحقل أدناه</li>
                          <li>انقر على "متابعة" لإتمام العملية</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      رقم الهاتف / المحفظة
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition text-lg"
                      dir="ltr"
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      أدخل رقم الهاتف المرتبط بمحفظتك الإلكترونية
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      <span className="font-bold">ملاحظة:</span> سيتم إرسال طلب الدفع إلى رقم الهاتف المدخل. يرجى التأكد من صحة الرقم.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (phoneNumber.length >= 11) {
                        setPaymentStep('confirm');
                      } else {
                        alert('يرجى إدخال رقم هاتف صحيح');
                      }
                    }}
                    disabled={!phoneNumber}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    متابعة
                  </button>
                </div>
              )}

              {/* Step 3: Confirm Payment */}
              {paymentStep === 'confirm' && selectedPlanData && selectedPaymentData && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => setPaymentStep('details')}
                      className="text-slate-600 hover:text-slate-800"
                    >
                      ← رجوع
                    </button>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-6xl mb-3">✅</div>
                    <h4 className="text-2xl font-bold text-slate-800 mb-2">تأكيد عملية الدفع</h4>
                    <p className="text-slate-600">يرجى مراجعة البيانات قبل التأكيد</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">الباقة</p>
                      <p className="text-xl font-bold text-slate-800">{selectedPlanData.name}</p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">طريقة الدفع</p>
                      <p className="text-xl font-bold text-slate-800">{selectedPaymentData.name}</p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">رقم الهاتف</p>
                      <p className="text-xl font-bold text-slate-800" dir="ltr">{phoneNumber}</p>
                    </div>

                    <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                      <p className="text-sm text-slate-600 mb-1">المبلغ الإجمالي</p>
                      <p className="text-4xl font-black text-blue-600">{selectedPlanData.price} ج.م</p>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={loading}
                    className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        جاري المعالجة...
                      </span>
                    ) : (
                      '✓ تأكيد الدفع'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
