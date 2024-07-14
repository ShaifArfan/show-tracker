'use client';

import { fetcher } from '@/lib/swrFetcher';
import { Box, ScrollArea, Tooltip } from '@mantine/core';
import React, { useEffect } from 'react';
import useSWR from 'swr';

const levelColors = ['#4e4e4e76', '#39436d', '#5a71d0', '#3860ff', '#4967ff'];

function Heatmap() {
  const ref = React.useRef<HTMLDivElement>(null);
  const {
    data,
    isLoading,
    error: fetchError,
  } = useSWR<Record<string, number>>(`/api/episode/analytics`, fetcher);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = ref.current.scrollWidth;
    }
  }, []);

  if (isLoading) {
    return 'loading...';
  }

  if (!data) {
    return null;
  }

  const tempArr = Object.values(data).sort((a, b) => a - b);
  const min = tempArr[0];
  const max = tempArr[tempArr.length - 1];
  const stats = data;

  return (
    <ScrollArea type="always" scrollbarSize={6} viewportRef={ref}>
      <Box
        style={{
          maxWidth: '928px',
          width: '100%',
          // overflow: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          height: '90px',
          flexWrap: 'wrap',
          gap: '3px',
          rowGap: '3px',
        }}
      >
        {Object.keys(stats).map((item) => {
          // const level = Math.round((Math.random() * 10) / ((max - min) / 4));
          const level = Math.round(stats[item] / ((max - min) / 4));
          return (
            <Tooltip label={`${item}: ${stats[item]}`}>
              <Box
                bg={levelColors[level] || levelColors[0]}
                display="inline-block"
                w={12}
                h={12}
                ta="center"
                p={2}
                style={{
                  borderRadius: '2px',
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </ScrollArea>
  );
}

export default Heatmap;
