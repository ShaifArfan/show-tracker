'use client';

import React, { useState } from 'react';
import { Episode, Show } from '@prisma/client';
import {
  Anchor,
  Box,
  Button,
  Drawer,
  Flex,
  Paper,
  Space,
  Tabs,
  Title,
  em,
  useMantineTheme,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { DisplayShowForm } from '@/components/show/ShowForm';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Season from './Season';
import DeleteShowButton from '../DeleteShowButton';
import FillerForm from './FillerForm';
import EditShowButton from './EditShowButton';

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
      <Paper bg="var(--mantine-color-dark-8)" p="md">
        <Flex
          gap="md"
          justify="space-between"
          direction={{
            base: 'column',
            xs: 'row',
          }}
        >
          <Box>
            <Title order={2}>{show.title}</Title>
            {show.link && (
              <Anchor target="_blank" href={show.link}>
                {show.link}
              </Anchor>
            )}
          </Box>
          <Flex gap="md" align="center">
            <EditShowButton show={show} />
            <DeleteShowButton
              showId={showId}
              onDelete={() => {
                router.push('/');
              }}
            />
            <Button variant="light" onClick={open} fullWidth>
              Update Filler
            </Button>
          </Flex>
        </Flex>
        <Space h="sm" />
        <DisplayShowForm
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          seasons={seasons}
          showId={showId}
        />
      </Paper>
      <Space h="md" />
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
