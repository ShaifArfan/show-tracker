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
  });

  return shows;
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
