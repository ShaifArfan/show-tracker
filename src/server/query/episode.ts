import 'server-only';
import prisma from '@/lib/prisma';
import dayjs from 'dayjs';
import { getCurrentUser } from './user';

export async function updateEpisodeWatch({
  watched,
  id,
}: {
  watched: boolean;
  id: number;
}) {
  const user = await getCurrentUser();

  const episode = await prisma.episode.update({
    where: {
      id,
      show: {
        userId: user.id,
      },
    },
    data: {
      watched,
      watched_at: watched ? dayjs(Date.now()).subtract(3, 'd').toDate() : null,
      // watched_at: watched ? new Date() : null,
    },
  });
  return episode;
}

export const getLastEpisodeNum = async ({
  showId,
  seasonNum,
}: {
  showId: number;
  seasonNum: number;
}) => {
  const user = await getCurrentUser();
  const lastEpi = await prisma.episode.findFirst({
    where: {
      showId,
      seasonNumber: seasonNum,
      show: {
        userId: user.id,
      },
    },
    orderBy: {
      episodeNumber: 'desc',
    },
  });
  return lastEpi?.episodeNumber || 0;
};
