import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// POST /api/user
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await prisma.show.findMany({
    where: {
      id: req.body.id,
    },
    include: {
      episodes: true,
    },
  });
  return res.status(200).json(result);
}
