'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Group, Skeleton, Stack, Title } from '@mantine/core';
import AddShowForm from '@/components/AddShowForm';
import { Show } from '@prisma/client';
import { fetcher } from '@/lib/swrFetcher';

import useSWR from 'swr';
import { UserButton } from '@/components/UserButton';
import DeleteShowButton from '../components/DeleteShowButton';

export default function () {
  // const user = await getCurrentUser();

  // const shows = await prisma.show.findMany({
  //   where: {
  //     userId: user.id,
  //   },
  // });
  // const res = await fetch('/api/show', {
  //   method: 'GET',
  //   next: { tags: ['shows'] },
  // });
  // console.log(res);
  // const shows: Show[] = await res.json();
  const { data: shows, isLoading } = useSWR<Show[]>('/api/show', fetcher);

  return (
    <div>
      <Group justify="space-between">
        <Title>Show Tracker</Title>
        <Box>
          <UserButton />
        </Box>
      </Group>
      <AddShowForm />
      {isLoading ? (
        <Stack mt={20}>
          <Skeleton h={30} w={400} />
          <Skeleton h={30} w={200} />
          <Skeleton h={30} w={600} />
        </Stack>
      ) : (
        shows &&
        shows.map((show) => (
          <Group key={show.id}>
            <h2>
              <Link href={`shows/${show.id}`}>{show.title}</Link>
            </h2>
            <DeleteShowButton showId={show.id} />
          </Group>
        ))
      )}
    </div>
  );
}
