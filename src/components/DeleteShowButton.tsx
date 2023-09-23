import axios, { AxiosError } from 'axios';
import React from 'react';
import { useSWRConfig } from 'swr';

interface Props {
  showId: number;
  onDelete?: () => void;
}

function DeleteShowButton({ showId, onDelete }: Props) {
  const { mutate } = useSWRConfig();

  const deleteShow = async (id: number) => {
    try {
      const deletedShow = await axios.delete(`/api/show/${id}`);
      mutate('/api/show');
      if (onDelete) {
        onDelete();
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e);
      }
    }
  };
  return (
    <button type="button" onClick={() => deleteShow(showId)}>
      Delete
    </button>
  );
}

export default DeleteShowButton;
