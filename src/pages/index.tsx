import React, { useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import axios, { AxiosError } from "axios";
import { Episode, Show } from "@prisma/client";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { Button, Group, NumberInput, TextInput } from "@mantine/core";
import AddShowForm from "@/components/AddShowForm";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import { fetcher } from "@/lib/swrFetcher";
import DeleteShowButton from "@/components/DeleteShowButton";

interface Props {
  shows: Show[];
}

const HomePage = () => {
  const { data: shows }: { data: Show[] } = useSWR("/api/show", fetcher);
  console.log(shows);

  const toggleWatched = async (id: number) => {
    try {
      const updatedEpisode = await axios.put(
        `/api/episode/toggle/watch/${id}`,
        {
          watched: true,
        }
      );
      console.log(updatedEpisode);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e);
        // toast(e.response?.data);
      }
      console.log(e);
    }
  };

  return (
    <div>
      <AddShowForm></AddShowForm>
      {shows &&
        shows.map((show) => (
          <Group key={show.id}>
            <h2>
              <Link href={`shows/${show.id}`}>{show.title}</Link>
            </h2>
            <DeleteShowButton showId={show.id}></DeleteShowButton>
          </Group>
        ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const shows = await prisma.show.findMany();
  return {
    props: {
      fallback: {
        "/api/show/": { shows },
      },
    },
  };
};

export default function Page({ fallback }: { fallback: Props }) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <HomePage />
    </SWRConfig>
  );
}
