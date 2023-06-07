import React, { useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Episode, Show } from "@prisma/client";

interface ShowWithEpi extends Show {
  episodes: Episode[];
}

const Blog = ({ shows }: { shows: ShowWithEpi[] }) => {
  const [formValue, setFormValue] = useState({
    name: "",
    epiNum: 0,
  });
  const createShow = async ({
    name,
    epiNum,
  }: {
    name: string;
    epiNum: number;
  }) => {
    try {
      const newShow = await axios.post("/api/show", {
        title: name,
        epiNum,
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
        toast(e.response?.data);
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
        toast(e.response?.data);
      }
      console.log(e);
    }
  };

  return (
    <div>
      {shows &&
        shows.map((show) => (
          <div key={show.id}>
            <h2>{show.title}</h2>
            <button onClick={() => deleteShow(show.id)}>Delete</button>
            <ul>
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
            </ul>
          </div>
        ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createShow(formValue);
        }}
      >
        <input
          type="text"
          name="name"
          value={formValue.name}
          onChange={(e) =>
            setFormValue((preValue) => ({
              ...preValue,
              name: e.target.value,
            }))
          }
        />
        <input
          type="number"
          name="epiNum"
          value={formValue.epiNum}
          onChange={(e) =>
            setFormValue((preValue) => ({
              ...preValue,
              epiNum: e.target.valueAsNumber,
            }))
          }
        />
        <button type="submit">add</button>
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
