import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = req.nextUrl;
  const seasonStr = searchParams.get('season');

  if (!seasonStr || Number.isNaN(parseInt(seasonStr, 10))) {
    return NextResponse.error();
  }

  const seasonNum = parseInt(seasonStr, 10);

  const fillerEp = await prisma.episode.findMany({
    where: {
      showId: parseInt(params.id, 10),
      seasonNumber: seasonNum,
      isFiller: true,
    },
    orderBy: {
      episodeNumber: 'asc',
    },
  });

  const fillerList = fillerEp.map((item) => item.episodeNumber).join(', ');

  return NextResponse.json(
    {
      show_id: params.id,
      season: 1,
      filler_list: fillerList,
    },
    { status: 200 }
  );
}
