import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
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

      // await prisma.episode.deleteMany({
      //   where: {
      //     showId: Number(req.query.id),
      //   },
      // });

      return res.status(202).json(result);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json(e.meta?.cause);
      }
      console.log(e);
    }
  }
}
