import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const result = await prisma.show.create({
      data: {
        title: req.body.title,
        author: { connect: { id: 1 } },
      },
    });

    if (req.body.epiAmount) {
      const episodes = new Array(req.body.epiAmount).fill(null).map((_, i) => ({
        seasonNumber: req.body.seasonNum || 1,
        episodeNumber: i + 1,
        show: { connect: { id: result.id } },
      }));

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
}
