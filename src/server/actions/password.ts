'use server';

import { handleError } from '@/lib/handleError';
import { redirect } from 'next/navigation';
import { sendResetPasswordToken } from '../query/password/resetPasswordToken';
import { resetPassword } from '../query/password/resetPassword';

export const resetPasswordTokenAction = async (email: string) => {
  try {
    await sendResetPasswordToken(email);
  } catch (e) {
    const res = await handleError(e).json();
    console.error(res);
    throw e instanceof Error
      ? e
      : new Error('Failed to send reset password email');
  }
};

export const resetPasswordAction = async ({
  token,
  password,
  confirm_password,
}: {
  token: string;
  password: string;
  confirm_password: string;
}) => {
  try {
    if (password !== confirm_password) {
      throw new Error('Passwords do not match');
    }
    resetPassword({ token, password });
    redirect('/login');
  } catch (e) {
    const res = await handleError(e).json();
    console.error(res);
    throw e instanceof Error ? e : new Error('Failed to reset password');
  }
};
