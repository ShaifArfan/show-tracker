import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    Show: {
      create: [
        {
          title: 'Bleach',
        },
      ],
    },
  },
];

const episodeData: Prisma.EpisodeCreateInput[] = [
  {
    episodeNumber: 1,
    seasonNumber: 1,
    show: {
      connect: {
        id: 1,
      },
    },
  },
  {
    episodeNumber: 2,
    seasonNumber: 1,
    show: {
      connect: {
        id: 1,
      },
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  for (const e of episodeData) {
    const episode = await prisma.episode.create({
      data: e,
    });
    console.log(`Created episode with id: ${episode.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
