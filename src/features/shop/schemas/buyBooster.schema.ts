import { z } from "zod";

export const BuyBoosterResponseSchema = z.object({
  success: z.boolean(),
  money: z.number(),
});

export type BuyBoosterResponse = z.infer<typeof BuyBoosterResponseSchema>;