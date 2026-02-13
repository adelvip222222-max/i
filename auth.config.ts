import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/admin-login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname.startsWith('/admin-login');
      const isOnUnauthorized = nextUrl.pathname.startsWith('/unauthorized');

      // Allow access to unauthorized page
      if (isOnUnauthorized) {
        return true;
      }

      // Check admin pages
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        // Redirect to unauthorized page instead of login
        return Response.redirect(new URL('/unauthorized', nextUrl));
      }
      
      // Redirect logged-in users away from login page
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl));
      }
      
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
