import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'This is a protected route' });
  }
  return res.status(400).json({ message: 'Invalid request method' });
};
