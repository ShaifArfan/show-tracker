'use server';

import { handleError } from '@/lib/handleError';
import { CreateShowProps, createShow, deleteSingleShow } from '@/modules/show';
import { revalidatePath } from 'next/cache';

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
