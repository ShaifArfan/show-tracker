import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import prisma from '@/lib/prisma';
import { getJwtSecretKey } from '@/lib/JWT_keys';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  console.log('email', email);
  if (req.method === 'POST') {
    const foundUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime('1m')
      .sign(new TextEncoder().encode(getJwtSecretKey('access')));

    const refreshToken = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(new TextEncoder().encode(getJwtSecretKey('refresh')));

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        refreshToken,
      },
    });

    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}`
    );

    return res.status(200).json({ message: 'Login successful', accessToken });
  }
};
