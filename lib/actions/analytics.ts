'use server';

import { connectDB } from '@/lib/db';
import { Visit } from '@/models';
import { auth } from '@/auth';

export async function trackVisit(page: string, userAgent?: string, referer?: string) {
  try {
    await connectDB();
    await Visit.create({
      page,
      userAgent,
      referer,
    });
    return { success: true };
  } catch (error) {
    console.error('Error tracking visit:', error);
    return { success: false };
  }
}

export async function getAnalyticsStats() {
  const session = await auth();
  if (!session) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();

    // Total visits
    const totalVisits = await Visit.countDocuments();

    // Today's visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisits = await Visit.countDocuments({
      createdAt: { $gte: today },
    });

    // This month's visits
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthVisits = await Visit.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Last 30 days chart data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const visits = await Visit.find(
      { createdAt: { $gte: thirtyDaysAgo } },
      { createdAt: 1 }
    ).lean();

    // Group by date
    const chartData: { [key: string]: number } = {};
    visits.forEach((visit) => {
      const date = visit.createdAt.toISOString().split('T')[0];
      chartData[date] = (chartData[date] || 0) + 1;
    });

    const chartArray = Object.entries(chartData)
      .map(([date, visits]) => ({ date, visits }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top pages
    const pageVisits = await Visit.aggregate([
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topPages = pageVisits.map((item) => ({
      page: item._id,
      visits: item.count,
    }));

    return {
      success: true,
      data: {
        totalVisits,
        todayVisits,
        monthVisits,
        chartData: chartArray,
        topPages,
      },
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { success: false, error: 'فشل في جلب الإحصائيات' };
  }
}
