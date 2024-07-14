import dayjs from 'dayjs';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/query/user';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();

  try {
    const resData = await prisma.episode.findMany({
      where: {
        show: {
          userId: user.id,
        },
        watched_at: {
          gte: new Date(dayjs().subtract(365, 'day').date()),
          lte: new Date(),
        },
      },
    });

    const data: Record<string, number> = {};
    for (
      let d = new Date(dayjs().subtract(365, 'd').format());
      dayjs(d).isBefore();
      d.setDate(d.getDate() + 1)
    ) {
      const date = dayjs(d).format('DD-MM-YYYY');
      data[date] = 0;
    }

    resData.forEach((item) => {
      const date = dayjs(item.watched_at).format('DD-MM-YYYY');
      if (data[date]) {
        data[date] += 1;
      } else {
        data[date] = 1;
      }
    });

    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(e.meta?.cause, { status: 500 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}
