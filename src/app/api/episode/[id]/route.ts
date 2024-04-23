import { handleError } from '@/lib/handleError';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/query/user';
import { updateEpisodeWatch } from '@/app/actions/episode';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();

  try {
    const episode = await prisma.episode.findFirst({
      where: {
        id: Number(params.id),
        show: {
          userId: user.id,
        },
      },
    });
    return NextResponse.json({ episode }, { status: 200 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(e.meta?.cause, { status: 500 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { watched } = await req.json();
    if (typeof watched !== 'boolean') throw new Error('Invalid Update');

    const episode = await updateEpisodeWatchj({
      id: Number(params.id),
      watched,
    });

    return NextResponse.json(episode, { status: 200 });
  } catch (e) {
    return handleError(e);
  }
}
