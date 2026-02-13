import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const auth = NextAuth(authConfig).auth;

export default async function middleware(request: NextRequest) {
  // Apply authentication
  const authResult = await auth(request as any);
  
  // Create response
  let response = authResult instanceof NextResponse ? authResult : NextResponse.next();
  
  // Add rate limit headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-RateLimit-Limit', '60');
    response.headers.set('X-RateLimit-Remaining', '59');
    response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 60000).toISOString());
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|unauthorized|.*\\.png$).*)'],
};
