import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).json('not authorized');
  }

  if (req.method === 'GET') {
    const result = await prisma.show.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return res.status(200).json(result);
  }
  if (req.method === 'POST') {
    const result = await prisma.show.create({
      data: {
        title: req.body.title,
        userId: session.user.id,
      },
    });

    if (req.body.epiAmount) {
      const episodes = new Array(req.body.epiAmount).fill(null).map((_, i) => ({
        seasonNumber: req.body.seasonNum || 1,
        episodeNumber: i + 1,
        show: { connect: { id: result.id } },
      }));

      // TODO need to update this with a batch create
      for (const episode of episodes) {
        console.log(
          `creating episode ${episode.episodeNumber} for show ${req.body.title}}`
        );
        await prisma.episode.create({
          data: episode,
        });
      }
    }
    // TODO: create many is not supported in sqlite
    // const episodeResult = await prisma.episode.createMany({
    //   data: [...episodes],
    // });
    // }
    return res.status(201).json(result);
  }

  return res.status(404).json('not found');
}
