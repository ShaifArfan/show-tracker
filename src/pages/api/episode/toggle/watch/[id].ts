import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import checkSession from '@/lib/checkSession';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await checkSession({ req, res });
  if (!user) return null;

  if (req.method === 'PUT') {
    try {
      const episode = await prisma.episode.findFirst({
        where: {
          id: Number(req.query.id),
          show: {
            userId: user.id,
          },
        },
      });

      if (!episode)
        return res.status(404).json({ message: 'Episode not found' });

      const updatedEpisode = await prisma.episode.update({
        where: {
          id: Number(episode.id),
        },
        data: {
          watched: !episode.watched,
        },
      });

      return res.status(202).json(updatedEpisode);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json(e.meta?.cause);
      }
      return res.status(500).json(e);
    }
  }
  return res.status(404).json('not found');
}
