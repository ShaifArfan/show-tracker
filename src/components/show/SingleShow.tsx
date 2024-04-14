'use client';

import React, { useState } from 'react';
import { Episode, Show } from '@prisma/client';
import { Group, Tabs, useMantineTheme } from '@mantine/core';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/swrFetcher';
import ShowForm from '@/components/ShowForm';
import Season from './Season';
import DeleteShowButton from '../DeleteShowButton';

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

  const { data } = useSWR<ShowData>(`/api/show/${showId}`, fetcher, {
    fallbackData: initialData,
  });

  if (!data || !data.show || !data.seasons) return <div>404</div>;

  const { show, seasons } = data;

  return (
    <>
      <Group>
        <h3>{show.title}</h3>
        <DeleteShowButton
          showId={showId}
          onDelete={() => {
            router.push('/');
          }}
        />
      </Group>
      <ShowForm
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        seasons={seasons}
        showId={showId}
      />

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
                seasonNum={season.seasonNumber}
                episodes={show.episodes
                  .filter((ep) => ep.seasonNumber === season.seasonNumber)
                  .sort((a, b) => a.episodeNumber - b.episodeNumber)}
              />
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
    </>
  );
}
