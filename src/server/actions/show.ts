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

export async function updateShowDetails({
  id,
  title,
  link,
  description,
}: Pick<Show, 'id' | 'title' | 'description' | 'link'>) {
  try {
    if (title === '') {
      throw new Error('Title is required', {
        cause: {
          field: 'title',
        },
      });
    }
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
