import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';

export async function GET() {
  return Response.json({ message: 'passed' }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const body = await req.json();

    const res = z
      .object({
        email: z.string().email(),
        password: z.string().min(3),
        name: z.string().min(2),
      })
      .safeParse(body);

    if (!res.success) {
      return NextResponse.json(res.error, { status: 400 });
    }
    console.log(res.data);
    const password = bcrypt.hashSync(res.data.password, salt);
    console.log({ password });
    const user = await prisma.user.create({
      data: {
        email: res.data.email,
        password,
        name: res.data.name,
      },
      select: {
        email: true,
        name: true,
      },
    });

    console.log(user);
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
