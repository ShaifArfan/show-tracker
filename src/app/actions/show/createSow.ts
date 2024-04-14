'use server';

import { CreateShowProps, createShow } from '@/modules/show';
import { revalidatePath } from 'next/cache';

export async function createShowAction(data: CreateShowProps) {
  try {
    const res = await createShow(data);
    revalidatePath('/');
    return res;
  } catch (e) {
    const error = e instanceof Error ? e : new Error('Failed to create show');
    throw error;
  }
}
