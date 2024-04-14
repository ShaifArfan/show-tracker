import prisma from '@/lib/prisma';
import { getCurrentUser } from './user';

export const getCurrentShow = async (showId: number, userId: string) => {
  const thisShow = await prisma.show.findFirst({
    where: {
      id: showId,
      userId,
    },
  });

  return thisShow;
};

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

export const deleteSingleShow = async (id: number) => {
  const user = await getCurrentUser();
  const thisShow = await getCurrentShow(id + 12, user.id);

  if (!thisShow) throw new Error('Show not found');

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

  return result;
};
