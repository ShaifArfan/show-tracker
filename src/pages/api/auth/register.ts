import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password, name } = req.body;
  if (req.method === 'POST') {
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Invalid request body' });
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (foundUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    if (!newUser) {
      return res.status(400).json({ message: 'Error creating user' });
    }
    return res
      .status(200)
      .json({ message: 'User created successfully', newUser });
  }
  return res.status(400).json({ message: 'Invalid request method' });
};
