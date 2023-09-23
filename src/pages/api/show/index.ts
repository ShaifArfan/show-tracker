import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import checkSession from '@/lib/checkSession';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await checkSession({ req, res });
  if (!user) return null;

  if (req.method === 'GET') {
    const result = await prisma.show.findMany({
      where: {
        userId: user.id,
      },
    });
    return res.status(200).json(result);
  }
  if (req.method === 'POST') {
    const result = await prisma.show.create({
      data: {
        title: req.body.title,
        userId: user.id,
      },
    });

    if (req.body.epiAmount) {
      const episodes = new Array(req.body.epiAmount).fill(null).map((_, i) => ({
        seasonNumber: req.body.seasonNum || 1,
        episodeNumber: i + 1,
        showId: result.id,
      }));

      await prisma.episode.createMany({
        data: episodes,
      });
    }
    return res.status(201).json(result);
  }

  return res.status(404).json('not found');
}
