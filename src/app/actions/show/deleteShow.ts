'use server';

import { revalidatePath } from 'next/cache';
import { deleteSingleShow } from '@/modules/show';

export async function deleteShowAction(id: number) {
  try {
    const res = await deleteSingleShow(id);
    revalidatePath('/');
    revalidatePath(`/shows/${id}`);

    return res;
  } catch (e) {
    const error = e instanceof Error ? e : new Error('Failed to create show');
    throw error;
  }
}
