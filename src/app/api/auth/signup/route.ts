import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function GET() {
  return Response.json({ message: 'passed' }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const body = await req.json();
    const password = bcrypt.hashSync(body.password, salt);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password,
        name: body.name,
      },
      select: {
        email: true,
        name: true,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
