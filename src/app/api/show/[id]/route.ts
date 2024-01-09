import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

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

const getCurrentShow = async (showId: number, userId: string) => {
  const thisShow = await prisma.show.findFirst({
    where: {
      id: showId,
      userId,
    },
  });

  return thisShow;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;
  const thisShow = await getCurrentShow(Number(params.id), user.id);

  if (!thisShow)
    return NextResponse.json({ message: 'Show not found' }, { status: 404 });

  const { show, seasons } = await getSingleShowData(thisShow.id, user.id);
  return NextResponse.json({ show, seasons }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;
  const thisShow = await getCurrentShow(Number(params.id), user.id);

  if (!thisShow)
    return NextResponse.json({ message: 'Show not found' }, { status: 404 });

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

    return NextResponse.json(result, { status: 202 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(e.meta?.cause, { status: 500 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  const thisShow = await getCurrentShow(Number(params.id), user.id);
  if (!thisShow)
    return NextResponse.json({ message: 'Show not found' }, { status: 404 });

  const body = await req.json();
  if (!body.epiAmount)
    return NextResponse.json({ message: 'Missing epiAmount' }, { status: 400 });
  if (!body.seasonNum)
    return NextResponse.json({ message: 'Missing seasonNum' }, { status: 400 });
  if (!body.action) {
    return NextResponse.json(
      { message: 'Update Action Type Missing' },
      { status: 400 }
    );
  }

  const reqEpiAmount = Number(body.epiAmount);
  const seasonNum = Number(body.seasonNum);
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
    if (body.action === 'add') {
      const newEpisodes = new Array(reqEpiAmount).fill(null).map((_, i) => ({
        seasonNumber: seasonNum,
        episodeNumber: i + lastEpisodeNum + 1,
        showId: thisShow.id,
      }));

      const createdEps = await prisma.episode.createMany({
        data: newEpisodes,
      });
      return NextResponse.json(createdEps, { status: 202 });
    }
    if (body.action === 'remove') {
      if (lastEpisodeNum === 0)
        return NextResponse.json(
          { message: 'No episodes to remove' },
          { status: 400 }
        );
      if (lastEpisodeNum < reqEpiAmount)
        return NextResponse.json(
          { message: 'Not enough episodes to remove' },
          { status: 400 }
        );

      const delEps = await prisma.episode.deleteMany({
        where: {
          showId: thisShow.id,
          seasonNumber: seasonNum,
          episodeNumber: {
            gt: lastEpisodeNum - reqEpiAmount,
          },
        },
      });
      return NextResponse.json(delEps, { status: 202 });
    }
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
