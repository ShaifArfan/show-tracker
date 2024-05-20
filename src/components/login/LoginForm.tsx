'use client';

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

interface LoginInfo {
  email: string;
  password: string;
}

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: LoginInfo) => {
    try {
      setLoading(true);
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        callbackUrl: '/',
      });
    } catch (error) {
      // const
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="100%" maw={400}>
      <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
        <Paper withBorder shadow="md" p={30} mt={30}>
          <Box mb="lg">
            <Title order={2}>Welcome back!</Title>
            <Text c="dimmed" size="sm" mt={5}>
              Do not have an account yet?{' '}
              <Anchor size="sm" component={Link} href="/signup">
                Create account
              </Anchor>
            </Text>
          </Box>
          <TextInput
            type="email"
            label="Email"
            placeholder="you@mantine.dev"
            required
            size="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            size="md"
            {...form.getInputProps('password')}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component={Link} size="sm" href="/reset-password">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" loading={loading} type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Box>
  );
}
