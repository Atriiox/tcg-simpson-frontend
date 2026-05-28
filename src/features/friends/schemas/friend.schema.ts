import { z } from "zod";

export const FriendSchema = z.object({
  pseudo: z.string(),
  avatar: z.string(),
  uniqueCardsCount: z.number().optional(),
});

export const FriendArraySchema = z.array(FriendSchema);

export type Friend = z.infer<typeof FriendSchema>;