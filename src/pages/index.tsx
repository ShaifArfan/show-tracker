import React, { useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import axios from "axios";

interface Show {
  id: number;
  title: string;
  episodes: Episode[];
}
interface Episode {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
}

const Blog = ({ shows }: { shows: Show[] }) => {
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
    } catch (e) {
      console.log(e);
    } finally {
      console.log("finally");
    }
    // const episodes = new Array(epiNum)
    //   .fill(null)
    //   .map((_, i) => ({ seasonNumber: 1, episodeNumber: i + 1 }));
    // const newShow = await prisma.show.create({
    //   data: {
    //     title: name,
    //     authorId: 1,
    //   },
    // });
    // console.log(newShow);
  };

  return (
    <div>
      {shows.map((show) => (
        <div key={show.id}>
          <h2>{show.title}</h2>
          <ul>
            {show.episodes.map((episode) => (
              <li key={episode.id}>
                S{episode.seasonNumber} E{episode.episodeNumber}
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
