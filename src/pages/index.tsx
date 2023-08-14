import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import axios, { AxiosError } from 'axios';
import { Episode, Show } from '@prisma/client';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { Button, Group, NumberInput, TextInput } from '@mantine/core';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';
import AddShowForm from '@/components/AddShowForm';
import prisma from '@/lib/prisma';
import { fetcher } from '@/lib/swrFetcher';
import DeleteShowButton from '../components/DeleteShowButton';

interface Props {
  shows: Show[];
}

function HomePage() {
  const { data: shows }: { data: Show[] } = useSWR('/api/show', fetcher);

  return (
    <div>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const shows = await prisma.show.findMany();
  return {
    props: {
      fallback: {
        '/api/show/': { shows },
      },
    },
  };
};

export default function Page({ fallback }: { fallback: Props }) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <HomePage />
    </SWRConfig>
  );
}
