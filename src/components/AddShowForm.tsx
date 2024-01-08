'use client';

import { Button, Group, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import React from 'react';
import { useSWRConfig } from 'swr';

function AddShowForm() {
  const form = useForm({
    initialValues: {
      title: '',
      epiAmount: 0,
      seasonNum: 1,
    },
  });
  const { mutate } = useSWRConfig();

  const createShow = async ({
    title,
    epiAmount,
    seasonNum = 1,
  }: {
    title: string;
    epiAmount: number;
    seasonNum: number;
  }) => {
    try {
      const res = await axios.post('/api/show', {
        title,
        epiAmount,
        seasonNum,
      });
      if (res.status === 201) {
        form.reset();
        mutate('/api/show');
      }
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createShow({
          ...form.values,
        });
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
