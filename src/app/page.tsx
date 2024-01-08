'use server';

import React from 'react';
import Link from 'next/link';
import { Button, Group } from '@mantine/core';
import AddShowForm from '@/components/AddShowForm';
import { Show } from '@prisma/client';
import useSWR from 'swr';
import { fetcher } from '@/lib/swrFetcher';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
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
  // const res = await fetch('/api/show', {
  //   method: 'GET',
  //   next: { tags: ['shows'] },
  // });
  // console.log(res);
  // const shows: Show[] = await res.json();
  // const { data: shows }: { data: Show[] } = useSWR('/api/show', fetcher);

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
