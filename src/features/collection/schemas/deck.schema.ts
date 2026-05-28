import { z } from "zod";

export const DeckSchema = z.object({
  id: z.string(),
  name: z.string(),
  cards: z.array(z.union([z.string(), z.any()])),
  isActive: z.boolean(),
});

export type Deck = z.infer<typeof DeckSchema>;