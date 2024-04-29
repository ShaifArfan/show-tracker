'use client';

import React, { useState } from 'react';
import { Episode, Show } from '@prisma/client';
import {
  Button,
  Drawer,
  Flex,
  Group,
  Paper,
  Tabs,
  Title,
  em,
  useMantineTheme,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import ShowForm from '@/components/show/ShowForm';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Season from './Season';
import DeleteShowButton from '../DeleteShowButton';
import FillerForm from './FillerForm';

interface ShowWithEpi extends Show {
  episodes: Episode[];
}
interface ShowData {
  show: ShowWithEpi | null;
  seasons:
    | {
        _count: {
          _all: number;
        };
        seasonNumber: number;
      }[]
    | null;
}

export default function SingleShow({
  initialData,
  showId,
}: {
  initialData: ShowData;
  showId: number;
}) {
  const router = useRouter();
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const data = initialData;
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`);
  const [opened, { open, close }] = useDisclosure(false);

  if (!data || !data.show || !data.seasons) return <div>404</div>;

  const { show, seasons } = data;

  return (
    <>
      <Paper bg="var(--mantine-color-gray-3)" p="md">
        <Flex gap="md" justify="space-between">
          <Group mb="sm">
            <Title order={2}>{show.title}</Title>
            <DeleteShowButton
              showId={showId}
              onDelete={() => {
                router.push('/');
              }}
            />
          </Group>
          <Button variant="light" onClick={open}>
            Update Filler
          </Button>
        </Flex>
        <ShowForm
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          seasons={seasons}
          showId={showId}
        />
      </Paper>
      {!seasons || seasons?.length < 1 ? (
        'No Episodes'
      ) : (
        <Tabs
          value={activeTab || `s${seasons[0].seasonNumber}`}
          onChange={setActiveTab}
        >
          <Tabs.List>
            {seasons?.map((season) => (
              <Tabs.Tab
                key={season.seasonNumber}
                value={`s${season.seasonNumber}`}
              >
                S{season.seasonNumber} - {season._count._all}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {seasons?.map((season) => (
            <Tabs.Panel
              key={season.seasonNumber}
              value={`s${season.seasonNumber}`}
              mt={theme.spacing.md}
            >
              <Season
                episodes={show.episodes
                  .filter((ep) => ep.seasonNumber === season.seasonNumber)
                  .sort((a, b) => a.episodeNumber - b.episodeNumber)}
              />
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
      <Drawer
        opened={opened}
        onClose={close}
        title="Update Filler"
        position={isMobile ? 'bottom' : 'right'}
      >
        <FillerForm seasons={seasons} showId={showId} />
      </Drawer>
    </>
  );
}
