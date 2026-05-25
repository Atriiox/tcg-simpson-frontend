"use client";

import { useState } from "react";
import { CollectionCard } from "./useCollection";

export function useDeckBuilder() {
  const [isCreating, setIsCreating] = useState(false);
  const [deckName, setDeckName] = useState("Mon Super Deck");
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  const MAX_CARDS = 10;
  const cardCount = selectedCardIds.length;
  const isValid = cardCount === MAX_CARDS;

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

  const handleSaveDeck = async () => {
    if (!isValid) return;

    try {
      console.log("Sauvegarde du deck en BDD :", {
        name: deckName,
        cards: selectedCardIds,
      });
      // C'est ici que se fera ton fetch(POST /me/decks) plus tard
      setIsCreating(false);
    } catch (err) {
      console.error("Erreur sauvegarde deck :", err);
    }
  };

  return {
    isCreating,
    deckName,
    setDeckName,
    selectedCardIds,
    cardCount,
    maxCards: MAX_CARDS,
    isValid,
    startNewDeck,
    toggleCardSelection,
    handleSaveDeck,
    cancelCreation: () => setIsCreating(false),
  };
}
