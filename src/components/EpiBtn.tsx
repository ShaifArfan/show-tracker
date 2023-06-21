import { fetcher } from "@/lib/swrFetcher";
import handle from "@/pages/api/user";
import { Button } from "@mantine/core";
import { Episode } from "@prisma/client";
import axios from "axios";
import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
import useSWR, { useSWRConfig } from "swr";

interface Props {
  epi: Episode;
}

async function toggleWatched(url: string, { arg }: { arg: number }) {
  const res = await axios.put(url);
  return res.data;
}

function EpiBtn({ epi }: Props) {
  const [state, setState] = useState(epi);

  const { trigger, isMutating } = useSWRMutation(
    "/api/episode/toggle/watch/" + epi.id,
    toggleWatched
  );

  const handleClick = async () => {
    const data = await trigger(state.id);
    setState(data);
  };

  return (
    <Button
      key={state.id}
      color={state.watched ? "yellow" : "indigo"}
      p={"xs"}
      onClick={handleClick}
      disabled={isMutating}
    >
      S{state.seasonNumber} E{state.episodeNumber}
    </Button>
  );
}

export default EpiBtn;
