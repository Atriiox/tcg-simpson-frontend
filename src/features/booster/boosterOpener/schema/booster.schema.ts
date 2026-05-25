/**
 * Schemas Zod pour les cartes recues du booster.
 *
 * La forme de CardData matche exactement la prop `card` de ton
 * composant Card existant (cf. composant Card.tsx, prop `card`).
 *
 * Avec Zod, on valide les donnees au runtime des qu'elles
 * reviennent de l'API : si le backend change un champ, tu auras
 * une erreur lisible plutot qu'un crash silencieux dans le rendu.
 */
// schemas/booster.schema.ts (front)
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
  probabilities: z.array(z.object({
    id: z.string(),
    rarity: z.enum(["Common", "Rare", "Legendary"]),
    value: z.number(),
  })),
});

export const UserBoosterSchema = z.object({
  booster: PublicBoosterSchema,
  number: z.number(),
});

export const UserBoosterArraySchema = z.array(UserBoosterSchema);
export type UserBoosters = z.infer<typeof UserBoosterArraySchema>;
/**
 * Schema de la reponse de l'API quand on ouvre un booster.
 * Adapte-le a la vraie structure de ton endpoint si elle differe
 * (par exemple si ton backend retourne `{ booster_id, cards: [...] }`).
 */
export const OpenBoosterResponseSchema = z.object({
  cards: z.array(CardSchema),
});
export type OpenBoosterResponse = z.infer<typeof OpenBoosterResponseSchema>;
