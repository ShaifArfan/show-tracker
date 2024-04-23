'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/server/query/user';
import { revalidatePath } from 'next/cache';

export async function updateEpisodeWatch({
  watched,
  id,
}: {
  watched: boolean;
  id: number;
}) {
  const user = await getCurrentUser();
  // const { watched } = await req.json();
  // if (typeof watched !== 'boolean') throw new Error('Invalid Update');

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
  revalidatePath(`/shows/${episode.showId}`);
  console.log('updated episode on show', episode.showId);
  return episode;
}
