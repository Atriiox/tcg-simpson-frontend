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
import { z } from "zod";

export const CardTypeSchema = z.enum(["Personnage", "Terrain", "Objet"]);
export type CardType = z.infer<typeof CardTypeSchema>;

export const CardSerieSchema = z.object({
  name_serie: z.string(),
  position: z.number().int().positive(),
});
export type CardSerie = z.infer<typeof CardSerieSchema>;

export const CardDataSchema = z.object({
  name: z.string(),
  slug: z.string(),
  type: CardTypeSchema,
  rarity: z.string(), // "1" | "2" | "3" cote backend, string pour matcher ton composant
  ATK: z.number(),
  PV: z.number(),
  family: z.string(),
  affinity: z.string(),
  serie: CardSerieSchema,
});
export type CardData = z.infer<typeof CardDataSchema>;

/**
 * Schema de la reponse de l'API quand on ouvre un booster.
 * Adapte-le a la vraie structure de ton endpoint si elle differe
 * (par exemple si ton backend retourne `{ booster_id, cards: [...] }`).
 */
export const OpenBoosterResponseSchema = z.object({
  cards: z.array(CardDataSchema),
});
export type OpenBoosterResponse = z.infer<typeof OpenBoosterResponseSchema>;
