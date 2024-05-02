import 'server-only';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getCurrentUser } from './user';

export const getMyShows = async () => {
  const user = await getCurrentUser();

  const shows = await prisma.show.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          episodes: true,
        },
      },
    },
  });

  const watchedCount = await prisma.episode.groupBy({
    by: ['showId', 'watched'],
    where: {
      showId: {
        in: shows.map((show) => show.id),
      },
      AND: {
        watched: {
          equals: true,
        },
      },
    },
    _count: {
      _all: true,
    },
  });

  const showsWithCounts = shows.map((show) => {
    const showCounts = watchedCount.find((count) => count.showId === show.id);
    return {
      ...show,
      _count: {
        episodes: show._count.episodes,
        watched: showCounts?._count._all || 0,
      },
    };
  });

  return showsWithCounts;

  // }
  // return withCounts? shows.map((show) => {

  // });
};

export const getCurrentShow = async (showId: number, userId: string) => {
  const thisShow = await prisma.show.findFirst({
    where: {
      id: showId,
      userId,
    },
  });

  return thisShow;
};

const createShowSchema = z.object({
  title: z.string().min(1),
  epiAmount: z.number().min(1),
  seasonNum: z.number().min(1),
});

export type CreateShowProps = z.infer<typeof createShowSchema>;
export const createShow = async (data: CreateShowProps) => {
  const user = await getCurrentUser();

  // check if the data is valid using zod
  const parsed = createShowSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error('Invalid data provided');
  }
  const validData = parsed.data;

  const newShow = await prisma.show.create({
    data: {
      title: validData.title,
      userId: user.id,
    },
  });

  const episodes = new Array(validData.epiAmount).fill(null).map((_, i) => ({
    seasonNumber: validData.seasonNum || 1,
    episodeNumber: i + 1,
    showId: newShow.id,
  }));

  await prisma.episode.createMany({
    data: episodes,
  });

  return newShow;
};

export const getSingleShowData = async (showId: number) => {
  const user = await getCurrentUser();
  const show = await prisma.show.findFirst({
    where: { id: showId, userId: user.id },
    include: {
      episodes: true,
    },
  });
  if (!show) return { show: null, seasons: null };
  const seasons = await prisma.episode.groupBy({
    by: ['seasonNumber'],
    where: {
      showId: show.id,
    },
    orderBy: {
      seasonNumber: 'asc',
    },
    _count: {
      _all: true,
    },
  });

  return { show, seasons };
};

export const deleteSingleShow = async (id: number) => {
  const user = await getCurrentUser();
  const thisShow = await getCurrentShow(id, user.id);

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
