'use server';

import React from 'react';
import Link from 'next/link';
import { Button, Group } from '@mantine/core';
import AddShowForm from '@/components/AddShowForm';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import DeleteShowButton from '../components/DeleteShowButton';

export default async function () {
  const session = await auth();

  if (!session) {
    return null;
  }

  const shows = await prisma.show.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div>
      <Button component={Link} href="/api/auth/signout" mb="md">
        Logout
      </Button>
      <AddShowForm />
      {shows &&
        shows.map((show) => (
          <Group key={show.id}>
            <h2>
              <Link href={`shows/${show.id}`}>{show.title}</Link>
            </h2>
            <DeleteShowButton showId={show.id} />
          </Group>
        ))}
    </div>
  );
}
