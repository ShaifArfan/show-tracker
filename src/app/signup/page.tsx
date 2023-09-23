'use client';

import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';

const mutationFn = async (
  url: string,
  { arg }: { arg: { name: string; email: string; password: string } }
) => {
  const res = await axios.post(url, arg);
  return res;
};

function SingUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { trigger, isMutating } = useSWRMutation(`/api/signup/`, mutationFn);
  const register = async () => {
    const res = await trigger({ ...form });
    if (res?.statusText === 'OK') {
      console.log('res', res.data);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          register();
        }}
      >
        <label htmlFor="name">
          Name
          <input
            type="text"
            placeholder="name"
            id="name"
            value={form.name}
            onChange={({ target }) => setForm({ ...form, name: target.value })}
          />
        </label>
        <br />
        <label htmlFor="email">
          Email
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={form.email}
            onChange={({ target }) => setForm({ ...form, email: target.value })}
          />
        </label>
        <br />
        <label htmlFor="password">
          Password
          <input
            type="password"
            placeholder="****"
            id="password"
            value={form.password}
            onChange={({ target }) =>
              setForm({ ...form, password: target.value })
            }
          />
        </label>
        <br />
        <button type="submit">register</button>
      </form>
    </div>
  );
}

export default SingUp;
