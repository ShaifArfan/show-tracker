import { z } from 'zod';
import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

const { JWT_ALGORITHM, JWT_SECRET } = process.env;
if (!JWT_ALGORITHM || !JWT_SECRET) {
  throw new Error('JWT configuration is missing in the environment variables.');
}

const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string(),
});

interface ResetPasswordProps extends z.infer<typeof ResetPasswordSchema> {}

export const resetPassword = async ({
  token,
  password,
}: ResetPasswordProps) => {
  const parseResult = ResetPasswordSchema.safeParse({ token, password });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0].message);
  }
  const { payload } = await jose.jwtVerify(
    parseResult.data.token,
    new TextEncoder().encode(JWT_SECRET),
    {
      subject: 'reset-password',
    }
  );
  const { email } = payload;
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid token');
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(parseResult.data.password, salt);

  const user = await prisma.user.update({
    where: { email },
    data: {
      password: hashedPass,
    },
    select: {
      email: true,
      name: true,
    },
  });

  return user;
};
