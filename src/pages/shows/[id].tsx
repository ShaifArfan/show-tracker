import React from "react";
import prisma from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { Episode, Show } from "@prisma/client";
import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  NumberInput,
  Tabs,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import { useForm } from "@mantine/form";
import { Tab } from "@mantine/core/lib/Tabs/Tab/Tab";
import Season from "@/components/Season";
import useSWR, { SWRConfig } from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/lib/swrFetcher";
import { getSingleShowData } from "../api/show/[id]";
import useSWRMutation from "swr/mutation";
import DeleteShowButton from "@/components/DeleteShowButton";

interface ShowWithEpi extends Show {
  episodes: Episode[];
}
interface Props {
  show: ShowWithEpi;
  seasons: {
    _count: {
      _all: number;
    };
    seasonNumber: number;
  }[];
}

const addNewEpis = async (
  url: string,
  { arg }: { arg: { epiAmount: number; seasonNum: number } }
) => {
  try {
    const res = await axios.post(url, arg);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

function SingleShow() {
  const theme = useMantineTheme();
  const router = useRouter();
  const showId = Number(router.query.id);
  const { data } = useSWR("/api/show/" + showId, fetcher);
  const { show, seasons } = data as Props;
  console.log(seasons);

  const form = useForm({
    initialValues: {
      epiAmount: 1,
      seasonNum: 1,
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    "/api/show/" + showId,
    addNewEpis
  );

  const addEpisodes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await trigger({
      epiAmount: form.values.epiAmount,
      seasonNum: form.values.seasonNum,
    });
  };

  return (
    <>
      <Group>
        <h3>{show.title}</h3>
        <DeleteShowButton
          showId={showId}
          onDelete={() => {
            router.push("/");
          }}
        ></DeleteShowButton>
      </Group>
      <form onSubmit={addEpisodes}>
        <Group>
          <NumberInput
            label="epi amount"
            {...form.getInputProps("epiAmount")}
          ></NumberInput>
          <NumberInput
            label="season Num"
            {...form.getInputProps("seasonNum")}
          ></NumberInput>
          <Button type="submit" disabled={isMutating}>
            Submit
          </Button>
        </Group>
      </form>
      {seasons && seasons?.length < 1 ? (
        "No Episodes"
      ) : (
        <Tabs defaultValue={seasons ? "s" + seasons[0].seasonNumber : null}>
          <Tabs.List>
            {seasons?.map((season) => (
              <Tabs.Tab
                key={season.seasonNumber}
                value={"s" + season.seasonNumber}
              >
                S{season.seasonNumber} - {season._count._all}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {seasons?.map((season) => (
            <Tabs.Panel
              key={season.seasonNumber}
              value={"s" + season.seasonNumber}
              mt={theme.spacing.md}
            >
              <Season
                seasonNum={season.seasonNumber}
                episodes={show.episodes.filter(
                  (ep) => ep.seasonNumber === season.seasonNumber
                )}
              ></Season>
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = Number(query.id);
  const { show, seasons } = await getSingleShowData(id);
  return {
    props: {
      fallback: {
        ["/api/show/" + id]: { show, seasons },
      },
    },
  };
};

export default function Page({ fallback }: { fallback: Props }) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <SingleShow />
    </SWRConfig>
  );
}
