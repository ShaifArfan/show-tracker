'use client';

import { createShow } from '@/app/actions/createShow';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { Button, Group, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React from 'react';
import { useSWRConfig } from 'swr';

function AddShowForm() {
  const { mutate } = useSWRConfig();
  const form = useForm({
    initialValues: {
      title: '',
      epiAmount: 0,
      seasonNum: 0,
    },
  });

  const handleSubmit = async () => {
    const res = await createShow(form.values);
    if (res?.success) {
      form.reset();
      mutate('/api/show');
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
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Group>
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
        <Button type="submit">add</Button>
      </Group>
    </form>
  );
}

export default AddShowForm;
