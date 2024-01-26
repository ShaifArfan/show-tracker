/* eslint-disable no-param-reassign */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prismaClient from './prisma';

// TODO may be later we need to use this adapter
// import { PrismaAdapter } from '@auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'JohnDoe@exmaple.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '*******',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prismaClient.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
          },
        });

        if (user && user.password) {
          const passMatch = bcrypt.compareSync(
            credentials.password,
            user.password
          );
          if (passMatch)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          return null;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    newUser: '/auth/sign-up',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) {
        session.user.id = token.userId;
        return session;
      }
      return session;
    },
  },
};
