'use client';

import { Group } from '@mantine/core';
import React from 'react';
import { Show } from '@prisma/client';
import Link from 'next/link';
import AddShowForm from '../AddShowForm';
import DeleteShowButton from '../DeleteShowButton';

interface Props {
  shows: Show[];
}

function Dashboard({ shows }: Props) {
  return (
    <div>
      <AddShowForm />
      {shows.length > 0
        ? shows.map((show) => (
            <Group key={show.id}>
              <h2>
                <Link href={`shows/${show.id}`}>{show.title}</Link>
              </h2>
              <DeleteShowButton showId={show.id} />
            </Group>
          ))
        : 'No shows yet'}
    </div>
  );
}

export default Dashboard;
