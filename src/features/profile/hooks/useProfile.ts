"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/reducers/user";
import { env } from "@/config/env";

// On suppose que ton slice Redux ressemble à ça
interface RootState {
  user: {
    pseudo: string | null;
    money: number;
    token: string | null;
    theme: boolean;
    email?: string; // Si ton back le renvoie à la connexion
  };
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.user);

  const updateProfile = async (updates: {
    pseudo?: string;
    password?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token") || profile.token;
    let res: Response;
    console.log(
      "URL finale appelée :",
      `${env.NEXT_PUBLIC_API_URL}/users/me/profile`,
    );
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

    dispatch(
      setAuth({
        token: token || "",
        pseudo: data.pseudo,
        email: data.email,
        money: data.money,
        theme:
          typeof data.darkMode === "boolean" ? data.darkMode : profile.theme,
      }),
    );

    setIsLoading(false);
    return { ok: true };
  };

  return { profile, isLoading, error, updateProfile };
};
