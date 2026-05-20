import type { RegisterFormValues } from '../schemas/register.schema';

export function useRegister() {
  const register = async (values: RegisterFormValues) => {
    let res: Response;
    try {
      res = await fetch('/api/register', {
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

  return { register };
}