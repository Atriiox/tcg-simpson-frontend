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
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
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
    setEditingDeckId(null);
    setSelectedCardIds([]);
    setDeckName("");
  };

  const startEditDeck = (deck: DeckData) => {
    setIsCreating(true);
    setEditingDeckId(deck._id || (deck as any).id);
    setDeckName(deck.name);
    setSelectedCardIds(deck.cards.map((c: any) => c._id || c.id || c));
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

  // 💾 POST/PUT : Sauvegarder le deck en BDD
  const handleSaveDeck = async (nameToSave: string) => {
    if (cardCount !== MAX_CARDS || !token) return;

    const url = editingDeckId
      ? `${process.env.NEXT_PUBLIC_API_URL}/users/me/decks/${editingDeckId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/users/me/decks`;

    const method = editingDeckId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: nameToSave,
        cards: selectedCardIds,
      }),
    });

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
    setEditingDeckId(null);
    // Recharger la liste locale des decks immédiatement après l'ajout
    fetchDecks();
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/decks/${deckId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchDecks();
    } catch (e) {
      console.error("Erreur suppression deck", e);
    }
  };

  const handleSetActiveDeck = async (deckId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/decks/${deckId}/active`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchDecks();
    } catch (e) {
      console.error("Erreur activation deck", e);
    }
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
    editingDeckId,
    startNewDeck,
    startEditDeck,
    toggleCardSelection,
    handleSaveDeck,
    handleDeleteDeck,
    handleSetActiveDeck,
    cancelCreation: () => {
      setIsCreating(false);
      setEditingDeckId(null);
    },
    decks,
    isLoadingDecks,
    deckError,
    refetchDecks: fetchDecks,
  };
}
