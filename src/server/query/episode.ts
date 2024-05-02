import 'server-only';
import prisma from '@/lib/prisma';
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
