'use client';

import React from 'react';
import { Show } from '@prisma/client';
import Link from 'next/link';
import { Button, Group } from '@mantine/core';
import useSWR from 'swr';
import AddShowForm from '@/components/AddShowForm';
import { fetcher } from '@/lib/swrFetcher';
import DeleteShowButton from '../components/DeleteShowButton';

function HomePage() {
  const { data: shows }: { data: Show[] } = useSWR('/api/show', fetcher);

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

export default function Page() {
  return <HomePage />;
}
