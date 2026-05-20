import { z } from 'zod';

export const registerSchema = z.object({
  pseudo: z.string().min(3, 'Pseudo must be at least 3 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;