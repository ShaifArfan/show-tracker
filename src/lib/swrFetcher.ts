import axios from 'axios';

export const fetcher = (url: string) => {
  try {
    return axios.get(url).then((res) => res.data);
  } catch (e: any) {
    throw new Error(e);
  }
};
