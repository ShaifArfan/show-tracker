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
const UPDATE_EPISODES_PROPS = z.object({
  epiAmount: z.number().gt(0).lte(10000),
  seasonNum: z.number().gt(0),
  showId: z.number(),
});

interface Update_Episodes_Props extends z.infer<typeof UPDATE_EPISODES_PROPS> {}

export async function addEpisodes(data: Update_Episodes_Props) {
  const parseResult = await UPDATE_EPISODES_PROPS.safeParse(data);
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

export async function removeEpisodes(data: Update_Episodes_Props) {
  const parseResult = await UPDATE_EPISODES_PROPS.safeParse(data);
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

export const rangeWatchEpisodes = async (data: Update_Episodes_Props) => {
  const parseResult = await UPDATE_EPISODES_PROPS.safeParse(data);
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
    throw new Error('Not enough episodes to Update');
  }

  const episodes = await prisma.episode.updateMany({
    where: {
      showId,
      seasonNumber: seasonNum,
      episodeNumber: {
        lte: epiAmount,
      },
    },
    data: {
      watched: true,
    },
  });

  revalidatePath(`/shows/${showId}`);
  return episodes;
};
