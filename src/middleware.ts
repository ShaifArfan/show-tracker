// eslint-disable-next-line no-restricted-exports
export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/((?!signup|reset-password|login|api/signup|site.webmanifest|screenshots/*).*)',
  ],
};
