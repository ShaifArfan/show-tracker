import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(req.body.password, salt);
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          password,
          name: req.body.name,
        },
      });
      return res.status(201).json(user);
    } catch (e) {
      return res.status(500).json(e);
    }
  }
  return res.status(404).json('not found');
}
