import { updateShowDetails } from '@/server/actions/show';
import {
  ActionIcon,
  Button,
  Drawer,
  Stack,
  TextInput,
  Textarea,
  em,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Show } from '@prisma/client';
import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { z } from 'zod';

interface EditShowButtonProps {
  show: Show;
}

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  link: z.string().url('Link must be a valid URL').optional().or(z.literal('')),
});

function EditShowButton({ show }: EditShowButtonProps) {
  const [opened, { close, open }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`);
  const [isMutating, setIsMutating] = useState(false);

  const form = useForm({
    initialValues: {
      title: show.title,
      description: show.description || '',
      link: show.link || '',
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = async () => {
    setIsMutating(true);
    try {
      const res = await updateShowDetails({
        id: show.id,
        title: form.values.title,
        description: form.values.description,
        link: form.values.link,
      });
      notifications.show({
        title: 'Successfully Updated',
        message: `"${res.title}" show updated`,
        color: 'green',
      });

      form.resetDirty();
    } catch (e) {
      const error =
        e instanceof Error ? e : new Error('Unexpected error occurred');
      console.error(error.cause);
      notifications.show({
        title: 'Failed to Updated',
        message: error.message,
        color: 'red',
      });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div>
      <Drawer
        position={isMobile ? 'bottom' : 'right'}
        onClose={close}
        opened={opened}
        title="Edit Show"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Show Title"
              {...form.getInputProps('title')}
              size="md"
            />
            <TextInput
              label="Show URL"
              {...form.getInputProps('link')}
              size="md"
            />
            <Textarea
              size="md"
              label="Show Description"
              rows={5}
              {...form.getInputProps('description')}
            />
            <Button
              loading={isMutating}
              type="submit"
              disabled={!form.isDirty()}
            >
              Update Show
            </Button>
          </Stack>
        </form>
      </Drawer>
      <ActionIcon variant="light" onClick={open}>
        <MdEdit />
      </ActionIcon>
    </div>
  );
}

export default EditShowButton;
