import { z } from 'zod';

export const connectSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

export type ConnectFormValues = z.infer<typeof connectSchema>;