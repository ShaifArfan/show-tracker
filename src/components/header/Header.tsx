import { Box, Group, Title } from '@mantine/core';
import React from 'react';
import Link from 'next/link';
import { UserButton } from './UserButton';

function Header() {
  return (
    <Group justify="space-between">
      <Link href="/">
        <Title>Show Tracker</Title>
      </Link>
      <Box>
        <UserButton />
      </Box>
    </Group>
  );
}

export default Header;
