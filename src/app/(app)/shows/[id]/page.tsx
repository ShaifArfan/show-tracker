import React from 'react';
import SingleShow from '@/components/show/SingleShow';
import { getCurrentUser } from '@/modules/user';
import { getSingleShowData } from '@/app/api/show/[id]/route';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const { show, seasons } = await getSingleShowData(Number(params.id), user.id);

  return (
    <SingleShow
      showId={Number(params.id)}
      initialData={{
        show,
        seasons,
      }}
    />
  );
}
