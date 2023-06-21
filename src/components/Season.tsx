import { Box, useMantineTheme } from "@mantine/core";
import { Episode } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import EpiBtn from "./EpiBtn";

function Season({
  seasonNum,
  episodes,
}: {
  seasonNum: number;
  episodes: Episode[];
}) {
  const router = useRouter();
  const showId = Number(router.query.id);
  const theme = useMantineTheme();
  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: theme.spacing.md,
      }}
    >
      {episodes.map((epi) => (
        <EpiBtn epi={epi} key={epi.id}></EpiBtn>
      ))}
    </Box>
  );
}

export default Season;
