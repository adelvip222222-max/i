import { getAnalyticsStats } from '@/lib/actions/analytics';
import { getUnreadCount } from '@/lib/actions/messages';
import { getAllServices } from '@/lib/actions/services';
import { checkUserSite } from '@/lib/actions/site';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import Link from 'next/link';

export const runtime = 'nodejs';

export default async function DashboardPage() {
  // Check if user has a site
  const siteCheck = await checkUserSite();
  
  if (siteCheck.needsAuth) {
    redirect('/admin-login');
  }
  
  if (!siteCheck.hasSite) {
    redirect('/onboarding');
  }

  // التحقق من حالة تأكيد البيانات
  const session = await auth();
  let verificationStatus = { 
    isEmailVerified: true, 
    isPhoneVerified: true,
    createdAt: new Date(),
    daysRemaining: 0
  };
  
  if (session?.user?.id) {
    try {
      await connectDB();
      const user = await User.findById(session.user.id).select('isEmailVerified isPhoneVerified createdAt').lean();
      if (user) {
        const daysSinceRegistration = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, 7 - daysSinceRegistration);
        
        verificationStatus = {
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          createdAt: user.createdAt,
          daysRemaining: daysRemaining
        };
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  }

  const [statsRes, unreadRes, servicesRes] = await Promise.all([
    getAnalyticsStats(),
    getUnreadCount(),
    getAllServices(),
  ]);

  const stats = statsRes.data || {
    totalVisits: 0,
    todayVisits: 0,
    monthVisits: 0,
    chartData: [],
    topPages: [],
  };

  const unreadCount = unreadRes.data || 0;
  const servicesCount = servicesRes.data?.length || 0;
  const needsVerification = !verificationStatus.isEmailVerified || !verificationStatus.isPhoneVerified;

  return (
    <div className="space-y-6">
      {/* تنبيه التأكيد */}
      {needsVerification && (
        <div className={`rounded-xl shadow-lg p-6 text-white ${
          verificationStatus.daysRemaining === 0 
            ? 'bg-gradient-to-r from-red-600 to-red-700' 
            : verificationStatus.daysRemaining <= 2
            ? 'bg-gradient-to-r from-orange-500 to-red-500'
            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
        }`}>
          <div className="flex items-start gap-4">
            <div className="text-5xl">
              {verificationStatus.daysRemaining === 0 ? '🚫' : verificationStatus.daysRemaining <= 2 ? '⚠️' : '⏰'}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                {verificationStatus.daysRemaining === 0 
                  ? 'موقعك محجوب الآن!' 
                  : `متبقي ${verificationStatus.daysRemaining} ${verificationStatus.daysRemaining === 1 ? 'يوم' : 'أيام'} فقط!`
                }
              </h3>
              <p className="text-white/90 mb-4 text-lg">
                {verificationStatus.daysRemaining === 0 
                  ? 'موقعك محجوب حالياً ولن يكون متاحاً للزوار. يجب تأكيد بياناتك فوراً لإعادة تفعيل الموقع.'
                  : `لديك ${verificationStatus.daysRemaining} ${verificationStatus.daysRemaining === 1 ? 'يوم' : 'أيام'} لتأكيد بريدك الإلكتروني ورقم هاتفك قبل أن يتم حجب موقعك تلقائياً.`
                }
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {!verificationStatus.isEmailVerified && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                    <span>✗</span>
                    <span>البريد الإلكتروني غير مؤكد</span>
                  </div>
                )}
                {!verificationStatus.isPhoneVerified && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                    <span>✗</span>
                    <span>رقم الهاتف غير مؤكد</span>
                  </div>
                )}
              </div>
              <Link
                href="/admin/settings"
                className={`inline-flex items-center gap-2 px-6 py-3 bg-white rounded-lg font-bold transition-colors shadow-lg ${
                  verificationStatus.daysRemaining === 0
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-orange-600 hover:bg-orange-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>تأكيد البيانات الآن</span>
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الزيارات</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVisits}</p>
            </div>
            <div className="text-5xl">📈</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">زيارات اليوم</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.todayVisits}</p>
            </div>
            <div className="text-5xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">زيارات الشهر</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.monthVisits}</p>
            </div>
            <div className="text-5xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">رسائل جديدة</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{unreadCount}</p>
            </div>
            <div className="text-5xl">✉️</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">الزيارات - آخر 30 يوم</h3>
          <div className="space-y-2">
            {stats.chartData.slice(-10).map((item: any) => (
              <div key={item.date} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24">{item.date}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-end px-2"
                    style={{
                      width: `${Math.min((item.visits / Math.max(...stats.chartData.map((d: any) => d.visits))) * 100, 100)}%`,
                    }}
                  >
                    <span className="text-white text-xs font-semibold">{item.visits}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">الصفحات الأكثر زيارة</h3>
          <div className="space-y-3">
            {stats.topPages.map((item: any, index: number) => (
              <div key={item.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <span className="text-gray-900">{item.page}</span>
                </div>
                <span className="text-blue-600 font-semibold">{item.visits} زيارة</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">عدد الخدمات</p>
              <p className="text-4xl font-bold mt-2">{servicesCount}</p>
            </div>
            <div className="text-6xl opacity-50">🛠️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">معدل الزيارات اليومي</p>
              <p className="text-4xl font-bold mt-2">
                {stats.totalVisits > 0 ? Math.round(stats.totalVisits / 30) : 0}
              </p>
            </div>
            <div className="text-6xl opacity-50">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">حالة النظام</p>
              <p className="text-2xl font-bold mt-2">يعمل بشكل جيد ✓</p>
            </div>
            <div className="text-6xl opacity-50">⚡</div>
          </div>
        </div>
      </div>
    </div>
  );
}
