import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ContactInfo, SocialLink, User } from '@/models';
import { connectDB } from '@/lib/db';
import SettingsManager from '@/components/admin/SettingsManager';
import VerificationManager from '@/components/admin/VerificationManager';

export const runtime = 'nodejs';

async function getSettings() {
  try {
    await connectDB();
    
    const contactInfo = await ContactInfo.findOne().lean();
    const socialLinks = await SocialLink.find().sort({ order: 1 }).lean();
    
    return {
      contactInfo: contactInfo ? JSON.parse(JSON.stringify(contactInfo)) : null,
      socialLinks: JSON.parse(JSON.stringify(socialLinks)),
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      contactInfo: null,
      socialLinks: [],
    };
  }
}

async function getUserVerificationStatus(userId: string) {
  try {
    await connectDB();
    
    const user = await User.findById(userId).select('email phone isEmailVerified isPhoneVerified createdAt').lean();
    
    if (user) {
      const daysSinceRegistration = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, 7 - daysSinceRegistration);
      
      return {
        ...JSON.parse(JSON.stringify(user)),
        daysRemaining
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function AdminSettingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/admin-login');
  }

  const settings = await getSettings();
  const user = await getUserVerificationStatus(session.user.id);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
        <p className="text-gray-600">إدارة معلومات الاتصال وروابط التواصل الاجتماعي</p>
      </div>

      {/* قسم التحقق من الحساب */}
      {user && (
        <div className="mb-8">
          {/* عداد الأيام المتبقية */}
          {(!user.isEmailVerified || !user.isPhoneVerified) && user.daysRemaining !== undefined && (
            <div className={`mb-6 p-6 rounded-xl border-2 ${
              user.daysRemaining === 0
                ? 'bg-red-50 border-red-300'
                : user.daysRemaining <= 2
                ? 'bg-orange-50 border-orange-300'
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">
                  {user.daysRemaining === 0 ? '🚫' : user.daysRemaining <= 2 ? '⚠️' : '⏰'}
                </span>
                <h3 className={`text-xl font-bold ${
                  user.daysRemaining === 0
                    ? 'text-red-700'
                    : user.daysRemaining <= 2
                    ? 'text-orange-700'
                    : 'text-yellow-700'
                }`}>
                  {user.daysRemaining === 0 
                    ? 'انتهت المهلة - موقعك محجوب الآن!' 
                    : `متبقي ${user.daysRemaining} ${user.daysRemaining === 1 ? 'يوم' : 'أيام'} فقط`
                  }
                </h3>
              </div>
              <p className={`text-sm ${
                user.daysRemaining === 0
                  ? 'text-red-600'
                  : user.daysRemaining <= 2
                  ? 'text-orange-600'
                  : 'text-yellow-700'
              }`}>
                {user.daysRemaining === 0 
                  ? 'موقعك محجوب حالياً. قم بتأكيد بياناتك أدناه لإعادة تفعيل الموقع فوراً.'
                  : `قم بتأكيد بياناتك قبل انتهاء المهلة لتجنب حجب موقعك.`
                }
              </p>
            </div>
          )}
          
          <VerificationManager 
            user={{
              id: user._id,
              email: user.email,
              phone: user.phone,
              isEmailVerified: user.isEmailVerified,
              isPhoneVerified: user.isPhoneVerified,
            }}
          />
        </div>
      )}

      {/* قسم إعدادات الموقع */}
      <SettingsManager 
        initialContactInfo={settings.contactInfo}
        initialSocialLinks={settings.socialLinks}
      />
    </div>
  );
}
