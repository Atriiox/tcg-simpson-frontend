"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/reducers/user";
import { env } from "@/config/env";
import { RootState } from "@/store/store";
import { AvatarSchema, UpdateProfileResponseSchema } from "../schemas/profile.schemas";

export function useAvatar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);

  const updateAvatar = async (avatarPath: string) => {
    const parsed = AvatarSchema.safeParse({ avatar: avatarPath });
    if (!parsed.success) {
      setError("Avatar invalide");
      return { ok: false, error: "INVALID_AVATAR" };
    }

    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token") || userState.token;

    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarPath }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Erreur lors de la mise à jour");
        return { ok: false, error: json.error };
      }

      const parsedResponse = UpdateProfileResponseSchema.safeParse(json);
      if (!parsedResponse.success) {
        setError("INVALID_RESPONSE");
        return { ok: false, error: "INVALID_RESPONSE" };
      }

      dispatch(
        setAuth({
          token: token || "",
          pseudo: userState.pseudo,
          email: userState.email,
          money: userState.money,
          avatar: parsedResponse.data.avatar ?? avatarPath,
          theme: userState.isDarkMode,
          countdownEnds: userState.countdownEnds,
        }),
      );

      return { ok: true };
    } catch {
      setError("NETWORK_ERROR");
      return { ok: false, error: "NETWORK_ERROR" };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateAvatar, isLoading, error };
}
