"use client";

import { useState, useMemo } from "react"; // 🌟 Ajout de useMemo
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/reducers/user";
import { env } from "@/config/env";
import { RootState } from "@/store/store";
import { useCollection } from "../../collection/hooks/useCollection";
import { useAllCards } from "../../collection/hooks/useAllCards";

export const useProfile = () => {
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user);

  const { collection, isLoading: loadingColl } = useCollection();
  const { cards: allSystemCards, isLoading: loadingCards } = useAllCards();

  // 🎯 CALCUL DES STATS ET DU PROFIL CACHÉ (MEMOIZÉ)
  // L'objet ne sera recréé QUE si l'une de ces dépendances change réellement.
  const profile = useMemo(() => {
    const totalCards = collection.length;
    const uniqueCardIds = Array.from(new Set(collection.map((c) => c.id)));
    const uniqueCardsCount = uniqueCardIds.length;

    const getStatsByRarity = (rarityId: string) => {
      const totalInSystem = allSystemCards.filter(
        (c) => c.rarity === rarityId,
      ).length;

      const ownedUnique = allSystemCards.filter(
        (c) => c.rarity === rarityId && uniqueCardIds.includes(c.id),
      ).length;

      return { owned: ownedUnique, total: totalInSystem };
    };

    const legendaryStats = getStatsByRarity("3");
    const rareStats = getStatsByRarity("2");
    const commonStats = getStatsByRarity("1");

    return {
      pseudo: userState.pseudo,
      email: userState.email,
      money: userState.money,
      avatar: userState.avatar,
      isDarkMode: userState.isDarkMode,
      stats: {
        legendary: legendaryStats.owned,
        legendaryTotal: legendaryStats.total || 4,
        rare: rareStats.owned,
        rareTotal: rareStats.total || 12,
        common: commonStats.owned,
        commonTotal: commonStats.total || 24,
        uniqueCards: uniqueCardsCount,
        totalCards: totalCards,
      },
    };
  }, [userState, collection, allSystemCards]); // 🌟 Dépendances strictes

  const updateProfile = async (updates: {
    pseudo?: string;
    password?: string;
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

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur de mise à jour");
      setIsLoadingUpdate(false);
      return { ok: false, error: data.error };
    }

    const currentEmail = userState.email || data.email;

    dispatch(
      setAuth({
        token: token || "",
        pseudo: data.pseudo ?? userState.pseudo,
        email: currentEmail,
        money: data.money ?? userState.money,
        avatar: data.avatar ?? userState.avatar,
        theme:
          typeof data.darkMode === "boolean"
            ? data.darkMode
            : userState.isDarkMode,
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
