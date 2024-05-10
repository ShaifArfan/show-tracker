'use server';

import { handleError } from '@/lib/handleError';
import { revalidatePath } from 'next/cache';
import {
  CreateShowProps,
  createShow,
  deleteSingleShow,
} from '@/server/query/show';
import { Show } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/server/query/user';
import { z } from 'zod';

export async function createShowAction(data: CreateShowProps) {
  try {
    const res = await createShow(data);
    revalidatePath('/');
    return res;
  } catch (e) {
    const res = await handleError(e).json();
    console.error(res);
    throw new Error(res.message);
  }
}

export async function deleteShowAction(id: number) {
  try {
    const res = await deleteSingleShow(id);
    revalidatePath('/');
    revalidatePath(`/shows/${id}`);

    return res;
  } catch (e) {
    const res = await handleError(e).json();
    console.error(res);
    throw new Error('Failed to delete show');
  }
}

const UpdateShowDetailsSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  link: z
    .string()
    .url('Link must be a valid URL')
    .nullish()
    .optional()
    .or(z.literal('')),
  id: z.number(),
  description: z.string().optional().nullish().or(z.literal('')),
});
export async function updateShowDetails(
  data: Pick<Show, 'id' | 'title' | 'description' | 'link'>
) {
  try {
    const parseResult = await UpdateShowDetailsSchema.safeParse(data);
    if (!parseResult.success) {
      // TODO need to think about better error handling
      throw new Error(parseResult.error.errors[0].message);
    }
    const { id, title, link, description } = parseResult.data;

    const user = await getCurrentUser();
    const show = prisma.show.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        title,
        link,
        description,
      },
    });

    revalidatePath('/');
    revalidatePath(`/shows/${id}`);

    return await show;
  } catch (e) {
    const res = await handleError(e).json();
    console.error(res);
    throw e instanceof Error ? e : new Error('Update Failed');
  }
}
