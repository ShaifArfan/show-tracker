import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import checkSession from '@/lib/checkSession';

export const getSingleShowData = async (showId: number, userId: string) => {
  const show = await prisma.show.findFirst({
    where: { id: showId, userId },
    include: {
      episodes: true,
    },
  });
  if (!show) return { show: null, seasons: null };
  const seasons = await prisma.episode.groupBy({
    by: ['seasonNumber'],
    where: {
      showId,
    },
    _count: {
      _all: true,
    },
  });

  return { show, seasons };
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await checkSession({ req, res });
  if (!user) return null;
  const showId = Number(req.query.id);

  // need to check if user has access to this show
  const thisShow = await prisma.show.findFirst({
    where: {
      id: showId,
      userId: user.id,
    },
  });
  if (!thisShow) return res.status(404).json({ message: 'Show not found' });

  if (req.method === 'GET') {
    const { show, seasons } = await getSingleShowData(showId, user.id);
    return res.status(200).json({ show, seasons });
  }
  if (req.method === 'DELETE') {
    try {
      await prisma.episode.deleteMany({
        where: {
          showId: thisShow.id,
        },
      });

      const result = await prisma.show.delete({
        where: {
          id: thisShow.id,
        },
      });

      return res.status(202).json(result);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json(e.meta?.cause);
      }
      return res.status(500).json(e);
    }
  } else if (req.method === 'PUT') {
    if (!req.body.epiAmount)
      return res.status(400).json({ message: 'Missing epiAmount' });
    if (!req.body.seasonNum)
      return res.status(400).json({ message: 'Missing seasonNum' });
    if (!req.body.action) {
      return res.status(400).json({ message: 'Update Action Type Missing' });
    }

    const reqEpiAmount = Number(req.body.epiAmount);
    const seasonNum = Number(req.body.seasonNum);
    let lastEpisodeNum = 0;

    try {
      const currentEpisodes = await prisma.episode.findMany({
        where: {
          showId: thisShow.id,
          seasonNumber: seasonNum,
        },
      });
      if (currentEpisodes.length > 0) {
        lastEpisodeNum =
          currentEpisodes[currentEpisodes.length - 1].episodeNumber;
      }
      if (req.body.action === 'add') {
        const newEpisodes = new Array(reqEpiAmount).fill(null).map((_, i) => ({
          seasonNumber: seasonNum,
          episodeNumber: i + lastEpisodeNum + 1,
          showId: thisShow.id,
        }));

        const createdEps = await prisma.episode.createMany({
          data: newEpisodes,
        });
        return res.status(202).json(createdEps);
      }
      if (req.body.action === 'remove') {
        if (lastEpisodeNum === 0)
          return res.status(400).json({ message: 'No episodes to remove' });
        if (lastEpisodeNum < reqEpiAmount)
          return res
            .status(400)
            .json({ message: 'Not enough episodes to remove' });

        const delEps = await prisma.episode.deleteMany({
          where: {
            showId: thisShow.id,
            seasonNumber: seasonNum,
            episodeNumber: {
              gt: lastEpisodeNum - reqEpiAmount,
            },
          },
        });
        return res.status(202).json(delEps);
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  }
  return res.status(400).json({ message: 'Invalid request' });
}
