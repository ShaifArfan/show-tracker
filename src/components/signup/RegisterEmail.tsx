'use client';

import {
  Anchor,
  Box,
  Button,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import React, { useState } from 'react';
import { registerEmailAction } from '@/server/actions/auth';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

function Register() {
  const [isMutating, setIsMutating] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail('Invalid email'),
    },
  });

  const handleSubmit = async () => {
    setIsMutating(true);
    try {
      await registerEmailAction(form.values.email);
      notifications.show({
        id: 'register-email',
        title: 'Register Email',
        message: 'Email sent successfully!',
        color: 'green',
      });
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Failed to send email');
      console.error(error);
      notifications.show({
        id: 'register-email',
        title: 'Register Email Failed',
        message: error.message,
        color: 'red',
      });
      form.setFieldError('email', error.message);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <Box w="100%" maw={400}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Box mb="lg">
          <Title order={2}>Register</Title>
          <Text c="dimmed" size="sm" mt={5}>
            Already have an account?{' '}
            <Anchor size="sm" component={Link} href="/login">
              Login
            </Anchor>
          </Text>
        </Box>
        <form onSubmit={form.onSubmit(() => handleSubmit())}>
          <Stack>
            <TextInput
              label="Email"
              type="email"
              placeholder="you@mantine.dev"
              required
              size="md"
              {...form.getInputProps('email')}
            />
          </Stack>
          <Button fullWidth mt="md" loading={isMutating} type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;
