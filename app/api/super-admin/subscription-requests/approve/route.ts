import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { approveSubscriptionRequest } from '@/lib/subscription-middleware';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'super-admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json({ error: 'معرف الطلب مطلوب' }, { status: 400 });
    }

    const result = await approveSubscriptionRequest(requestId, session.user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'تمت الموافقة على الطلب بنجاح',
      request: result.request,
      subscription: result.subscription,
    });
  } catch (error) {
    console.error('Error approving subscription request:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
