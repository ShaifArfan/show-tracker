'use server';

import { Box, Flex, Paper, RingProgress, Text } from '@mantine/core';
import React from 'react';
import Link from 'next/link';
import { AddShowDisplay } from '../AddShowForm';

interface Props {
  shows: {
    _count: {
      episodes: number;
      watched: number;
    };
    id: number;
    title: string;
    userId: string | null;
  }[];
}

function Dashboard({ shows }: Props) {
  return (
    <Box>
      <AddShowDisplay />
      <Box
        mt="lg"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'var(--mantine-spacing-md)',
        }}
      >
        {shows.length > 0
          ? shows.map((show) => {
              const watchPercentage = Math.round(
                (show._count.watched / show._count.episodes) * 100
              );
              return (
                // <Box>
                <Paper
                  withBorder
                  p="md"
                  key={show.id}
                  component={Link}
                  href={`shows/${show.id}`}
                  c="inherit"
                >
                  <Flex
                    align="center"
                    justify="space-between"
                    direction="column"
                    h="100%"
                  >
                    <Text fz="lg" fw="bold">
                      {show.title}
                    </Text>
                    <Text c="dimmed">
                      ({show._count.watched} / {show._count.episodes})
                    </Text>
                    <RingProgress
                      label={
                        <Text c="blue" fw={700} ta="center" size="xl">
                          {watchPercentage}%
                        </Text>
                      }
                      sections={[
                        {
                          value: watchPercentage,
                          color: 'indigo',
                        },
                      ]}
                    />
                  </Flex>
                </Paper>
                // </Box>
              );
            })
          : 'No shows yet'}
      </Box>
    </Box>
  );
}

export default Dashboard;
