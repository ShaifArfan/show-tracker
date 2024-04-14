'use client';

import { deleteShow } from '@/app/actions/deleteShow';
import { ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';

interface Props {
  showId: number;
  onDelete?: () => void;
}

function DeleteShowButton({ showId, onDelete }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteShow(showId);
      // const res: Response<Show> = await fetch(`/api/shows/${showId}`, {
      //   method: 'DELETE',
      // });

      notifications.show({
        id: `delete-show${res.data?.id}`,
        title: 'Successfully deleted',
        color: 'green',
        message: `"${res.data?.title}" has been deleted`,
      });
      if (onDelete) {
        onDelete();
      }
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Failed to delete show');
      console.error(error);
      notifications.show({
        title: 'Error',
        color: 'red',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActionIcon
      type="button"
      onClick={handleDelete}
      color="red"
      variant="light"
      loading={loading}
    >
      <MdDelete />
    </ActionIcon>
  );
}

export default DeleteShowButton;
