'use client';

import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { registerEmail } from '@/server/actions/verify';
import { SignUpForm } from './SignUpForm';

function Register() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isMutating, setIsMutating] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
    },
  });

  const handleSubmit = async () => {
    setIsMutating(true);
    try {
      await registerEmail(form.values.email);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMutating(false);
    }
  };

  if (!token) {
    return (
      <Container size={420} my={40}>
        <Title ta="center">Welcome !</Title>
        {/* <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component={Link} href="/login">
          Login
        </Anchor>
      </Text> */}
        <form onSubmit={form.onSubmit((v) => handleSubmit())}>
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
