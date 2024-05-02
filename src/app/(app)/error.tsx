'use client';

import { Button, Code, Flex } from '@mantine/core';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Flex align="center" justify="center" direction="column" gap="md">
      <h2>Something went wrong!</h2>
      <Code block>{JSON.stringify(error, null, 2)}</Code>
      <Button
        type="button"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </Flex>
  );
}
