'use client';

import { ActionIcon } from '@mantine/core';
import axios from 'axios';
import React from 'react';
import { MdDelete } from 'react-icons/md';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

interface Props {
  showId: number;
  onDelete?: () => void;
}

const mutateFn = async (url: string) => {
  const res = await axios.delete(url);
  return res.data;
};

function DeleteShowButton({ showId, onDelete }: Props) {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating } = useSWRMutation(
    `/api/show/${showId}`,
    mutateFn
  );

  return (
    <ActionIcon
      type="button"
      onClick={() =>
        trigger()
          .then(() => mutate('/api/show'))
          .then(() => onDelete && onDelete())
      }
      color="red"
      variant="light"
      loading={isMutating}
    >
      <MdDelete />
    </ActionIcon>
  );
}

export default DeleteShowButton;
