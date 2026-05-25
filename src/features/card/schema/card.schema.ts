import { z } from "zod";

export const CardTypeSchema = z.enum(["Personnage", "Terrain", "Objet"]);

export const CardSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: CardTypeSchema,
  rarity: z.string(),
  ATK: z.number(),
  PV: z.number(),
  description: z.string(),
  serie: z.object({
    id_serie: z.object({ id: z.string(), name: z.string() }),
    position: z.number(),
  }),
  family: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    bonus: z.object({ ATK: z.number(), PV: z.number() }),
  }),
  affinity: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    bonus: z.object({ ATK: z.number(), PV: z.number() }),
  }),
});

export type Card = z.infer<typeof CardSchema>;