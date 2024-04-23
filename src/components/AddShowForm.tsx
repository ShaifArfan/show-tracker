'use client';

import { createShowAction } from '@/app/actions/show';
import {
  Box,
  Button,
  Group,
  NumberInput,
  Paper,
  Space,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';

function AddShowForm() {
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
    <Paper bg="var(--mantine-color-gray-3)" p="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Group align="flex-start">
          <TextInput
            withAsterisk
            label="Title"
            style={{ flex: 1 }}
            placeholder='e.g. "Breaking Bad"'
            {...form.getInputProps('title')}
          />
          <NumberInput
            withAsterisk
            label="Episode Amount"
            style={{ flex: 1 }}
            {...form.getInputProps('epiAmount')}
          />
          <NumberInput
            withAsterisk
            label="Season Number"
            style={{ flex: 1 }}
            {...form.getInputProps('seasonNum')}
          />
          <Box style={{ alignSelf: 'flex-center', flexGrow: 'initial' }}>
            <Space h={24} />
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              Add Show
            </Button>
          </Box>
        </Group>
      </form>
    </Paper>
  );
}

export default AddShowForm;
