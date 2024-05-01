## TODO:

- [x] setup eslint and prettier
- [x] PostgreSQL - (supabase)
  - [ ] Switch to vercel postgresql
- [x] Authentication - [next-auth](https://github.com/nextauthjs/)
- [x] UI (Mantine-v7)
- [ ] Features

  - [x] Range Watch
  - [x] Filler Episode Mark
  - [x] Dashboard with watched progress
  - [ ] Theme change (only dark mode)

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
