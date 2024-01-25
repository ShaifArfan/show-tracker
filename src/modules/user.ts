import { auth } from '@/lib/auth';

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return session.user;
};
