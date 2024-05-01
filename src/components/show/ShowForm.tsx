import {
  addEpisodes,
  rangeWatchEpisodes,
  removeEpisodes,
} from '@/app/actions/episode';
import { Box, Button, Flex, NumberInput, Select, Space } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

interface FormValues {
  epiAmount: number;
  seasonNum: number;
  action: FormAction;
}

type FormAction = 'add' | 'remove' | 'range_watch';

interface Props {
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
  showId: number;
  seasons: {
    _count: {
      _all: number;
    };
    seasonNumber: number;
  }[];
}

function ShowForm({ activeTab, setActiveTab, seasons, showId }: Props) {
  const [mutating, setMutating] = useState(false);
  const form = useForm<FormValues>({
    initialValues: {
      epiAmount: 1,
      seasonNum: 1,
      action: 'add',
    },
    validate: {
      epiAmount: (value) =>
        value < 1
          ? 'Episode amount must be greater than 0'
          : value > 10000
            ? 'Episode amount must be less than 10,000'
            : null,
      seasonNum: (value) =>
        value > 0 ? null : 'Season number must be greater than 0',
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.validate();
    if (!form.isValid()) return;
    setMutating(true);
    try {
      switch (form.values.action) {
        case 'add': {
          await addEpisodes({
            epiAmount: form.values.epiAmount,
            seasonNum: form.values.seasonNum,
            showId,
          });
          notifications.show({
            title: 'Success',
            message: 'Episodes Added',
            color: 'green',
          });
          break;
        }
        case 'remove': {
          await removeEpisodes({
            epiAmount: form.values.epiAmount,
            seasonNum: form.values.seasonNum,
            showId,
          });
          notifications.show({
            title: 'Success',
            message: 'Episodes removed',
            color: 'green',
          });
          break;
        }
        case 'range_watch': {
          const res = await rangeWatchEpisodes({
            epiAmount: form.values.epiAmount,
            seasonNum: form.values.seasonNum,
            showId,
          });
          notifications.show({
            title: 'Successfully watched Episodes',
            message: `You have watched ${res.count} episodes`,
            color: 'green',
          });
          break;
        }
        default:
          break;
      }

      // set tabs
      if (form.values.action === 'add') {
        if (form.values.seasonNum > seasons.length) {
          setActiveTab(`s${form.values.seasonNum}`);
        }
      } else if (form.values.action === 'remove') {
        const isAllDel =
          seasons[
            seasons.findIndex(
              (val) => val.seasonNumber === form.values.seasonNum
            )
          ]._count._all === form.values.epiAmount;
        if (isAllDel && activeTab === `s${form.values.seasonNum}`) {
          setActiveTab(`s${seasons[0].seasonNumber}` || null);
        }
      }
    } catch (err) {
      const myError =
        err instanceof Error ? err : new Error('Failed to update episode!!');
      notifications.show({
        title: 'Failed to update episode!!',
        message: myError.message,
        color: 'red',
      });

      console.error('fallback error', err);
    } finally {
      setMutating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex
        align="flex-start"
        gap="md"
        direction={{
          base: 'column',
          xs: 'row',
        }}
      >
        <NumberInput
          label="Episode Amount"
          w="100%"
          size="md"
          {...form.getInputProps('epiAmount')}
        />
        <NumberInput
          w="100%"
          label="Season No."
          size="md"
          {...form.getInputProps('seasonNum')}
        />
        <Select
          w="100%"
          label="Action Type"
          data={['add', 'remove', 'range_watch']}
          size="md"
          {...form.getInputProps('action')}
        />
        <Box
          style={{ alignSelf: 'flex-center', flexGrow: 'initial' }}
          w={{
            base: '100%',
            xs: 'auto',
          }}
        >
          <Space
            h={{
              base: 0,
              xs: '24',
            }}
          />
          <Button
            type="submit"
            disabled={mutating}
            loading={mutating}
            size="md"
            fullWidth
          >
            Update
          </Button>
        </Box>
      </Flex>
    </form>
  );
}

export default ShowForm;
