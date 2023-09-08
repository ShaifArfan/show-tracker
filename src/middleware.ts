'use server';

import { TextEncoder } from 'util';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getJwtSecretKey } from './lib/JWT_keys';

export const config = {
  matcher: '/api/protected/:paths*',
};

// auth check
export async function middleware(req: NextRequest) {
  // const req = NextRequest
  console.log('this is from middleware');
  const authHeader =
    req.headers.get('authorization') || req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer '))
    return new Response(
      JSON.stringify({
        body: { message: 'Dont start with bearer' },
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );

  const token = authHeader.split(' ')[1];
  console.log({ token });
  try {
    // const { payload } = await jwtVerify(
    //   token,
    //   new TextEncoder().encode(getJwtSecretKey('access'))
    // );
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey('access'))
    );
    if (!verified) {
      return new Response(
        JSON.stringify({
          body: { message: 'doesnt verify' },
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (err) {
    console.log({ err });
    return new Response(
      JSON.stringify({
        body: { message: 'Error while verify' },
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
