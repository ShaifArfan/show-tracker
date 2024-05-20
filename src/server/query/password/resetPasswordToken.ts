import 'server-only';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { siteUrl } from '@/app/constants/SiteInfo';
import { sendToken } from '../sendToken';

const ResetPasswordTokenSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const sendResetPasswordToken = async (email: string) => {
  const parseResult = ResetPasswordTokenSchema.safeParse({ email });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0].message);
  }

  const user = await prisma.user.findUnique({
    where: { email: parseResult.data.email },
  });
  if (!user) {
    throw new Error('User Does not exist');
  }

  const mailBody = {
    text: (token: string) =>
      `Reset your password by clicking the link below: ${siteUrl}/reset-password/?token=${token}`,
    html: (token: string) => `
      <p>
        Reset your password by clicking the link below:
        <a href="${siteUrl}/reset-password/?token=${token}">Reset Password</a>
      </p>`,
  };

  await sendToken({
    email: user.email,
    token_subject: 'reset-password',
    email_subject: 'Reset Password',
    mailBody,
  });
};
