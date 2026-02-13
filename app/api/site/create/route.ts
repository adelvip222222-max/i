import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Site from '@/models/Site';
import { createTrialSubscription } from '@/lib/subscription-middleware';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nameAr, slug, siteType, primaryColor } = body;

    // التحقق من البيانات
    if (!nameAr || !slug || !siteType) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    await connectDB();

    // التحقق من تكرار الـ slug
    const existingSite = await Site.findOne({ slug });
    if (existingSite) {
      return NextResponse.json(
        { success: false, error: 'هذا الرابط مستخدم بالفعل، اختر اسماً آخر.' },
        { status: 400 }
      );
    }

    // التحقق من أن المستخدم ليس لديه موقع بالفعل
    const userSite = await Site.findOne({ userId: session.user.id });
    if (userSite) {
      return NextResponse.json(
        { success: false, error: 'لديك موقع بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء الموقع
    const newSite = await Site.create({
      userId: session.user.id,
      nameAr,
      slug,
      siteType,
      themeColors: {
        primary: primaryColor || '#2563eb',
        secondary: '#1e293b'
      }
    });

    // إنشاء اشتراك تجريبي (30 يوم)
    const subscriptionResult = await createTrialSubscription(
      session.user.id,
      newSite._id.toString()
    );

    if (!subscriptionResult.success) {
      logger.error('Failed to create trial subscription', undefined, {
        userId: session.user.id,
        siteId: newSite._id.toString(),
      });
    }

    logger.info('Site created with trial subscription', {
      userId: session.user.id,
      siteId: newSite._id.toString(),
      slug,
    });

    return NextResponse.json({
      success: true,
      siteId: newSite._id.toString(),
      subscription: subscriptionResult.subscription,
    });

  } catch (error) {
    logger.error('Create Site Error', error as Error);
    return NextResponse.json(
      { success: false, error: 'فشل إنشاء الموقع' },
      { status: 500 }
    );
  }
}
