import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/modules/user';
import Dashboard from '@/components/dashboard/Dashboard';

async function page() {
  const user = await getCurrentUser();

  const shows = await prisma.show.findMany({
    where: {
      userId: user.id,
    },
  });

  return <Dashboard shows={shows} />;
}

export default page;
