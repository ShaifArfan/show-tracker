## TODO:

- [x] setup eslint and prettier
- [x] PostgreSQL - (supabase)
- [x] Authentication - [next-auth](https://github.com/nextauthjs/)
- [x] UI (Mantine-V7)
- [x] Updates
  - [x] Clear Show Form on Submit
  - [x] Delete Confirmation
  - [x] Email Registration & verification
  - [x] Password Reset & Forget Password
- [x] Features

  - [x] Show description & url
  - [x] Range Watch
  - [x] Filler Episode Mark
    - [x] range validation (start < end)
  - [x] Dashboard with watched progress
  - [x] Theme change (only dark mode)
  - [ ] Analytics (heatmap-daily watches)
    - [ ] how to handle range watch for analytics?\*
  - [ ] My Account
  - [ ] DB Env Migration

Next.js File Structure

```txt
Src
├── App
│   ├── layout
│   ├── page
│   └── api
├── Components
└── Server
    ├── actions
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
