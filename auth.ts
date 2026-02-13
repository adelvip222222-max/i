// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { connectDB } from './lib/db';
import { User } from './models';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { logger } from './lib/logger';
import { authLimiter } from './lib/rate-limit';

// Login attempt tracking
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Cleanup old login attempts every 15 minutes
setInterval(() => {
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;
  for (const [email, data] of loginAttempts.entries()) {
    if (now - data.lastAttempt > fifteenMinutes) {
      loginAttempts.delete(email);
    }
  }
}, 15 * 60 * 1000);

// Fetch user from DB
async function getUser(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email })
      .select('_id email password name role')
      .lean();
    return user;
  } catch (error) {
    logger.error('Failed to fetch user', error as Error, { email });
    throw new Error('Failed to fetch user.');
  }
}

// Check login attempts
function checkLoginAttempts(email: string): boolean {
  const attempts = loginAttempts.get(email);
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;

  if (!attempts) return true;
  if (now - attempts.lastAttempt > fifteenMinutes) {
    loginAttempts.delete(email);
    return true;
  }
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

// Record login attempt
function recordLoginAttempt(email: string, success: boolean) {
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (success) {
    loginAttempts.delete(email);
    logger.authEvent('login_success', email, true);
  } else {
    if (attempts) {
      loginAttempts.set(email, { count: attempts.count + 1, lastAttempt: now });
    } else {
      loginAttempts.set(email, { count: 1, lastAttempt: now });
    }
    logger.authEvent('login_failed', email, false);
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        try {
          // Validate format
          const parsed = z
            .object({
              email: z.string().email().toLowerCase().trim(),
              password: z.string().min(6).max(100),
            })
            .safeParse(credentials);

          if (!parsed.success) {
            logger.warn('Invalid credentials format', {
              errors: parsed.error.errors,
            });
            return null;
          }

          const { email, password } = parsed.data;

          // Rate limiting
          const rateLimitResult = await authLimiter.check(email);
          if (!rateLimitResult.success) {
            logger.securityEvent('rate_limit_exceeded', { email, type: 'authentication' });
            return null;
          }

          // Login attempts
          if (!checkLoginAttempts(email)) return null;

          // ✅ Super Admin check (from env, using bcrypt hash if available)
          if (email === process.env.SUPER_ADMIN_EMAIL) {
            const superAdminHash = process.env.SUPER_ADMIN_HASH;
            const passwordMatches = superAdminHash
              ? await bcrypt.compare(password, superAdminHash)
              : password === process.env.ADMIN_PASSWORD; // fallback for dev

            if (passwordMatches) {
              recordLoginAttempt(email, true);
              return {
                id: 'super-admin',
                email,
                name: 'Super Admin',
                role: 'super-admin',
              };
            } else {
              recordLoginAttempt(email, false);
              return null;
            }
          }

          // Normal users from DB
          const user = await getUser(email);
          if (!user) {
            recordLoginAttempt(email, false);
            await bcrypt.compare(password, '$2a$10$dummyhashtopreventtimingattack'); // timing safe
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            recordLoginAttempt(email, false);
            return null;
          }

          // Success
          recordLoginAttempt(email, true);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
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
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.userType = user.role;
        token.iat = Math.floor(Date.now() / 1000);
      }

      if (trigger === 'update') {
        const dbUser = await getUser(token.email as string);
        if (dbUser) {
          token.name = dbUser.name;
          token.role = dbUser.role || 'user';
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as 'admin' | 'super-admin' | 'user';
      }
      return session;
    },
    async signIn({ user }) {
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
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
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
