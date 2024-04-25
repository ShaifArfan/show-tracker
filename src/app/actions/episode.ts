'use server';

import prisma from '@/lib/prisma';
import { updateEpisodeWatch } from '@/server/query/episode';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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

// TODO move it to queries
export const getLastEpisodeNum = async ({
  showId,
  seasonNum,
}: {
  showId: number;
  seasonNum: number;
}) => {
  const lastEpi = await prisma.episode.findFirst({
    where: {
      showId,
      seasonNumber: seasonNum,
    },
    orderBy: {
      episodeNumber: 'desc',
    },
  });
  return lastEpi?.episodeNumber || 0;
};

// TODO also add a higher limit
const ADD_REMOVE_EPISODES = z.object({
  epiAmount: z.number().gt(0).lte(100),
  seasonNum: z.number().gt(0),
  showId: z.number(),
});

interface Add_Remove_Episodes extends z.infer<typeof ADD_REMOVE_EPISODES> {}

export async function addEpisodes(data: Add_Remove_Episodes) {
  const parseResult = await ADD_REMOVE_EPISODES.safeParse(data);
  if (!parseResult.success) {
    // TODO need to think about better error handling
    throw parseResult.error;
  }

  const { epiAmount, seasonNum, showId } = parseResult.data;

  const lastEpisodeNum = await getLastEpisodeNum({
    seasonNum,
    showId,
  });

  const newEpisodes = new Array(epiAmount).fill(null).map((_, i) => ({
    seasonNumber: seasonNum,
    episodeNumber: i + lastEpisodeNum + 1,
    showId,
  }));

  const createdEps = await prisma.episode.createMany({
    data: newEpisodes,
  });
  revalidatePath(`/shows/${showId}`);
  return createdEps;
}

export async function removeEpisodes(data: Add_Remove_Episodes) {
  const parseResult = await ADD_REMOVE_EPISODES.safeParse(data);
  if (!parseResult.success) {
    // TODO need to think about better error handling
    throw parseResult.error;
  }
  const { epiAmount, seasonNum, showId } = parseResult.data;
  const lastEpisodeNum = await getLastEpisodeNum({
    seasonNum,
    showId,
  });

  if (lastEpisodeNum < epiAmount) {
    throw new Error('Not enough episodes to delete');
  }

  const delEps = await prisma.episode.deleteMany({
    where: {
      showId,
      seasonNumber: seasonNum,
      episodeNumber: {
        gt: lastEpisodeNum - epiAmount,
      },
    },
  });

  revalidatePath(`/shows/${showId}`);
  return delEps;
}
