'use client';

import { ActionIcon, Badge, Button, Menu } from '@mantine/core';
import { signOut } from 'next-auth/react';
import React from 'react';
import { MdExpandMore } from 'react-icons/md';

function UserButtonActions() {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon>
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
  );
}

export default UserButtonActions;
