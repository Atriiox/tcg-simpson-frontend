// schemas/booster.schema.ts
import { z } from "zod";
import { CardSchema } from "@/features/card/schema/card.schema";

const PublicBoosterSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  slug: z.string(),
  quantity: z.number(),
  cards: z.array(CardSchema),
  serie: z.object({ id: z.string(), name: z.string() }),
  probabilities: z.array(
    z.object({
      rarity: z.enum(["Common", "Rare", "Legendary"]),
      value: z.number(),
    }),
  ),
});

export const UserBoosterSchema = z.object({
  booster: PublicBoosterSchema,
  number: z.number(),
});

export const UserBoosterArraySchema = z.array(UserBoosterSchema);
export type UserBoosters = z.infer<typeof UserBoosterArraySchema>;

export const OpenBoosterResponseSchema = z.object({
  cards: z.array(CardSchema),
});
export type OpenBoosterResponse = z.infer<typeof OpenBoosterResponseSchema>;
