"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export type DeckData = {
  _id: string;
  name: string;
  cards: string[] | any[]; // Contient les IDs ou les objets cartes populés du back
  isActive: boolean;
};

export function useDeckBuilder() {
  const [isCreating, setIsCreating] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // États pour la liste des decks existants
  const [decks, setDecks] = useState<DeckData[]>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(false);
  const [deckError, setDeckError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.user.token);

  const MAX_CARDS = 10;
  const MAX_DECKS = 3;
  const cardCount = selectedCardIds.length;
  const isValid = cardCount === MAX_CARDS && deckName.trim() !== "";

  // 🔄 GET : Récupérer les decks existants
  const fetchDecks = useCallback(async () => {
    if (!token) return;
    setIsLoadingDecks(true);
    setDeckError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/decks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur récupération decks");
      }

      const data = await response.json();
      setDecks(data);
    } catch (err: any) {
      setDeckError(err.message);
    } finally {
      setIsLoadingDecks(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const startNewDeck = () => {
   setIsCreating(true);
    setSelectedCardIds([]);
    setDeckName("");
  };

  const toggleCardSelection = (cardId: string) => {
    if (!isCreating) return;

    setSelectedCardIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= MAX_CARDS) {
        return prev;
      }
      return [...prev, cardId];
    });
  };

  // 💾 POST : Sauvegarder le deck en BDD
  const handleSaveDeck = async (nameToSave: string) => {
    if (cardCount !== MAX_CARDS || !token) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me/decks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nameToSave,
          cards: selectedCardIds,
        }),
      },
    );

    // Sécurité au cas où le serveur renvoie du HTML (Erreur 404/500)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("SERVER_ERROR");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Une erreur est survenue");
    }

    setIsCreating(false);
    // Recharger la liste locale des decks immédiatement après l'ajout
    fetchDecks();
  };

  return {
    isCreating,
    setIsCreating,
    deckName,
    setDeckName,
    selectedCardIds,
    cardCount,
    maxCards: MAX_CARDS,
    maxDecks: MAX_DECKS,
    isValid,
    startNewDeck,
    toggleCardSelection,
    handleSaveDeck,
    cancelCreation: () => setIsCreating(false),
    decks,
    isLoadingDecks,
    deckError,
    refetchDecks: fetchDecks,
  };
}
