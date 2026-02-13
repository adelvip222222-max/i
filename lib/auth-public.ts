import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from './db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

async function getPublicUser(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email })
      .select('_id email password name')
      .lean();
    return user;
  } catch (error) {
    console.error('Failed to fetch public user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const {
  auth: authPublic,
  signIn: signInPublic,
  signOut: signOutPublic,
  handlers: handlersPublic
} = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ 
              email: z.string().email().toLowerCase().trim(),
              password: z.string().min(6).max(100)
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            return null;
          }

          const { email, password } = parsedCredentials.data;

          const user = await getPublicUser(email);
          
          if (!user) {
            await bcrypt.compare(password, '$2a$10$dummyhashtopreventtimingattack');
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordsMatch) {
            return null;
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.userType = 'public'; // تمييز نوع المستخدم
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  cookies: {
    sessionToken: {
      name: 'public-session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});
