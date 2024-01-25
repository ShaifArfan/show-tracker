import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export const handleError = (e: any) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(e.meta?.cause, { status: 500 });
  }
  if (e instanceof Error) {
    return NextResponse.json(e.message, { status: 500 });
  }
  return NextResponse.json(e, { status: 500 });
};
