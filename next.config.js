const { withSuperjson } = require('next-superjson');

/** @type {import('next').NextConfig} */
const nextConfig = withSuperjson()({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
});

module.exports = nextConfig;
