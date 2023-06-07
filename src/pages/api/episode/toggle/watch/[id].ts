import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const episode = await prisma.episode.findUnique({
        where: {
          id: Number(req.query.id),
        },
      });

      if (!episode)
        return res.status(404).json({ message: "Episode not found" });

      const updatedEpisode = await prisma.episode.update({
        where: {
          id: Number(req.query.id),
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
      console.log(e);
    }
  }
}
