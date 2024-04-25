'use client';

import { createShowAction } from '@/app/actions/show';
import {
  Box,
  Button,
  Flex,
  NumberInput,
  Paper,
  Space,
  TextInput,
  Title,
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
      <Title order={3} mb="sm">
        Add New Shows
      </Title>
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
            style={{ flex: 1 }}
            placeholder='e.g. "Breaking Bad"'
            {...form.getInputProps('title')}
          />
          <NumberInput
            withAsterisk
            label="Episode Amount"
            w="100%"
            style={{ flex: 1 }}
            {...form.getInputProps('epiAmount')}
          />
          <NumberInput
            withAsterisk
            label="Season No"
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

export default AddShowForm;
