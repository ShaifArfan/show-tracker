import { Box, Container, Group, Title } from '@mantine/core';
import React from 'react';
import Link from 'next/link';
import { UserButton } from './UserButton';

function Header() {
  return (
    <Container>
      <Group justify="space-between">
        <Link href="/">
          <Title order={1} size={20}>
            Show Tracker
          </Title>
        </Link>
        <Box>
          <UserButton />
        </Box>
      </Group>
    </Container>
  );
}

export default Header;
