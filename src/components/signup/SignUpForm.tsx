'use client';

import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { signIn } from 'next-auth/react';
import useSWRMutation from 'swr/mutation';
import axios, { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { register } from '@/server/actions/verify';
import { useState } from 'react';
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
      await register({ token, ...form.values });
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

      // if (error instanceof AxiosError) {
      //   if (error.response?.status === 409) {
      //     error.response.data.target.forEach((t: string) => {
      //       form.setFieldError(t, 'Already exists');
      //     });
      //   }
      // }
      console.error(e);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome !
      </Title>

      <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
    </Container>
  );
}
