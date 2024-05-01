import { Anchor, Box, Container, Group, Title } from '@mantine/core';
import React from 'react';
import Link from 'next/link';
import { UserButton } from './UserButton';

function Header() {
  return (
    <Container>
      <Group justify="space-between">
        <Anchor component={Link} href="/" underline="never">
          <Title order={1} size={20} c="indigo">
            Show Tracker
          </Title>
        </Anchor>
        <Box>
          <UserButton />
        </Box>
      </Group>
    </Container>
  );
}

export default Header;
