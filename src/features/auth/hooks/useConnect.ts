import type { ConnectFormValues } from '../schemas/connect.schema';

export function useConnect() {
  const connect = async (values: ConnectFormValues) => {
    let res: Response;
    try {
      res = await fetch('http://localhost:3000/users/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
    } catch {
      throw new Error('NETWORK_ERROR');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data as { token: string };
  };

  return { connect };
}