import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  Menu,
  ActionIcon,
} from '@mantine/core';
import { MdExpandMore } from 'react-icons/md';
import { signOut, useSession } from 'next-auth/react';
import classes from './UserButton.module.css';

export function UserButton() {
  const { data } = useSession();
  const user = data?.user;

  if (!user) return null;

  return (
    <Box>
      <Menu position="bottom-end">
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar radius="xl">{user.name.charAt(0).toUpperCase()}</Avatar>

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {user.name}
              </Text>

              <Text c="dimmed" size="xs">
                {user.email}
              </Text>
            </div>

            <Menu.Target>
              <ActionIcon>
                <MdExpandMore />
              </ActionIcon>
            </Menu.Target>
          </Group>
        </UnstyledButton>
        <Menu.Dropdown>
          <Menu.Item onClick={() => signOut()}>Logout</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
