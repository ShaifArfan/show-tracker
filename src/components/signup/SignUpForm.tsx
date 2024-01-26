'use client';

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import useSWRMutation from 'swr/mutation';
import axios, { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import classes from './SignUpForm.module.css';

export interface SignUpInfo {
  name: string;
  email: string;
  password: string;
}

const mutationFn = async (url: string, { arg }: { arg: SignUpInfo }) => {
  const res = await axios.post(url, arg);
  return res;
};

export function SignUpForm() {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { trigger, isMutating, error } = useSWRMutation(
    `/api/auth/signup`,
    mutationFn
  );

  const handleSubmit = async (values: SignUpInfo) => {
    try {
      notifications.show({
        id: 'sign-up',
        title: 'Sign up',
        message: 'Signing up...',
        loading: true,
        autoClose: false,
      });
      await trigger(values);
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        callbackUrl: '/',
      });
      notifications.update({
        id: 'sign-up',
        title: 'Sign up',
        message: 'Signed up successfully!',
        loading: false,
        color: 'green',
        autoClose: true,
      });
    } catch (e) {
      notifications.update({
        id: 'sign-up',
        title: 'Sign up',
        message: 'Failed to sign up',
        loading: false,
        color: 'red',
        autoClose: true,
      });

      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          error.response.data.target.forEach((t: string) => {
            form.setFieldError(t, 'Already exists');
          });
        }
      }
      console.error(e);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome !
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component={Link} href="/login">
          Login
        </Anchor>
      </Text>
      <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your name"
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              placeholder="you@mantine.dev"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />
          </Stack>
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" loading={isMutating} type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
}
