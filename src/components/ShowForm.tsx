import { Button, Group, NumberInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';

interface FormValues {
  epiAmount: number;
  seasonNum: number;
  action: FormAction;
}

type FormAction = 'add' | 'remove';

const updateEpis = async (
  url: string,
  { arg }: { arg: { epiAmount: number; seasonNum: number; action: FormAction } }
) => {
  const res = await axios.put(url, arg);
  return res;
};

interface Props {
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
  seasons: {
    _count: {
      _all: number;
    };
    seasonNumber: number;
  }[];
}

function ShowForm({ activeTab, setActiveTab, seasons }: Props) {
  setActiveTab(`s${seasons[0].seasonNumber}` || null);
  const router = useRouter();
  const showId = Number(router.query.id);

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
        <Button type="submit" disabled={isMutating}>
          Submit
        </Button>
      </Group>
    </form>
  );
}

export default ShowForm;
