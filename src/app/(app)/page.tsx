import Dashboard from '@/components/dashboard/Dashboard';
import { getMyShows } from '@/server/query/show';

async function page() {
  const shows = await getMyShows();

  return <Dashboard shows={shows} />;
}

export default page;
