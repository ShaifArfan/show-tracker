import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/modules/user';
import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/lib/handleError';

export async function GET() {
  const user = await getCurrentUser();

  const result = await prisma.show.findMany({
    where: {
      userId: user.id,
    },
  });
  return Response.json(result, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const reqBody = await req.json();
    const result = await prisma.show.create({
      data: {
        title: reqBody.title,
        userId: user.id,
      },
    });

    if (reqBody.epiAmount) {
      const episodes = new Array(reqBody.epiAmount).fill(null).map((_, i) => ({
        seasonNumber: reqBody.seasonNum || 1,
        episodeNumber: i + 1,
        showId: result.id,
      }));

      await prisma.episode.createMany({
        data: episodes,
      });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
