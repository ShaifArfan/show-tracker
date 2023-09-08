export const USER_TOKEN = 'user-token';

const JWT_ACCESS_SECRET: string | undefined = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET: string | undefined = process.env.JWT_REFRESH_SECRET!;

export function getJwtSecretKey(type: 'access' | 'refresh'): string {
  if (type === 'access') {
    if (!JWT_ACCESS_SECRET || JWT_ACCESS_SECRET.length === 0) {
      throw new Error('The environment variable JWT_SECRET_KEY is not set.');
    }
    return JWT_ACCESS_SECRET;
  }
  if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET.length === 0) {
    throw new Error('The environment variable JWT_SECRET_KEY is not set.');
  }

  return JWT_REFRESH_SECRET;
}
