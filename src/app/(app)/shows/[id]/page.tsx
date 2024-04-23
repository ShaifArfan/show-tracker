import React from 'react';
import SingleShow from '@/components/show/SingleShow';
import { getCurrentUser } from '@/server/query/user';
import { getSingleShowData } from '@/server/query/show';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const { show, seasons } = await getSingleShowData(Number(params.id), user.id);

  if (!show) {
    return <div>404 - Show not found</div>;
  }

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
