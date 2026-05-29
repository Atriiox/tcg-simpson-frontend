"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/reducers/user";
import { env } from "@/config/env";
import { RootState } from "@/store/store";
import { useCollection } from "@/features/collection/hooks/useCollection";
import { useAllCards } from "@/features/collection/hooks/useAllCards";
import { UpdateProfileResponseSchema } from "../schemas/profile.schemas";

export const useProfile = () => {
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user);

  const { collection, isLoading: loadingColl } = useCollection();
  const { cards: allSystemCards, isLoading: loadingCards } = useAllCards();

  const profile = useMemo(() => {
    const totalCards = collection.length;
    const uniqueCardIds = Array.from(new Set(collection.map((c) => c.id)));
    const uniqueCardsCount = uniqueCardIds.length;

    const serieNames = [...new Set(allSystemCards.map((c) => c.serie.id_serie.name))];

    const getStatsBySerie = (serieName: string) => {
      const serieCards = allSystemCards.filter(
        (c) => c.serie.id_serie.name === serieName
      );

      const getByRarity = (rarityId: string) => ({
        owned: serieCards.filter(
          (c) => c.rarity === rarityId && uniqueCardIds.includes(c.id)
        ).length,
        total: serieCards.filter((c) => c.rarity === rarityId).length,
      });

      return {
        name: serieName,
        legendary: getByRarity("3"),
        rare: getByRarity("2"),
        common: getByRarity("1"),
        uniqueCards: serieCards.filter((c) => uniqueCardIds.includes(c.id)).length,
        totalInSerie: serieCards.length,
      };
    };

    return {
      pseudo: userState.pseudo,
      email: userState.email,
      money: userState.money,
      avatar: userState.avatar,
      isDarkMode: userState.isDarkMode,
      stats: {
        bySerie: serieNames.map(getStatsBySerie),
        uniqueCards: uniqueCardsCount,
        totalCards: totalCards,
      },
    };
  }, [userState, collection, allSystemCards]);

  const updateProfile = async (updates: {
    pseudo?: string;
    password?: string;
    avatar?: string;
  }) => {
    setIsLoadingUpdate(true);
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
      setIsLoadingUpdate(false);
      return { ok: false, error: "NETWORK_ERROR" };
    }

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Erreur de mise à jour");
      setIsLoadingUpdate(false);
      return { ok: false, error: json.error };
    }

    const parsed = UpdateProfileResponseSchema.safeParse(json);
    if (!parsed.success) {
      setError("INVALID_RESPONSE");
      setIsLoadingUpdate(false);
      return { ok: false, error: "INVALID_RESPONSE" };
    }

    const data = parsed.data;
    const currentEmail = userState.email || data.email;

    dispatch(
      setAuth({
        token: token || "",
        pseudo: data.pseudo ?? userState.pseudo,
        email: currentEmail ?? null,
        money: data.money ?? userState.money,
        avatar: data.avatar ?? userState.avatar,
        theme: typeof data.darkMode === "boolean" ? data.darkMode : userState.isDarkMode,
        countdownEnds: data.countdownEnds ?? userState.countdownEnds,
      }),
    );

    setIsLoadingUpdate(false);
    return { ok: true };
  };

  return {
    profile,
    isLoading: isLoadingUpdate || loadingColl || loadingCards,
    error,
    updateProfile,
  };
};