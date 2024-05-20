'use client';

import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Button,
  Stack,
  Box,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { signIn } from 'next-auth/react';
import { notifications } from '@mantine/notifications';
import { signUpAction } from '@/server/actions/auth';
import { useState } from 'react';

export interface SignUpInfo {
  name: string;
  email: string;
  password: string;
}

export function SignUpForm({ token }: { token: string }) {
  const payload = token.split('.')[1];
  const { email } = JSON.parse(atob(payload));
  const [isMutating, setIsMutating] = useState(false);
  const form = useForm({
    initialValues: {
      name: '',
      email,
      password: '',
    },
  });

  const handleSubmit = async (values: SignUpInfo) => {
    setIsMutating(true);
    try {
      await signUpAction({ token, ...form.values });
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        callbackUrl: '/',
      });
      notifications.show({
        id: 'sign-up',
        title: 'Sign up',
        message: 'Signed up successfully!',
        loading: false,
        color: 'green',
        autoClose: true,
      });
    } catch (e) {
      notifications.show({
        id: 'sign-up',
        title: 'Sign up',
        message: 'Failed to sign up',
        loading: false,
        color: 'red',
        autoClose: true,
      });

      console.error(e);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <Box w="100%" maw={400}>
      <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Box mb="xl">
            <Title order={2}>Create an account!</Title>
            <Text>Fill in the form below to create an account.</Text>
          </Box>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your name"
              required
              size="md"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="you@mantine.dev"
              required
              size="md"
              readOnly
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              size="md"
              {...form.getInputProps('password')}
            />
          </Stack>
          <Button fullWidth mt="xl" loading={isMutating} type="submit">
            Sign Up
          </Button>
        </Paper>
      </form>
    </Box>
  );
}
