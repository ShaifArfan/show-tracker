import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
  const showId = Number(req.query.id);
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).json('not authorized');
  }

  if (req.method === 'GET') {
    const { show, seasons } = await getSingleShowData(
      showId,
      session?.user?.id
    );
    // console.log({ show, seasons });
    return res.status(200).json({ show, seasons });
  }
  if (req.method === 'DELETE') {
    try {
      const episodes = await prisma.episode.findMany({
        where: {
          showId: Number(req.query.id),
        },
      });

      console.log(episodes);
      if (episodes.length > 0) {
        for (const episode of episodes) {
          console.log(
            `deleting episode ${episode.id} from show ${episode.showId}`
          );
          await prisma.episode.delete({
            where: {
              id: Number(episode.id),
            },
          });
        }
      }

      const result = await prisma.show.delete({
        where: {
          id: Number(req.query.id),
        },
      });

      return res.status(202).json(result);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json(e.meta?.cause);
      }
      console.log(e);
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
          showId,
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
          show: { connect: { id: showId } },
        }));

        for (const episode of newEpisodes) {
          console.log(
            `creating S${episode.seasonNumber}E${episode.episodeNumber} for show ${showId}`
          );
          await prisma.episode.create({
            data: episode,
          });
        }
        return res.status(202).json(newEpisodes);
      }
      if (req.body.action === 'remove') {
        console.log('test');
        if (lastEpisodeNum === 0)
          return res.status(400).json({ message: 'No episodes to remove' });
        if (lastEpisodeNum < reqEpiAmount)
          return res
            .status(400)
            .json({ message: 'Not enough episodes to remove' });

        const delEps = await prisma.episode.deleteMany({
          where: {
            showId,
            seasonNumber: seasonNum,
            episodeNumber: {
              gt: lastEpisodeNum - reqEpiAmount,
            },
          },
        });
        console.log(delEps);
        return res.status(202).json(delEps);
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }
  return res.status(400).json({ message: 'Invalid request' });
}
