import EmailResetPassword from '@/components/reset-password/EmailResetPassowrd';
import ResetPasswordForm from '@/components/reset-password/ResetPasswordForm';
import React from 'react';

function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { token } = searchParams;
  if (!token) {
    return <EmailResetPassword />;
  }
  return <ResetPasswordForm token={token} />;
}

export default page;
