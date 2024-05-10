import { updateFiller } from '@/server/actions/episode';
import { fetcher } from '@/lib/swrFetcher';
import { Alert, Button, Select, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

interface FillerFormProps {
  seasons: {
    _count: {
      _all: number;
    };
    seasonNumber: number;
  }[];
  showId: number;
}

function FillerForm({ seasons, showId }: FillerFormProps) {
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      fillerList: '',
      season: seasons[0].seasonNumber.toString(),
    },
  });

  const {
    data,
    isLoading,
    error: fetchError,
  } = useSWR(
    `/api/show/${showId}/filler?season=${form.values.season}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      form.setFieldValue('fillerList', data?.filler_list);
      form.resetDirty();
    }

    // TODO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const updateHandler = async () => {
    setIsMutating(true);
    try {
      const res = await updateFiller({
        fillerList: form.values.fillerList,
        season: Number(form.values.season),
        showId,
      });
      if (res.failedEp) {
        setMutationError(res.failedEp);
      }
      if (res.fillerList) {
        form.setFieldValue('fillerList', res.fillerList);
        form.resetDirty();
      }
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: e instanceof Error ? e.message : 'Failed to update filler',
        color: 'red',
      });
      console.error(e);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div>
      <Stack>
        <Select
          label="Select Season"
          // value={selectedSeason}
          // onChange={setSelectedSeason}
          data={seasons.map((season) => ({
            value: season.seasonNumber.toString(),
            label: `Season ${season.seasonNumber}`,
          }))}
          comboboxProps={{ withinPortal: false }}
          disabled={isLoading}
          // fz="md"
          size="md"
          {...form.getInputProps('season')}
        />
        <Textarea
          label="Filler List"
          rows={5}
          maxRows={5}
          disabled={isLoading}
          size="md"
          styles={{
            input: {
              // fontSize: '16px',
            },
          }}
          {...form.getInputProps('fillerList')}
        />

        <Button
          disabled={isLoading || isMutating || !form.isDirty()}
          onClick={updateHandler}
          loading={isMutating}
        >
          Update Filler
        </Button>
      </Stack>
      {(mutationError || fetchError) && (
        <Alert
          mt="md"
          title={mutationError ? 'Failed to Update' : 'Failed to Fetch'}
          color="red"
          withCloseButton
          onClose={() => {
            setMutationError(null);
          }}
        >
          {mutationError || fetchError.message}
        </Alert>
      )}
    </div>
  );
}

export default FillerForm;
