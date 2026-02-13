import { getSiteBySlug, getSiteServices, getSiteContactInfo, getSiteSocialLinks, getSiteProjects } from '@/lib/actions/site-public';
import { notFound } from 'next/navigation';
import PublicSiteView from '@/components/site/PublicSiteView';
import { connectDB } from '@/lib/db';
import { Subscription, User } from '@/models';

export const runtime = 'nodejs';

export default async function PublicSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // جلب بيانات الموقع
  const siteRes = await getSiteBySlug(slug);
  
  if (!siteRes.success || !siteRes.data) {
    notFound();
  }

  const site = siteRes.data;
  
  // تحويل _id إلى string للتأكد
  const siteId = site._id.toString();

  // التحقق من تأكيد بيانات المالك
  try {
    await connectDB();
    
    const owner = await User.findById(site.userId).select('isEmailVerified isPhoneVerified createdAt').lean();
    
    if (owner) {
      // حساب عدد الأيام منذ التسجيل
      const daysSinceRegistration = Math.floor((Date.now() - new Date(owner.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = 7 - daysSinceRegistration;
      
      // حجب الموقع فقط بعد 7 أيام من التسجيل
      if (daysSinceRegistration >= 7 && (!owner.isEmailVerified || !owner.isPhoneVerified)) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div className="text-7xl mb-6">🔒</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">الموقع محجوب</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                تم حجب هذا الموقع لأن المالك لم يقم بتأكيد بياناته خلال المدة المحددة (7 أيام).
              </p>
              <div className="text-sm text-gray-500 space-y-2 mb-8">
                {!owner.isEmailVerified && (
                  <p className="flex items-center justify-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>البريد الإلكتروني غير مؤكد</span>
                  </p>
                )}
                {!owner.isPhoneVerified && (
                  <p className="flex items-center justify-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>رقم الهاتف غير مؤكد</span>
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                <a
                  href="/admin/settings"
                  className="block w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  تأكيد البيانات الآن
                </a>
                <p className="text-xs text-gray-400">
                  إذا كنت مالك الموقع، انقر على الزر أعلاه لتأكيد بياناتك وإعادة تفعيل الموقع
                </p>
              </div>
            </div>
          </div>
        );
      }
    }
  } catch (error) {
    console.error('Error checking owner verification:', error);
  }

  // التحقق من حالة الاشتراك
  try {
    await connectDB();
    
    const subscription = await Subscription.findOne({
      siteId: site._id,
      status: 'active',
    }).lean();

    // إذا لم يكن هناك اشتراك نشط، تحقق من انتهاء الاشتراك
    if (!subscription) {
      const expiredSub = await Subscription.findOne({
        siteId: site._id,
      })
        .sort({ endDate: -1 })
        .lean();

      const now = new Date();
      if (expiredSub && new Date(expiredSub.endDate) < now) {
        // عرض صفحة انتهاء الاشتراك
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div className="text-7xl mb-6">⏸️</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">الموقع غير متاح حالياً</h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                انتهى اشتراك هذا الموقع. يرجى التواصل مع مالك الموقع لتجديد الاشتراك.
              </p>
            </div>
          </div>
        );
      }
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    // في حالة الخطأ، نسمح بالوصول
  }

  // جلب باقي البيانات
  const [servicesRes, contactRes, socialRes, projectsRes] = await Promise.all([
    getSiteServices(siteId),
    getSiteContactInfo(siteId),
    getSiteSocialLinks(siteId),
    getSiteProjects(siteId),
  ]);

  return (
    <PublicSiteView
      site={site}
      services={servicesRes.data || []}
      projects={projectsRes.data || []}
      contactInfo={contactRes.data}
      socialLinks={socialRes.data || []}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const siteRes = await getSiteBySlug(slug);
  
  if (!siteRes.success || !siteRes.data) {
    return {
      title: 'الموقع غير موجود',
    };
  }

  return {
    title: siteRes.data.nameAr,
    description: siteRes.data.description || `موقع ${siteRes.data.nameAr}`,
  };
}
