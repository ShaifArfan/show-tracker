import 'server-only';

import { z } from 'zod';
import { siteUrl } from '@/app/constants/SiteInfo';
import prisma from '@/lib/prisma';
import { sendToken } from '../sendToken';

const RegisterEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const registerEmail = async (email: string) => {
  const parseResult = RegisterEmailSchema.safeParse({ email });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0].message);
  }

  const userExist = await prisma.user.findUnique({
    where: { email: parseResult.data.email },
  });

  if (userExist) {
    throw new Error('User already exists');
  }

  const mailBody = {
    text: (token: string) =>
      `Complete your registration by clicking the link below: ${siteUrl}/signup/?token=${token}`,
    html: (token: string) => `
    <p>
      Complete your registration by clicking the link below:
      <a href="${siteUrl}/signup/?token=${token}">Register</a>
    </p>`,
  };

  await sendToken({
    email: parseResult.data.email,
    token_subject: 'register',
    email_subject: 'Register Email',
    mailBody,
  });
};
