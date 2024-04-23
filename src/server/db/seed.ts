import { PrismaClient, Prisma, User } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    Show: {
      create: [
        {
          title: 'Bleach seed 2',
          episodes: {
            create: [
              {
                episodeNumber: 1,
                seasonNumber: 1,
              },
              {
                episodeNumber: 2,
                seasonNumber: 1,
              },
            ],
          },
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  let user: User;
  await userData.forEach(async (u) => {
    user = await prisma.user.upsert({
      where: {
        email: u.email,
      },
      update: u,
      create: u,
    });
    console.log(`Created user with id: ${user.id}`);
  });

  // await episodeData.forEach(async (e) => {
  //   const episode = await prisma.episode.create({
  //     data: e,
  //   });
  //   console.log(`Created episode with id: ${episode.id}`);
  // });

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
