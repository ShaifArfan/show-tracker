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

const UPDATE_FILLER_PROPS = z.object({
  showId: z.number().int(),
  season: z.number().int().gt(0),
  fillerList: z.string(),
});
interface Update_Filler_Props extends z.infer<typeof UPDATE_FILLER_PROPS> {}

export const updateFiller = async (data: Update_Filler_Props) => {
  const parseResult = await UPDATE_FILLER_PROPS.safeParse(data);
  if (!parseResult.success) {
    // TODO need to think about better error handling
    throw parseResult.error;
  }

  const { showId, season, fillerList } = parseResult.data;
  const fillerEpArray = [] as number[];
  const failedEp = [] as any[];
  const fillerEpSlipt = fillerList.split(',').map((item) => item);

  fillerEpSlipt.forEach((item) => {
    if (Number(item) && Number.isInteger(Number(item)) && Number(item) > 0) {
      // positive integer
      const epi = Number(item);
      if (!fillerEpArray.includes(epi)) {
        fillerEpArray.push(epi);
      }
    } else if (
      !Number(item) &&
      item.includes('-') &&
      item.split('-').length === 2
    ) {
      // it's a range
      const range = item.split('-');
      const start = parseInt(range[0], 10);
      const end = parseInt(range[1], 10);
      if (start < 0 || end < 0) {
        failedEp.push(item);
        return;
      }
      for (let i = start; i <= end; i += 1) {
        fillerEpArray.push(i);
      }
    } else {
      failedEp.push(item);
    }
  });

  // update filler episodes
  const eps = await prisma.episode.updateMany({
    where: {
      showId,
      seasonNumber: season,
      episodeNumber: {
        in: fillerEpArray,
      },
    },
    data: {
      isFiller: true,
    },
  });

  // updated non-filler episodes
  await prisma.episode.updateMany({
    where: {
      showId,
      seasonNumber: season,
      episodeNumber: {
        notIn: fillerEpArray,
      },
    },
    data: {
      isFiller: false,
    },
  });

  // get updated filler list
  const updatedFillers = await prisma.episode.findMany({
    where: {
      showId,
      seasonNumber: season,
      isFiller: true,
    },
    select: {
      episodeNumber: true,
    },
  });

  revalidatePath(`/shows/${showId}`);
  return {
    show_id: showId,
    season,
    update_count: eps.count,
    fillerList: updatedFillers.map((item) => item.episodeNumber).join(', '),
    failedEp: failedEp.join(', '),
  };
};
