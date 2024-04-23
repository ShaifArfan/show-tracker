'use client';

import { Button } from '@mantine/core';
import { Episode } from '@prisma/client';
import axios from 'axios';
import React, { memo, useState } from 'react';
import { updateEpisodeWatch } from '@/app/actions/episode';

interface Props {
  epi: Episode;
}

function EpiBtn({ epi }: Props) {
  const [state, setState] = useState(epi);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await updateEpisodeWatch({
        id: epi.id,
        watched: !state.watched,
      });
      setState(res);
      // router.refresh();
    } catch (e) {
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
