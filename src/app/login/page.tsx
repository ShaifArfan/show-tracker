import { LoginForm } from '@/components/login/LoginForm';
import { authOptions } from '@/lib/authOptions';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react';

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   // If the user is already logged in, redirect.
//   // Note: Make sure not to redirect to the same page
//   // To avoid an infinite loop!
//   if (session) {
//     return { redirect: { destination: '/' } };
//   }

//   return {};
// }
