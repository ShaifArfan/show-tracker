## TODO:

- [x] setup eslint and prettier
- [x] PostgreSQL - (supabase)
- [x] Authentication - [next-auth](https://github.com/nextauthjs/)
- [x] UI (Mantine-v7l)
- [ ] Updates
  - [x] Clear Show Form on Submit
  - [ ] Delete Confirmation
  - [ ] Email Confirmation
  - [ ] Password Reset & Forget Password
- [ ] Features

  - [ ] Show description & url
  - [x] Range Watch
  - [x] Filler Episode Mark
    - [x] range validation (start < end)
  - [x] Dashboard with watched progress
  - [x] Theme change (only dark mode)

- [ ] move from `swr` to next.js fetch with tag and revalidate

Next.js File Structure

```txt
Src
├── App
│   ├── layout
│   ├── page
│   ├── actions
│   └── api
├── Components
└── Server
    ├── db
    └── query(actions, mutations, data fetching)
```

Prisma Migration:

```shell
npx prisma migrate dev --name added_job_title
```

Prisma Studio:

```shell
npx prisma studio
```
