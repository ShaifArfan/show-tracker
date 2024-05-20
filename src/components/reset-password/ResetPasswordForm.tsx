'use client';

import { resetPasswordAction } from '@/server/actions/password';
import {
  Button,
  Paper,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import React from 'react';

function ResetPasswordForm({ token }: { token: string }) {
  const payload = token.split('.')[1];
  const { email } = JSON.parse(atob(payload));
  const [loading, setLoading] = React.useState(false);
  const form = useForm({
    initialValues: {
      email,
      password: '',
      confirm_password: '',
    },
    validate: {
      password: (value) =>
        value.length < 4 ? 'Password needs to be at least 4 char' : null,
      confirm_password: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await resetPasswordAction({ token, ...form.values });

      notifications.show({
        title: 'Success',
        message: 'Password reset successfully',
        color: 'blue',
      });
    } catch (e) {
      const error =
        e instanceof Error ? e : new Error('Failed to reset password');
      console.error(error);
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" bg="dark" w="100%" maw={400}>
      <Title order={2}>Reset Password</Title>
      <Text>Setup your new password</Text>
      <Space h="md" />
      <form onSubmit={form.onSubmit(() => handleSubmit())}>
        <Stack>
          <TextInput
            size="md"
            type="email"
            label="Your Email"
            readOnly
            {...form.getInputProps('email')}
          />
          <PasswordInput
            size="md"
            label="New Password"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            size="md"
            label="Confirm New Password"
            {...form.getInputProps('confirm_password')}
          />
          <Button fullWidth type="submit" loading={loading}>
            Reset Password
          </Button>
          <Button fullWidth variant="light" component={Link} href="/login">
            Back to Login
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default ResetPasswordForm;
