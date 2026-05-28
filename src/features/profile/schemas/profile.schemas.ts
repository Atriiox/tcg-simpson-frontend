// schemas/profile.schema.ts
import { z } from "zod";

export const profileSchema = z.object({
  pseudo: z.string({ error: "Pseudo requis" }).min(3, "Minimum 3 caractères"),

  password: z
    .string({ error: "Mot de passe requis" })
    .min(8, "Minimum 8 caractères")
    .or(z.literal("********"))
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
