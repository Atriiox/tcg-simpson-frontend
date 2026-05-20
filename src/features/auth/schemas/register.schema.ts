import { z } from "zod";

export const registerSchema = z.object({
  pseudo: z
    .string({ error: "Pseudo requis" })
    .min(3, "Minimum 3 caractères")
    .max(20, "Maximum 20 caractères"),
  email: z
    .email({ error: "Email invalide" })
    .max(254, "Maximum 254 caractères"),
  password: z
    .string({ error: "Mot de passe requis" })
    .min(8, "Minimum 8 caractères")
    .max(72, "Maximum 72 caractères"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;
