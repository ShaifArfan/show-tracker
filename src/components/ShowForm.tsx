import { addEpisodes, removeEpisodes } from '@/app/actions/episode';
import { Button, Group, NumberInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { useState } from 'react';

interface FormValues {
  epiAmount: number;
  seasonNum: number;
  action: FormAction;
}

type FormAction = 'add' | 'remove';

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
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      <Group>
        <NumberInput label="epi amount" {...form.getInputProps('epiAmount')} />
        <NumberInput label="season Num" {...form.getInputProps('seasonNum')} />
        <Select
          label="Action"
          data={['add', 'remove']}
          {...form.getInputProps('action')}
        />
        <Button type="submit" disabled={mutating} loading={mutating}>
          Submit
        </Button>
      </Group>
    </form>
  );
}

export default ShowForm;
