'server only';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { z } from 'zod';

const { JWT_ALGORITHM, JWT_SECRET } = process.env;
if (!JWT_ALGORITHM || !JWT_SECRET) {
  throw new Error('JWT configuration is missing in the environment variables.');
}

const SignUpSchema = z.object({
  token: z.string(),
  name: z.string(),
  password: z.string(),
});

interface SignUpProps extends z.infer<typeof SignUpSchema> {}

export const signUp = async ({ name, password, token }: SignUpProps) => {
  const parseResult = SignUpSchema.safeParse({ token, name, password });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0].message);
  }

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

  return user;
};
