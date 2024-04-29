'use client';

import { Box, useMantineTheme } from '@mantine/core';
import { Episode } from '@prisma/client';
import React from 'react';
import EpiBtn from '../EpiBtn';

function Season({ episodes }: { episodes: Episode[] }) {
  const theme = useMantineTheme();
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: theme.spacing.md,
      }}
    >
      {episodes.map((epi) => (
        <EpiBtn epi={epi} key={`${epi.id}-${epi.watched}`} />
      ))}
    </Box>
  );
}

export default Season;
