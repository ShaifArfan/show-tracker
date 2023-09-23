import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';

export default async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;
  if (!user?.id) {
    return res.status(403).json('not authorized');
  }
  return user;
};
