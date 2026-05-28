"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/reducers/user"; // Adapte le chemin si nécessaire
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

  const updateMoney = async (newMoneyAmount: number) => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token") || user.token;
    let res: Response;

    const targetUrl = `${env.NEXT_PUBLIC_API_URL}/users/me/money`;
    console.log("Appel API Monnaie :", targetUrl);

    try {
      res = await fetch(targetUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ money: newMoneyAmount }),
      });
    } catch (err) {
      console.error("Erreur réseau :", err);
      setError("NETWORK_ERROR");
      setIsLoading(false);
      return { ok: false, error: "NETWORK_ERROR" };
    }

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setError(data.error || `Erreur ${res.status}`);
        setIsLoading(false);
        return { ok: false, error: data.error };
      } else {
        const errorMsg = `Erreur serveur HTTP ${res.status} (Vérifie la route sur ton Back-end)`;
        console.error(errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return { ok: false, error: errorMsg };
      }
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();

      dispatch(
        setAuth({
          token: token,
          pseudo: user.pseudo,
          email: user.email,
          avatar: user.avatar,
          money: data.money !== undefined ? data.money : newMoneyAmount,
          countdownEnds:
            user.countdownEnds instanceof Date
              ? user.countdownEnds.toISOString()
              : user.countdownEnds,
          theme: user.isDarkMode,
        }),
      );

      setIsLoading(false);
      return { ok: true, money: data.money };
    } else {
      setError("Le serveur a répondu avec succès mais sans JSON.");
      setIsLoading(false);
      return { ok: false, error: "INVALID_RESPONSE_FORMAT" };
    }
  };

  return { money: currentMoney, isLoading, error, updateMoney };
};
