import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Episode, Show } from '@prisma/client';
import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  NumberInput,
  Select,
  Tabs,
  useMantineTheme,
} from '@mantine/core';
import axios from 'axios';
import { useForm } from '@mantine/form';
import { Tab } from '@mantine/core/lib/Tabs/Tab/Tab';
import useSWR, { SWRConfig } from 'swr';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';
import { fetcher } from '@/lib/swrFetcher';
import Season from '@/components/Season';
import prisma from '@/lib/prisma';
import DeleteShowButton from '@/components/DeleteShowButton';
import { getSingleShowData } from '../api/show/[id]';

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

type FormAction = 'add' | 'remove';
interface FormValues {
  epiAmount: number;
  seasonNum: number;
  action: FormAction;
}
const updateEpis = async (
  url: string,
  { arg }: { arg: { epiAmount: number; seasonNum: number; action: FormAction } }
) => {
  try {
    const res = await axios.put(url, arg);
    return res;
  } catch (e) {}
};

function SingleShow() {
  const theme = useMantineTheme();
  const router = useRouter();
  const showId = Number(router.query.id);
  const { data, isLoading } = useSWR(`/api/show/${showId}`, fetcher);
  const { show, seasons } = data as Props;
  const [activeTab, setActiveTab] = useState<string | null>(
    seasons ? `s${seasons[0]?.seasonNumber}` : null
  );

  const form = useForm<FormValues>({
    initialValues: {
      epiAmount: 1,
      seasonNum: 1,
      action: 'add',
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    `/api/show/${showId}`,
    updateEpis
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await trigger({
      epiAmount: form.values.epiAmount,
      seasonNum: form.values.seasonNum,
      action: form.values.action,
    });
    if (res?.status !== 202) return;
    if (form.values.action === 'add') {
      if (form.values.seasonNum > seasons.length) {
        setActiveTab(`s${form.values.seasonNum}`);
      }
    } else if (form.values.action === 'remove') {
      const isAllDel =
        seasons[
          seasons.findIndex((val) => val.seasonNumber === form.values.seasonNum)
        ]._count._all === form.values.epiAmount;
      if (isAllDel && activeTab === `s${form.values.seasonNum}`) {
        setActiveTab(`s${seasons[0].seasonNumber}` || null);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!show) return <div>404</div>;

  return (
    <>
      <Group>
        <h3>{show.title}</h3>
        <DeleteShowButton
          showId={showId}
          onDelete={() => {
            router.push('/');
          }}
        />
      </Group>
      <form onSubmit={handleSubmit}>
        <Group>
          <NumberInput
            label="epi amount"
            {...form.getInputProps('epiAmount')}
          />
          <NumberInput
            label="season Num"
            {...form.getInputProps('seasonNum')}
          />
          <Select
            label="Action"
            data={['add', 'remove']}
            {...form.getInputProps('action')}
          />
          <Button type="submit" disabled={isMutating}>
            Submit
          </Button>
        </Group>
      </form>
      {!seasons || seasons?.length < 1 ? (
        'No Episodes'
      ) : (
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            {seasons?.map((season) => (
              <Tabs.Tab
                key={season.seasonNumber}
                value={`s${season.seasonNumber}`}
              >
                S{season.seasonNumber} - {season._count._all}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {seasons?.map((season) => (
            <Tabs.Panel
              key={season.seasonNumber}
              value={`s${season.seasonNumber}`}
              mt={theme.spacing.md}
            >
              <Season
                seasonNum={season.seasonNumber}
                episodes={show.episodes.filter(
                  (ep) => ep.seasonNumber === season.seasonNumber
                )}
              />
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
        [`/api/show/${id}`]: { show, seasons },
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
