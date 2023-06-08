import React, { useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import axios, { AxiosError } from "axios";
import { Episode, Show } from "@prisma/client";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { Button, Group, NumberInput, TextInput } from "@mantine/core";

const Blog = ({ shows }: { shows: Show[] }) => {
  const form = useForm({
    initialValues: {
      title: "",
      epiAmount: 0,
      seasonNum: 1,
    },
  });

  const [formValue, setFormValue] = useState({
    name: "",
    epiNum: 0,
  });
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
      const newShow = await axios.post("/api/show", {
        title,
        epiAmount,
        seasonNum,
      });
      console.log(newShow);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteShow = async (id: number) => {
    try {
      const deletedShow = await axios.delete(`/api/show/${id}`);
      console.log(deletedShow);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e);
        // toast(e.response?.data);
      }
      console.log(e);
    }
  };

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
      {shows &&
        shows.map((show) => (
          <div key={show.id}>
            <h2>
              <Link href={`shows/${show.id}`}>{show.title}</Link>
            </h2>
            <button onClick={() => deleteShow(show.id)}>Delete</button>
            {/* <ul>
              {show.episodes.map((episode) => (
                <li key={episode.id}>
                  S{episode.seasonNumber} E{episode.episodeNumber} - Filler{" "}
                  {episode.isFiller ? "Yes" : "No"} - watched{" "}
                  {episode.watched ? "Yes" : "No"}
                  <a
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWatched(episode.id);
                    }}
                  >
                    {episode.watched ? "unwatch" : "watched"}
                  </a>
                </li>
              ))}
            </ul> */}
          </div>
        ))}

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
            {...form.getInputProps("title")}
          />
          <NumberInput
            withAsterisk
            label="Episode Amount"
            {...form.getInputProps("epiAmount")}
          ></NumberInput>
          <NumberInput
            withAsterisk
            label="Season Number"
            {...form.getInputProps("seasonNum")}
          ></NumberInput>
          <Button type="submit">add</Button>
        </Group>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const shows = await prisma.show.findMany({
    include: { episodes: true },
  });
  return {
    props: { shows },
  };
};

export default Blog;
