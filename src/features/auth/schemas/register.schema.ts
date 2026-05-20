import { z } from 'zod';

export const registerSchema = z.object({
  pseudo: z.string({ error: 'Pseudonyme requis' }).min(3, 'Minimum 3 caractères').max(20),
  email:  z.email({ error: 'Email invalide' }).max(254),
  password: z.string({ error: 'Mot de passe requis' }).min(8, 'Minimum 8 caractères').max(72),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;