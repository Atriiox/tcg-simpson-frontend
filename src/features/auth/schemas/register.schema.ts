import { z } from "zod";

export const registerSchema = z.object({
  pseudo: z.string({ error: "Pseudo requis" }).min(3, "Minimum 3 caractères"),
  email: z.email({ error: "Email invalide" }),
  password: z
    .string({ error: "Mot de passe requis" })
    .min(8, "Minimum 8 caractères"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;
