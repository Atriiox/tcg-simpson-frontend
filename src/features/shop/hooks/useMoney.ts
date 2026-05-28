"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/reducers/user";
import { env } from "@/config/env";
import { MoneyResponseSchema } from "../schemas/money.schema";

interface RootState {
  user: {
    token: string | null;
    pseudo: string | null;
    email: string | null;
    avatar: string | null;
    money: number | null;
    countdownEnds: string | null;
    isDarkMode: boolean;
  };
}

export const useMoney = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const currentMoney = user.money ?? 0;
  const token = user.token;

  const updateReduxMoney = (newMoney: number) => {
    dispatch(
      setAuth({
        token,
        pseudo: user.pseudo,
        email: user.email,
        avatar: user.avatar,
        money: newMoney,
        countdownEnds: user.countdownEnds,
        theme: user.isDarkMode,
      }),
    );
  };

  const buyDonuts = async (packId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me/money`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packId }),
      });

      const json = await res.json();

      if (!res.ok) {
        const errorMsg = json.error || `Erreur ${res.status}`;
        setError(errorMsg);
        return { ok: false, error: errorMsg };
      }

      const parsed = MoneyResponseSchema.safeParse(json);
      if (!parsed.success) {
        setError("INVALID_RESPONSE");
        return { ok: false, error: "INVALID_RESPONSE" };
      }

      updateReduxMoney(parsed.data.money);
      return { ok: true, money: parsed.data.money };
    } catch {
      setError("NETWORK_ERROR");
      return { ok: false, error: "NETWORK_ERROR" };
    } finally {
      setIsLoading(false);
    }
  };

  return { money: currentMoney, isLoading, error, buyDonuts, updateReduxMoney };
};