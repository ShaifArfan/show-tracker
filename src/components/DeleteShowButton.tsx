'use client';

import { deleteShowAction } from '@/server/actions/show';
import { ActionIcon, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Show } from '@prisma/client';
import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';

interface Props {
  show: Show;
  onDelete?: () => void;
}

function DeleteShowButton({ show, onDelete }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteShowAction(show.id);

      notifications.show({
        id: `delete-show${res.id}`,
        title: 'Successfully deleted',
        color: 'green',
        message: `"${res.title}" has been deleted`,
      });
      if (onDelete) {
        onDelete();
      }
    } catch (e) {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: 'Failed to delete show',
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: `Delete "${show.title}"`,
      centered: true,
      children: (
        <Text size="md">
          Do you really want to delete &quot;{show.title}&quot;?
          <br />
          This action is not irreversible.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        handleDelete();
      },
    });

  return (
    <ActionIcon
      type="button"
      onClick={openModal}
      color="red"
      variant="light"
      loading={loading}
    >
      <MdDelete />
    </ActionIcon>
  );
}

export default DeleteShowButton;
