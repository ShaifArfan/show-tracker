'use client';

import { updateEpisodeWatchAction } from '@/app/actions/episode';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Episode } from '@prisma/client';
import React, { memo, useState } from 'react';

interface Props {
  epi: Episode;
}

function EpiBtn({ epi }: Props) {
  // using the useState so that we can apply the button changes instantly. otherwise it need to wait for the show refetch.
  const [state, setState] = useState(epi);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await updateEpisodeWatchAction({
        id: epi.id,
        watched: !epi.watched,
      });
      setState(res);
    } catch (e) {
      const error =
        e instanceof Error ? e : new Error('Failed to update episode');
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      key={state.id}
      color={state.watched ? 'yellow' : 'indigo'}
      p="xs"
      onClick={handleClick}
      disabled={loading}
      loading={loading}
    >
      S{state.seasonNumber} E{state.episodeNumber}
    </Button>
  );
}

export default memo(
  EpiBtn,
  (prev, next) => prev.epi.watched === next.epi.watched
);
