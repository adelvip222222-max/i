import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { ContactInfo } from '@/models';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { phone, email, address } = await request.json();

    if (!phone || !email || !address) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    await connectDB();

    // Check if contact info exists
    const existingInfo = await ContactInfo.findOne();

    let contactInfo;
    if (existingInfo) {
      contactInfo = await ContactInfo.findByIdAndUpdate(
        existingInfo._id,
        { phone, email, address },
        { new: true }
      );
    } else {
      contactInfo = await ContactInfo.create({ phone, email, address });
    }

    revalidatePath('/admin/settings');
    revalidatePath('/');

    return NextResponse.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'فشل في تحديث معلومات الاتصال' }, { status: 500 });
  }
}
