import { z } from 'zod';
import { siteUrl } from '@/app/constants/SiteInfo';
import { sendToken } from '../sendToken';

const RegisterEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const registerEmail = async (email: string) => {
  const parseResult = RegisterEmailSchema.safeParse({ email });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0].message);
  }

  const mailBody = {
    text: (token: string) =>
      `Complete your registration by clicking the link below: ${siteUrl}/register/${token}`,
    html: (token: string) => `
    <p>
      Complete your registration by clicking the link below:
      <a href="${siteUrl}/signup?token=${token}">Register</a>
    </p>`,
  };

  sendToken({
    email: parseResult.data.email,
    token_subject: 'register',
    email_subject: 'Register Email',
    mailBody,
  });
};
