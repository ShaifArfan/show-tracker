import React from 'react';
import { getCurrentUser } from '@/modules/user';
import prisma from '@/lib/prisma';
import Dashboard from '@/components/dashboard/Dashboard';

export default async function () {
  const user = await getCurrentUser();

  const shows = await prisma.show.findMany({
    where: {
      userId: user.id,
    },
  });

  return <Dashboard shows={shows} />;
}
