"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/reducers/user";
import { env } from "@/config/env";
import { RootState } from "@/store/store";

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user);

  const profile = {
    pseudo: userState.pseudo,
    email: userState.email,
    money: userState.money,
    isDarkMode: userState.isDarkMode,
  };

  const updateProfile = async (updates: {
    pseudo?: string;
    password?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token") || userState.token;
    let res: Response;

    try {
      res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
    } catch {
      setError("NETWORK_ERROR");
      setIsLoading(false);
      return { ok: false, error: "NETWORK_ERROR" };
    }

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur de mise à jour");
      setIsLoading(false);
      return { ok: false, error: data.error };
    }

    // 🌟 SÉCURITÉ EMAIL : On verrouille l'email actuel pour ne pas le perdre
    const currentEmail = userState.email || data.email;

    // 🌟 SYNCHRONISATION PAYLOAD : On envoie "theme" pour satisfaire le PayloadAction de ton slice
    dispatch(
      setAuth({
        token: token || "",
        pseudo: data.pseudo ?? userState.pseudo,
        email: currentEmail,
        money: data.money ?? userState.money,
        theme:
          typeof data.darkMode === "boolean"
            ? data.darkMode
            : userState.isDarkMode,
      }),
    );

    setIsLoading(false);
    return { ok: true };
  };

  return { profile, isLoading, error, updateProfile };
};
