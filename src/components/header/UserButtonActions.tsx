'use client';

import { ActionIcon, Badge, Box, Menu } from '@mantine/core';
import { signOut } from 'next-auth/react';
import React from 'react';
import { MdExpandMore } from 'react-icons/md';

function UserButtonActions() {
  return (
    <Box>
      <Menu>
        <Menu.Target>
          <ActionIcon component="div">
            <MdExpandMore />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item disabled>
            Account <Badge>Soon!</Badge>{' '}
          </Menu.Item>
          <Menu.Item onClick={() => signOut()}> Logout</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}

export default UserButtonActions;
