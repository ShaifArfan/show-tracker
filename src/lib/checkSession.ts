import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { SessionUser } from '@/types/Auth';
import { authOptions } from './authOptions';

export default async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user as SessionUser | undefined;
  if (!user?.id) {
    return res.status(403).json('not authorized');
  }
  return user;
};
