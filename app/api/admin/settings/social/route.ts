import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { SocialLink } from '@/models';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { links } = await request.json();

    if (!links || !Array.isArray(links)) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    await connectDB();

    // Delete all existing social links
    await SocialLink.deleteMany({});

    // Create new social links
    const createdLinks = await SocialLink.insertMany(links);

    revalidatePath('/admin/settings');
    revalidatePath('/');

    return NextResponse.json({ success: true, data: createdLinks });
  } catch (error) {
    console.error('Error updating social links:', error);
    return NextResponse.json({ error: 'فشل في تحديث روابط التواصل' }, { status: 500 });
  }
}
