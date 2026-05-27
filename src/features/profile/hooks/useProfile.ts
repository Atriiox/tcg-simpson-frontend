"use client";

import { useState } from "react";
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

  // 🌟 Récupération brute des données (sans aucun filtre appliqué)
  const { collection, isLoading: loadingColl } = useCollection();
  const { cards: allSystemCards, isLoading: loadingCards } = useAllCards();

  // 🎯 CALCUL DYNAMIQUE DES STATS TCG
  const totalCards = collection.length; // Nombre total de cartes (avec doublons)

  // Tableau des IDs uniques possédés
  const uniqueCardIds = Array.from(new Set(collection.map((c) => c.id)));
  const uniqueCardsCount = uniqueCardIds.length;

  // Calcul par rareté
  // Attention au mapping : ton back-end renvoie des IDs de rareté string ("1", "2", "3")
  const getStatsByRarity = (rarityId: string) => {
    const totalInSystem = allSystemCards.filter(
      (c) => c.rarity === rarityId,
    ).length;

    // Nombre de cartes uniques de cette rareté possédées par le joueur
    const ownedUnique = allSystemCards.filter(
      (c) => c.rarity === rarityId && uniqueCardIds.includes(c.id),
    ).length;

    return { owned: ownedUnique, total: totalInSystem };
  };

  const legendaryStats = getStatsByRarity("3"); // Légendaire = "3"
  const rareStats = getStatsByRarity("2"); // Rare = "2"
  const commonStats = getStatsByRarity("1"); // Normal/Commune = "1"

  const profile = {
    pseudo: userState.pseudo,
    email: userState.email,
    money: userState.money,
    isDarkMode: userState.isDarkMode,
    stats: {
      legendary: legendaryStats.owned,
      legendaryTotal: legendaryStats.total || 4, // Fallback si le fetch n'est pas fini
      rare: rareStats.owned,
      rareTotal: rareStats.total || 12,
      common: commonStats.owned,
      commonTotal: commonStats.total || 24,
      uniqueCards: uniqueCardsCount,
      totalCards: totalCards,
    },
  };

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
        theme:
          typeof data.darkMode === "boolean"
            ? data.darkMode
            : userState.isDarkMode,
      }),
    );

    setIsLoadingUpdate(false);
    return { ok: true };
  };

  return {
    profile,
    isLoading: isLoadingUpdate || loadingColl || loadingCards, // Agrégation des états de chargement
    error,
    updateProfile,
  };
};
