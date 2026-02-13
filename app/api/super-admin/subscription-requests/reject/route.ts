import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { rejectSubscriptionRequest } from '@/lib/subscription-middleware';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'super-admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { requestId, rejectionReason } = await req.json();

    if (!requestId || !rejectionReason) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const result = await rejectSubscriptionRequest(requestId, rejectionReason);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم رفض الطلب',
      request: result.request,
    });
  } catch (error) {
    console.error('Error rejecting subscription request:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
