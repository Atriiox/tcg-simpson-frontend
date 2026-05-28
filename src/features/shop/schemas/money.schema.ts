import { z } from "zod";

export const MoneyResponseSchema = z.object({
  money: z.number(),
});

export const DailyMoneyResponseSchema = z.object({
  money: z.number(),
  countdownEnds: z.string(),
});

export type MoneyResponse = z.infer<typeof MoneyResponseSchema>;
export type DailyMoneyResponse = z.infer<typeof DailyMoneyResponseSchema>;