'use client';

import { createShowAction } from '@/server/actions/show';
import {
  Box,
  Button,
  Drawer,
  Flex,
  NumberInput,
  Paper,
  Space,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';

interface AddShowFormProps {
  withTitle?: boolean;
  onSuccess?: () => void;
}

export default function AddShowForm({
  withTitle,
  onSuccess,
}: AddShowFormProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      title: '',
      epiAmount: 0,
      seasonNum: 0,
    },
    validate: {
      title: (value) => (value.length > 0 ? null : 'Title is required'),
      epiAmount: (value) =>
        value > 0 ? null : 'Episode amount must be greater than 0',
      seasonNum: (value) =>
        value > 0 ? null : 'Season number must be greater than 0',
    },
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      form.validate();
      if (!form.isValid()) return;
      const res = await createShowAction(form.values);
      form.reset();
      notifications.show({
        title: 'New Show Added',
        message: `"${res?.title}" has been added`,
        color: 'green',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Failed to create show');
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
    <Paper bg="var(--mantine-color-dark-8)" p="md">
      {withTitle && (
        <Title order={3} mb="sm">
          Add New Shows
        </Title>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Flex
          align="flex-start"
          gap="md"
          direction={{
            base: 'column',
            xs: 'row',
          }}
        >
          <TextInput
            withAsterisk
            label="Title"
            w="100%"
            size="md"
            style={{ flex: 1 }}
            placeholder='e.g. "Breaking Bad"'
            {...form.getInputProps('title')}
          />
          <NumberInput
            withAsterisk
            label="Episode Amount"
            w="100%"
            size="md"
            style={{ flex: 1 }}
            {...form.getInputProps('epiAmount')}
          />
          <NumberInput
            withAsterisk
            label="Season No"
            size="md"
            w="100%"
            style={{ flex: 1 }}
            {...form.getInputProps('seasonNum')}
          />
          <Box
            style={{ alignSelf: 'flex-center', flexGrow: 'initial' }}
            w={{
              base: '100%',
              xs: 'auto',
            }}
          >
            <Space
              h={{
                base: 0,
                xs: '24',
              }}
            />
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              size="md"
              fullWidth
            >
              Add Show
            </Button>
          </Box>
        </Flex>
      </form>
    </Paper>
  );
}

export function AddShowDisplay() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Box visibleFrom="sm">
        <AddShowForm withTitle />
      </Box>
      <Box hiddenFrom="sm">
        <Button onClick={open} fullWidth>
          Add Shows
        </Button>
        <Drawer
          onClose={close}
          opened={opened}
          position="bottom"
          title="Add New Show"
          styles={{
            header: {
              background: 'var(--mantine-color-dark-8)',
            },
            title: {
              fontSize: 'var(--mantine-font-size-xl)',
              fontWeight: 'bold',
            },
            content: {
              height: 'max-content',
            },
            body: {
              padding: 0,
            },
          }}
        >
          <AddShowForm onSuccess={() => close()} />
        </Drawer>
      </Box>
    </>
  );
}
