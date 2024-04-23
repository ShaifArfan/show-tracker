'use server';

import { updateEpisodeWatch } from '@/server/query/episode';
import { revalidatePath } from 'next/cache';

export async function updateEpisodeWatchAction({
  watched,
  id,
}: {
  watched: boolean;
  id: number;
}) {
  try {
    const episode = await updateEpisodeWatch({
      watched,
      id,
    });
    revalidatePath(`/shows/${episode.showId}`);
    return episode;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to update episode!!');
  }
}
