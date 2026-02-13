import { connectDB } from './db';
import { Subscription, Site, SubscriptionRequest } from '@/models';
import { sendSubscriptionExpiryEmail } from './email';

/**
 * التحقق من حالة الاشتراك
 */
export async function checkSubscriptionStatus(userId: string) {
  try {
    await connectDB();

    // جلب موقع المستخدم
    const site = await Site.findOne({ userId });
    if (!site) {
      return { 
        isValid: false, 
        status: 'no_site',
        message: 'لا يوجد موقع مرتبط بهذا المستخدم' 
      };
    }

    // جلب الاشتراك النشط
    const subscription = await Subscription.findOne({
      userId,
      siteId: site._id,
      status: 'active',
    }).sort({ endDate: -1 });

    if (!subscription) {
      return {
        isValid: false,
        status: 'no_subscription',
        message: 'لا يوجد اشتراك نشط',
      };
    }

    const now = new Date();
    const endDate = new Date(subscription.endDate);

    // التحقق من انتهاء الاشتراك
    if (now > endDate) {
      // تحديث حالة الاشتراك
      subscription.status = 'expired';
      await subscription.save();

      return {
        isValid: false,
        status: 'expired',
        message: 'انتهى اشتراكك',
        subscription: subscription.toObject(),
      };
    }

    // حساب الأيام المتبقية
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      isValid: true,
      status: 'active',
      daysLeft,
      subscription: subscription.toObject(),
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return {
      isValid: false,
      status: 'error',
      message: 'حدث خطأ في التحقق من الاشتراك',
    };
  }
}

/**
 * إنشاء اشتراك تجريبي عند التسجيل
 */
export async function createTrialSubscription(userId: string, siteId: string) {
  try {
    await connectDB();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 يوم تجريبي

    const subscription = await Subscription.create({
      userId,
      siteId,
      plan: 'trial',
      status: 'active',
      startDate,
      endDate,
      amount: 0,
      autoRenew: false,
    });

    return { success: true, subscription };
  } catch (error) {
    console.error('Error creating trial subscription:', error);
    return { success: false, error: 'فشل في إنشاء الاشتراك التجريبي' };
  }
}

/**
 * تجديد الاشتراك
 */
export async function renewSubscription(
  userId: string,
  plan: 'monthly' | 'semi-annual' | 'annual',
  amount: number
) {
  try {
    await connectDB();

    const site = await Site.findOne({ userId });
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }

    // إلغاء الاشتراك الحالي
    await Subscription.updateMany(
      { userId, siteId: site._id, status: 'active' },
      { status: 'cancelled' }
    );

    // حساب تاريخ الانتهاء
    const startDate = new Date();
    const endDate = new Date();
    
    switch (plan) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'semi-annual':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case 'annual':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    // إنشاء اشتراك جديد
    const subscription = await Subscription.create({
      userId,
      siteId: site._id,
      plan,
      status: 'active',
      startDate,
      endDate,
      amount,
      autoRenew: true,
    });

    return { success: true, subscription };
  } catch (error) {
    console.error('Error renewing subscription:', error);
    return { success: false, error: 'فشل في تجديد الاشتراك' };
  }
}

/**
 * إرسال تنبيهات انتهاء الاشتراك
 * يتم تشغيلها بشكل دوري (cron job)
 */
export async function sendExpiryNotifications() {
  try {
    await connectDB();

    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    // الاشتراكات التي ستنتهي خلال 3 أيام
    const expiringSoon = await Subscription.find({
      status: 'active',
      endDate: { $gte: now, $lte: threeDaysLater },
    })
      .populate('userId', 'email name')
      .populate('siteId', 'nameAr');

    // الاشتراكات التي ستنتهي خلال 7 أيام
    const expiringWeek = await Subscription.find({
      status: 'active',
      endDate: { $gte: threeDaysLater, $lte: sevenDaysLater },
    })
      .populate('userId', 'email name')
      .populate('siteId', 'nameAr');

    // إرسال التنبيهات
    for (const sub of expiringSoon) {
      const daysLeft = Math.ceil(
        (new Date(sub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      await sendSubscriptionExpiryEmail(
        (sub.userId as any).email,
        (sub.siteId as any).nameAr,
        daysLeft
      );
    }

    for (const sub of expiringWeek) {
      const daysLeft = Math.ceil(
        (new Date(sub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      await sendSubscriptionExpiryEmail(
        (sub.userId as any).email,
        (sub.siteId as any).nameAr,
        daysLeft
      );
    }

    return {
      success: true,
      notificationsSent: expiringSoon.length + expiringWeek.length,
    };
  } catch (error) {
    console.error('Error sending expiry notifications:', error);
    return { success: false, error: 'فشل في إرسال التنبيهات' };
  }
}

/**
 * تحديث الاشتراكات المنتهية
 * يتم تشغيلها بشكل دوري (cron job)
 */
export async function updateExpiredSubscriptions() {
  try {
    await connectDB();

    const now = new Date();

    const result = await Subscription.updateMany(
      {
        status: 'active',
        endDate: { $lt: now },
      },
      {
        status: 'expired',
      }
    );

    return {
      success: true,
      updatedCount: result.modifiedCount,
    };
  } catch (error) {
    console.error('Error updating expired subscriptions:', error);
    return { success: false, error: 'فشل في تحديث الاشتراكات' };
  }
}

/**
 * إنشاء طلب تجديد اشتراك
 */
export async function createSubscriptionRequest(
  userId: string,
  plan: 'monthly' | 'semi-annual' | 'annual',
  amount: number,
  paymentMethod: string,
  phoneNumber: string
) {
  try {
    await connectDB();

    const site = await Site.findOne({ userId });
    if (!site) {
      return { success: false, error: 'لم يتم العثور على الموقع' };
    }

    const request = await SubscriptionRequest.create({
      userId,
      siteId: site._id,
      plan,
      amount,
      paymentMethod,
      phoneNumber,
      status: 'pending',
      requestDate: new Date(),
    });

    return { success: true, request };
  } catch (error) {
    console.error('Error creating subscription request:', error);
    return { success: false, error: 'فشل في إنشاء طلب التجديد' };
  }
}

/**
 * الموافقة على طلب تجديد اشتراك
 */
export async function approveSubscriptionRequest(
  requestId: string,
  approvedBy: string
) {
  try {
    await connectDB();

    const request = await SubscriptionRequest.findById(requestId);
    if (!request) {
      return { success: false, error: 'لم يتم العثور على الطلب' };
    }

    if (request.status !== 'pending') {
      return { success: false, error: 'الطلب تمت معالجته بالفعل' };
    }

    // تحديث حالة الطلب
    request.status = 'approved';
    request.approvedBy = approvedBy as any;
    request.approvedDate = new Date();
    await request.save();

    // تجديد الاشتراك
    const renewResult = await renewSubscription(
      request.userId.toString(),
      request.plan,
      request.amount
    );

    if (!renewResult.success) {
      return { success: false, error: 'فشل في تجديد الاشتراك' };
    }

    return { success: true, request, subscription: renewResult.subscription };
  } catch (error) {
    console.error('Error approving subscription request:', error);
    return { success: false, error: 'فشل في الموافقة على الطلب' };
  }
}

/**
 * رفض طلب تجديد اشتراك
 */
export async function rejectSubscriptionRequest(
  requestId: string,
  rejectionReason: string
) {
  try {
    await connectDB();

    const request = await SubscriptionRequest.findById(requestId);
    if (!request) {
      return { success: false, error: 'لم يتم العثور على الطلب' };
    }

    if (request.status !== 'pending') {
      return { success: false, error: 'الطلب تمت معالجته بالفعل' };
    }

    request.status = 'rejected';
    request.rejectionReason = rejectionReason;
    await request.save();

    return { success: true, request };
  } catch (error) {
    console.error('Error rejecting subscription request:', error);
    return { success: false, error: 'فشل في رفض الطلب' };
  }
}
