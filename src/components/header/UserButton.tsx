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
import { getCurrentUser } from '@/modules/user';
import classes from './UserButton.module.css';
import UserButtonActions from './UserButtonActions';

export async function UserButton() {
  const user = await getCurrentUser();
  // const { data } = useSession();
  // const user = data?.user;

  // if (!user) return null;

  return (
    <Box>
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
