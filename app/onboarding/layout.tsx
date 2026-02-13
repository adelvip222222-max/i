import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export const runtime = 'nodejs';

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  // Check if user is authenticated
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/admin-login');
  }

  return <>{children}</>;
}
