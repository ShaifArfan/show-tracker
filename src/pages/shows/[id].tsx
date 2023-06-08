import React from "react";
import prisma from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { Episode, Show } from "@prisma/client";
import { Box, Button, Grid, useMantineTheme } from "@mantine/core";

interface ShowWithEpi extends Show {
  episodes: Episode[];
}

function SingleShow({ show }: { show: ShowWithEpi }) {
  const theme = useMantineTheme();
  return (
    <>
      <h3>{show.title}</h3>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: theme.spacing.md,
        }}
      >
        {show.episodes.map((epi) => (
          <Button
            key={epi.id}
            color={epi.watched ? "yellow" : "indigo"}
            p={"xs"}
          >
            S{epi.seasonNumber} E{epi.episodeNumber}
          </Button>
        ))}
      </Box>
    </>
  );
}

export default SingleShow;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = Number(query.id);
  const show = await prisma.show.findUnique({
    where: { id },
    include: { episodes: true },
  });
  return {
    props: { show },
  };
};
