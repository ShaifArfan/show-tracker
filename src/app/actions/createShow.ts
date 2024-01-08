'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  epiAmount: z.number().min(0),
  seasonNum: z.number().min(1),
});

type Data = z.infer<typeof schema>;

export async function createShow(data: Data) {
  const session = await auth();

  if (!session) return null;

  // check if the data is valid using zod
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid data',
      data: null,
    };
  }
  const validData = parsed.data;

  try {
    const result = await prisma.show.create({
      data: {
        title: validData.title,
        userId: session.user.id,
      },
    });

    if (validData.epiAmount) {
      const episodes = new Array(validData.epiAmount)
        .fill(null)
        .map((_, i) => ({
          seasonNumber: validData.seasonNum || 1,
          episodeNumber: i + 1,
          showId: result.id,
        }));

      await prisma.episode.createMany({
        data: episodes,
      });
      revalidatePath('/');
      return {
        success: true,
        error: null,
        data: episodes,
      };
      console.log(episodes);
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e,
      data: null,
    };
  }

  return {
    success: false,
    error: null,
    data: null,
  };
}
