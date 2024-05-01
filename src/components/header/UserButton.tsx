import { UnstyledButton, Group, Avatar, Text, Box } from '@mantine/core';
import { getCurrentUser } from '@/server/query/user';
import classes from './UserButton.module.css';
import UserButtonActions from './UserButtonActions';

export async function UserButton() {
  const user = await getCurrentUser();

  return (
    <Box>
      {/* {JSON.stringify(user)} */}
      <UnstyledButton className={classes.user}>
        <Group>
          <Avatar radius="xl">{user.name.charAt(0).toUpperCase()}</Avatar>

          <Box style={{ flex: 1 }} visibleFrom="sm">
            <Text size="sm" fw={500}>
              {user.name}
            </Text>

            <Text c="dimmed" size="xs">
              {user.email}
            </Text>
          </Box>
          <UserButtonActions />
        </Group>
      </UnstyledButton>
      {/* <Menu position="bottom-end">
        <Menu.Dropdown>
          <Menu.Item>LogoutButton</Menu.Item>
        </Menu.Dropdown>
      </Menu> */}
    </Box>
  );
}
