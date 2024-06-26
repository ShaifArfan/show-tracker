import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export const handleError = (e: any) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002':
        return NextResponse.json(
          {
            message: `Already ${e.meta?.modelName} exist`,
            target: e.meta?.target,
            error: e,
          },
          { status: 409 }
        );
      default:
        return NextResponse.json(
          {
            message: 'Something Went Wrong',
            error: e,
          },
          { status: 500 }
        );
    }
  }
  if (e instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
  if (e instanceof Error) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
  return NextResponse.json(
    { message: 'Something Went Wrong' },
    { status: 500 }
  );
};
