import { handleError } from '@/lib/handleError';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/query/user';
import {
  deleteSingleShow,
  getCurrentShow,
  getSingleShowData,
} from '@/server/query/show';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const thisShow = await getCurrentShow(Number(params.id), user.id);

    if (!thisShow)
      return NextResponse.json({ message: 'Show not found' }, { status: 404 });

    const { show, seasons } = await getSingleShowData(thisShow.id, user.id);
    return NextResponse.json({ show, seasons }, { status: 200 });
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await deleteSingleShow(Number(params.id));
    return NextResponse.json(res, { status: 202 });
  } catch (e) {
    return handleError(e);
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
  try {
    const user = await getCurrentUser();

    const thisShow = await getCurrentShow(Number(params.id), user.id);
    if (!thisShow)
      return NextResponse.json({ message: 'Show not found' }, { status: 404 });

    const body = await req.json();
    if (!body.epiAmount)
      return NextResponse.json(
        { message: 'Missing epiAmount' },
        { status: 400 }
      );
    if (!body.seasonNum)
      return NextResponse.json(
        { message: 'Missing seasonNum' },
        { status: 400 }
      );
    if (!body.action) {
      return NextResponse.json(
        { message: 'Update Action Type Missing' },
        { status: 400 }
      );
    }

    const reqEpiAmount = Number(body.epiAmount);
    const seasonNum = Number(body.seasonNum);
    let lastEpisodeNum = 0;

    const currentEpisodes = await prisma.episode.findMany({
      where: {
        showId: thisShow.id,
        seasonNumber: seasonNum,
      },
    });
    if (currentEpisodes.length > 0) {
      lastEpisodeNum =
        currentEpisodes[currentEpisodes.length - 1].episodeNumber;
      console.log(lastEpisodeNum);
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
    return handleError(e);
  }
}
