'use server';

import prisma from '@/lib/prisma';
import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { handleError } from '@/lib/handleError';
import { sendToken } from '../query/sendToken';

const { JWT_ALGORITHM, JWT_SECRET } = process.env;
if (!JWT_ALGORITHM || !JWT_SECRET) {
  throw new Error('JWT configuration is missing in the environment variables.');
}

const RegisterEmailSchema = z.object({
  email: z.string().email(),
});

export const registerEmail = async (email: string) => {
  try {
    const parseResult = RegisterEmailSchema.safeParse({ email });
    if (!parseResult.success) {
      throw new Error('Invalid email');
    }

    const res = sendToken({ email: parseResult.data.email, sub: 'register' });
    // console.log('Email sent: ', res);
  } catch (e) {
    const res = await handleError(e).json();
    console.error(res);
    throw e instanceof Error ? e : new Error('Failed to send email');
  }
};

export const signUp = async ({
  token,
  name,
  password,
}: {
  token: string;
  name: string;
  password: string;
}) => {
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET),
      {
        subject: 'register',
      }
    );
    const { email } = payload;

    if (!email || typeof email !== 'string' || !name || !password) {
      throw new Error('Invalid token');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name,
      },
      select: {
        email: true,
        name: true,
      },
    });
    console.log('User created: ', user);
    return user;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to register');
  }
};
