import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSubscriptionRequest } from '@/lib/subscription-middleware';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { plan, amount, paymentMethod, phoneNumber } = await req.json();

    if (!plan || !amount || !paymentMethod || !phoneNumber) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const result = await createSubscriptionRequest(
      session.user.id,
      plan,
      amount,
      paymentMethod,
      phoneNumber
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب التجديد بنجاح',
      request: result.request,
    });
  } catch (error) {
    console.error('Error creating subscription request:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
