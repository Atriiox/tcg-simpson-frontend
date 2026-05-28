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


export const UpdateProfileResponseSchema = z.object({
  pseudo: z.string().optional(),
  money: z.number().optional(),
  avatar: z.string().optional(),
  darkMode: z.boolean().optional(),
  countdownEnds: z.string().nullable().optional(),
  email: z.string().optional(),
});

export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;

export type ProfileFormValues = z.infer<typeof profileSchema>;
