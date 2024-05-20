'use client';

import { resetPasswordTokenAction } from '@/server/actions/password';
import {
  Button,
  Paper,
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

function EmailResetPassword() {
  const [loading, setLoading] = React.useState(false);
  const form = useForm({
    initialValues: {
      email: '',
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Reset password logic here
      await resetPasswordTokenAction(form.values.email);
      notifications.show({
        title: 'Success',
        message: 'Reset password email sent',
        color: 'blue',
      });
    } catch (e) {
      // Handle error
      const error = e instanceof Error ? e : new Error('Failed to send email');
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
      <Text>A reset link will be sent to this email.</Text>
      <Space h="md" />
      <form onSubmit={form.onSubmit(() => handleSubmit())}>
        <Stack>
          <TextInput
            size="md"
            type="email"
            label="Your Email"
            {...form.getInputProps('email')}
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

export default EmailResetPassword;
