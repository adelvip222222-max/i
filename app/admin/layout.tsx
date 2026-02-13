import { checkUserSite } from '@/lib/actions/site';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { auth } from '@/auth';
import { checkSubscriptionStatus } from '@/lib/subscription-middleware';

export const runtime = 'nodejs';

export default async function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/admin-login');
  }

  // Check user role
  const userRole = (session.user as any).role;

  // Super-admin bypasses site and subscription checks
  if (userRole === 'super-admin') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // Regular admin checks
  const siteCheck = await checkUserSite();
  
  if (siteCheck.needsAuth) {
    redirect('/admin-login');
  }
  
  // If user doesn't have a site, redirect to onboarding
  if (!siteCheck.hasSite) {
    redirect('/onboarding');
  }

  // Check subscription status
  const subscriptionStatus = await checkSubscriptionStatus(session.user.id);
  
  if (!subscriptionStatus.isValid && subscriptionStatus.status === 'expired') {
    // Allow access to subscription page only
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (!currentPath.includes('/admin/subscription')) {
      redirect('/admin/subscription?expired=true');
    }
  }

  return <AdminLayout>{children}</AdminLayout>;
}
