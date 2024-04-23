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
