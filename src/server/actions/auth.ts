'use server';

import { handleError } from '@/lib/handleError';
import { sendToken } from '../query/sendToken';
import { signUp } from '../query/auth/sign-up';

const { JWT_ALGORITHM, JWT_SECRET } = process.env;
if (!JWT_ALGORITHM || !JWT_SECRET) {
  throw new Error('JWT configuration is missing in the environment variables.');
}

export const registerEmailAction = async (email: string) => {
  try {
    await sendToken({
      email,
      subject: 'register',
    });
  } catch (e) {
    const res = await handleError(e).json();
    console.error(res);
    throw e instanceof Error ? e : new Error('Failed to send email');
  }
};

export const signUpAction = async ({
  token,
  name,
  password,
}: {
  token: string;
  name: string;
  password: string;
}) => {
  try {
    await signUp({ token, name, password });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to register');
  }
};
