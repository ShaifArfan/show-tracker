import axios, { AxiosError } from "axios";
import React from "react";
import { useSWRConfig } from "swr";

interface Props {
  showId: number;
  onDelete?: () => void;
}

function DeleteShowButton({ showId, onDelete }: Props) {
  const { mutate } = useSWRConfig();

  const deleteShow = async (id: number) => {
    try {
      const deletedShow = await axios.delete(`/api/show/${id}`);
      mutate("/api/show");
      onDelete && onDelete();
      console.log(deletedShow);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e);
        // toast(e.response?.data);
      }
      console.log(e);
    }
  };
  return <button onClick={() => deleteShow(showId)}>Delete</button>;
}

export default DeleteShowButton;
