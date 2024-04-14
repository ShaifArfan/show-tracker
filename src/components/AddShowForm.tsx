'use client';

import { createShowAction } from '@/app/actions/show/createSow';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { Button, Group, NumberInput, TextInput } from '@mantine/core';
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
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
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
        message: getErrorMessage(error.message),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Group align="flex-end">
        <TextInput
          withAsterisk
          label="Title"
          {...form.getInputProps('title')}
        />
        <NumberInput
          withAsterisk
          label="Episode Amount"
          {...form.getInputProps('epiAmount')}
        />
        <NumberInput
          withAsterisk
          label="Season Number"
          {...form.getInputProps('seasonNum')}
        />
        <Button type="submit" loading={loading} disabled={loading}>
          Add Show
        </Button>
      </Group>
    </form>
  );
}

export default AddShowForm;
