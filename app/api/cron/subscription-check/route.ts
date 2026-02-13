import { NextResponse } from 'next/server';
import { updateExpiredSubscriptions, sendExpiryNotifications } from '@/lib/subscription-middleware';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

/**
 * Cron job endpoint to check and update subscriptions
 * Should be called daily via a cron service (e.g., Vercel Cron, GitHub Actions)
 * 
 * To secure this endpoint, add a secret token in .env:
 * CRON_SECRET=your-secret-token
 * 
 * Then call: /api/cron/subscription-check?secret=your-secret-token
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret if configured
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && secret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Running subscription cron job');

    // Update expired subscriptions
    const updateResult = await updateExpiredSubscriptions();
    logger.info('Updated expired subscriptions', { count: updateResult.updatedCount });

    // Send expiry notifications
    const notificationResult = await sendExpiryNotifications();
    logger.info('Sent expiry notifications', { count: notificationResult.notificationsSent });

    return NextResponse.json({
      success: true,
      message: 'Subscription check completed',
      updatedSubscriptions: updateResult.updatedCount,
      notificationsSent: notificationResult.notificationsSent,
    });
  } catch (error) {
    logger.error('Subscription cron job error', error as Error);
    return NextResponse.json(
      { error: 'Failed to run subscription check' },
      { status: 500 }
    );
  }
}
