import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { connectDB } from './lib/db';
import { User } from './models';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { logger } from './lib/logger';
import { authLimiter } from './lib/rate-limit';

// Login attempt tracking for security
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Clean up old login attempts every 15 minutes
setInterval(() => {
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;
  
  for (const [email, data] of loginAttempts.entries()) {
    if (now - data.lastAttempt > fifteenMinutes) {
      loginAttempts.delete(email);
    }
  }
}, 15 * 60 * 1000);

async function getUser(email: string) {
  try {
    await connectDB();
    // Select only necessary fields, exclude sensitive data
    const user = await User.findOne({ email })
      .select('_id email password name')
      .lean();
    return user;
  } catch (error) {
    logger.error('Failed to fetch user', error as Error, { email });
    throw new Error('Failed to fetch user.');
  }
}

function checkLoginAttempts(email: string): boolean {
  const attempts = loginAttempts.get(email);
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;

  if (!attempts) {
    return true; // First attempt
  }

  // Reset if last attempt was more than 15 minutes ago
  if (now - attempts.lastAttempt > fifteenMinutes) {
    loginAttempts.delete(email);
    return true;
  }

  // Block if more than 5 attempts
  if (attempts.count >= 5) {
    logger.securityEvent('login_attempts_exceeded', {
      email,
      attempts: attempts.count,
      blockedUntil: new Date(attempts.lastAttempt + fifteenMinutes).toISOString(),
    });
    return false;
  }

  return true;
}

function recordLoginAttempt(email: string, success: boolean) {
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (success) {
    // Clear attempts on successful login
    loginAttempts.delete(email);
    logger.authEvent('login_success', email, true);
  } else {
    // Increment failed attempts
    if (attempts) {
      loginAttempts.set(email, {
        count: attempts.count + 1,
        lastAttempt: now,
      });
    } else {
      loginAttempts.set(email, {
        count: 1,
        lastAttempt: now,
      });
    }
    logger.authEvent('login_failed', email, false);
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          // Validate credentials format
          const parsedCredentials = z
            .object({ 
              email: z.string().email().toLowerCase().trim(),
              password: z.string().min(6).max(100)
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            logger.warn('Invalid credentials format', {
              errors: parsedCredentials.error.errors,
            });
            return null;
          }

          const { email, password } = parsedCredentials.data;

          // Check rate limiting
          const rateLimitResult = await authLimiter.check(email);
          if (!rateLimitResult.success) {
            logger.securityEvent('rate_limit_exceeded', {
              email,
              type: 'authentication',
            });
            return null;
          }

          // Check login attempts
          if (!checkLoginAttempts(email)) {
            return null;
          }

          // Fetch user
          const user = await getUser(email);
          
          if (!user) {
            recordLoginAttempt(email, false);
            // Use timing-safe comparison to prevent user enumeration
            await bcrypt.compare(password, '$2a$10$dummyhashtopreventtimingattack');
            return null;
          }

          // Verify password
          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordsMatch) {
            recordLoginAttempt(email, false);
            return null;
          }

          // Successful login
          recordLoginAttempt(email, true);
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          logger.error('Authorization error', error as Error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days (reduced from 30 for better security)
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Add user data to token on sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.userType = 'admin'; // تمييز نوع المستخدم
        token.iat = Math.floor(Date.now() / 1000); // Issued at
      }

      // Refresh token data on update
      if (trigger === 'update') {
        const dbUser = await getUser(token.email as string);
        if (dbUser) {
          token.name = dbUser.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add token data to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Additional sign-in validation
      if (!user?.email) {
        logger.warn('Sign-in attempt without email');
        return false;
      }

      logger.authEvent('sign_in', user.id, true);
      return true;
    },
  },
  pages: {
    signIn: '/admin-login',
    error: '/admin-login',
  },
  events: {
    async signOut(message) {
      if ('token' in message && message.token?.email) {
        logger.authEvent('sign_out', message.token.email as string, true);
      }
    },
  },
  // Security options
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});
