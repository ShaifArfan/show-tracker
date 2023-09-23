import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import checkSession from '@/lib/checkSession';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ message: 'Missing id' });

  const user = await checkSession({ req, res });
  if (!user) return null;

  if (req.method === 'GET') {
    try {
      const episode = await prisma.episode.findFirst({
        where: {
          id: Number(req.query.id),
          show: {
            userId: user.id,
          },
        },
      });
      return res.status(200).json(episode);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json(e.meta?.cause);
      }
      return res.status(500).json(e);
    }
  }
  return res.status(404).json('not found');
}
