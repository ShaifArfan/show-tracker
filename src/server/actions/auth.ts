'use server';

import { handleError } from '@/lib/handleError';
import { signUp } from '../query/auth/sign-up';
import { registerEmail } from '../query/auth/registerEmail';

const { JWT_ALGORITHM, JWT_SECRET } = process.env;
if (!JWT_ALGORITHM || !JWT_SECRET) {
  throw new Error('JWT configuration is missing in the environment variables.');
}

export const registerEmailAction = async (email: string) => {
  try {
    await registerEmail(email);
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
    const res = await handleError(e).json();
    console.error(res);
    throw e instanceof Error ? e : new Error('Failed to sign up');
  }
};
