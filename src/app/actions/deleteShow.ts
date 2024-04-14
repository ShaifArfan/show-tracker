'use server';

import { revalidatePath } from 'next/cache';
import { deleteSingleShow } from '@/modules/show';

export async function deleteShow(id: number) {
  try {
    const res = await deleteSingleShow(id);
    revalidatePath('/');
    revalidatePath(`/shows/${id}`);

    return { data: res, success: true, error: null };
  } catch (e) {
    let error = new Error('Failed to delete show');
    if (e instanceof Error) {
      error = e;
    }
    // return { data: null, success: false, error: 'Failed to delete show' };
    // const error = handleError(e);
    // console.error({ e: error.statusText });
    throw new Error(error.message);
  }
}
