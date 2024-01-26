'use client';

import { Group } from '@mantine/core';
import React from 'react';
import { Show } from '@prisma/client';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/swrFetcher';
import AddShowForm from '../AddShowForm';
import DeleteShowButton from '../DeleteShowButton';

interface Props {
  shows: Show[];
}

function Dashboard({ shows }: Props) {
  const { data } = useSWR<Show[]>('/api/show', fetcher, {
    fallbackData: shows,
  });
  return (
    <div>
      <AddShowForm />
      {data &&
        data.map((show) => (
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

export default Dashboard;
