import React, { useState } from 'react';
import { Episode, Show } from '@prisma/client';
import { Group, Tabs, useMantineTheme } from '@mantine/core';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetcher } from '@/lib/swrFetcher';
import Season from '@/components/Season';
import DeleteShowButton from '@/components/DeleteShowButton';
import ShowForm from '@/components/ShowForm';

interface ShowWithEpi extends Show {
  episodes: Episode[];
}
interface Props {
  show: ShowWithEpi;
  seasons: {
    _count: {
      _all: number;
    };
    seasonNumber: number;
  }[];
}

export default function SingleShow() {
  const theme = useMantineTheme();
  const router = useRouter();
  const showId = Number(router.query.id);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { data, isLoading } = useSWR(`/api/show/${showId}`, fetcher);

  if (isLoading) return <div>Loading...</div>;

  const { show, seasons } = data as Props;

  if (!show) return <div>404</div>;

  return (
    <>
      <h3>
        <Link href="/">{`<- back to home`}</Link>
      </h3>
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
      />

      {!seasons || seasons?.length < 1 ? (
        'No Episodes'
      ) : (
        <Tabs
          value={activeTab || `s${seasons[0].seasonNumber}`}
          onTabChange={setActiveTab}
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
