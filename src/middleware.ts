// eslint-disable-next-line no-restricted-exports
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/((?!signup|login|api/signup|site.webmanifest|screenshots/*).*)'],
};
