"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/reducers/user";
import { env } from "@/config/env";

interface RootState {
  user: {
    token: string | null;
    pseudo: string | null;
    email: string | null;
    avatar: string | null;
    money: number | null;
    countdownEnds: Date | null;
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
        countdownEnds:
          user.countdownEnds instanceof Date
            ? user.countdownEnds.toISOString()
            : user.countdownEnds,
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

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || `Erreur ${res.status}`);
        return { ok: false, error: data.error };
      }

      const data = await res.json();
      updateReduxMoney(data.money);
      return { ok: true, money: data.money };
    } catch {
      setError("NETWORK_ERROR");
      return { ok: false, error: "NETWORK_ERROR" };
    } finally {
      setIsLoading(false);
    }
  };

  return { money: currentMoney, isLoading, error, buyDonuts, updateReduxMoney };
};