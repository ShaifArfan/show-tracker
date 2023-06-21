import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ message: "Missing id" });

    try {
      const episode = await prisma.episode.findUnique({
        where: {
          id: Number(req.query.id),
        },
      });
      return res.status(200).json(episode);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json(e.meta?.cause);
      }
      console.log(e);
    }
  }
}
