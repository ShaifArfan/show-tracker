'use client';

import { createShow } from '@/app/actions/createShow';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { Button, Group, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';

function AddShowForm() {
  // const { mutate } = useSWRConfig();
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
      const res = await createShow(form.values);
      if (res?.success) {
        form.reset();
        // mutate('/api/show');
        notifications.show({
          title: 'Success',
          message: 'Show added',
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: getErrorMessage(res?.error),
          color: 'red',
        });
      }
    } catch (e) {
      console.error(e);
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
