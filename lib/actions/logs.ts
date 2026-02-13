'use server';

import { connectDB } from '@/lib/db';
import { Log } from '@/models';
import { auth } from '@/auth';

export async function getLogs(page: number = 1, limit: number = 50, level?: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    
    const query = level && level !== 'ALL' ? { level } : {};
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      Log.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      Log.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        logs: JSON.parse(JSON.stringify(logs)),
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching logs:', error);
    return { success: false, error: 'فشل في جلب السجلات' };
  }
}

export async function clearLogs(level?: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();
    
    const query = level && level !== 'ALL' ? { level } : {};
    await Log.deleteMany(query);

    return { success: true };
  } catch (error) {
    console.error('Error clearing logs:', error);
    return { success: false, error: 'فشل في مسح السجلات' };
  }
}

export async function getLogStats() {
  const session = await auth();
  if (!session) {
    return { success: false, error: 'غير مصرح' };
  }

  try {
    await connectDB();

    const [total, infoCount, warnCount, errorCount] = await Promise.all([
      Log.countDocuments(),
      Log.countDocuments({ level: 'INFO' }),
      Log.countDocuments({ level: 'WARN' }),
      Log.countDocuments({ level: 'ERROR' }),
    ]);

    return {
      success: true,
      data: {
        total,
        info: infoCount,
        warn: warnCount,
        error: errorCount,
      },
    };
  } catch (error) {
    console.error('Error fetching log stats:', error);
    return { success: false, error: 'فشل في جلب إحصائيات السجلات' };
  }
}
