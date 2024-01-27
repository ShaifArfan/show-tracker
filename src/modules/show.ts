import prisma from '@/lib/prisma';

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
