import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { renewSubscription } from '@/lib/subscription-middleware';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { plan, amount } = body;

    if (!plan || !amount) {
      return NextResponse.json({ error: 'بيانات غير كاملة' }, { status: 400 });
    }

    if (!['monthly', 'semi-annual', 'annual'].includes(plan)) {
      return NextResponse.json({ error: 'خطة غير صالحة' }, { status: 400 });
    }

    const result = await renewSubscription(session.user.id, plan, amount);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    logger.info('Subscription renewed', {
      userId: session.user.id,
      plan,
      amount,
    });

    return NextResponse.json({
      success: true,
      message: 'تم تجديد الاشتراك بنجاح',
      subscription: result.subscription,
    });
  } catch (error) {
    logger.error('Subscription renewal error', error as Error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تجديد الاشتراك' }, { status: 500 });
  }
}
