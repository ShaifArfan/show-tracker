import React from 'react';
import SingleShow from '@/components/show/SingleShow';
import { getSingleShowData } from '@/server/query/show';

export default async function Page({ params }: { params: { id: string } }) {
  const { show, seasons } = await getSingleShowData(Number(params.id));

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
