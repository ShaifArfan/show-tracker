'use client';

import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { registerEmailAction } from '@/server/actions/auth';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { SignUpForm } from './SignUpForm';

function Register() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
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

  if (!token) {
    return (
      <Container size={420} my={40}>
        <Title ta="center" order={2}>
          Register
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Already have an account?{' '}
          <Anchor size="sm" component={Link} href="/login">
            Login
          </Anchor>
        </Text>
        <form onSubmit={form.onSubmit(() => handleSubmit())}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
            <Group justify="space-between" mt="lg">
              {/* <Checkbox label="Remember me" /> */}
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" loading={isMutating} type="submit">
              Register
            </Button>
          </Paper>
        </form>
      </Container>
    );
  }
  return (
    <Container>
      <SignUpForm token={token} />
    </Container>
  );
}

export default Register;
