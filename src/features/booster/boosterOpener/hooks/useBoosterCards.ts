import { useCallback, useRef, useState } from "react";
import {
  OpenBoosterResponseSchema,
  UserBoosterArraySchema,
  UserBoosters,
} from "../schema/booster.schema";
import { Card, CardSchema } from "@/features/card/schema/card.schema";
import { env } from "@/config/env";
import {useSelector} from "react-redux";
import { RootState } from "@/store/store";

async function fetchUserBoosters(token: string): Promise<UserBoosters> {

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me/boosters`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
      , "Authorization": `Bearer ${token}`,
    },

  });

  if (!response.ok)
    throw new Error(
      `Echec de la récupération des boosters (HTTP ${response.status})`
    );

  const rawData: unknown = await response.json();
  return UserBoosterArraySchema.parse(rawData);
}

async function fetchOpenBooster(boosterId: string, token: string): Promise<Card[]> {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/users/me/boosters/${boosterId}/open`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, },

    }
  );

  if (!response.ok)
    throw new Error(
      `Echec de l'ouverture du booster (HTTP ${response.status})`
    );

  const rawData: unknown = await response.json();
  const parsedResponse = OpenBoosterResponseSchema.parse(rawData);
  return parsedResponse.cards;
}

export interface UseBoosterCardsResult {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  /** Declenche l'ouverture du booster. Retourne les cartes ou null si echec. */
  openBooster: () => Promise<Card[] | null>;
  /** Vide le state (a appeler quand on remet le booster a zero). */
  reset: () => void;
}

export function useBoosterCards(): UseBoosterCardsResult {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const { token } = useSelector((state: RootState) => state.user)


  const openBooster = useCallback(async (): Promise<Card[] | null> => {
    if (isFetchingRef.current) return null;
    if (!token) return null

    
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const userBoosters = await fetchUserBoosters(token);
      if (userBoosters.length === 0)
        throw new Error("Aucun booster disponible");

      const firstBoosterId = userBoosters[0].booster.id;
      const fetchedCards = await fetchOpenBooster(firstBoosterId, token);

      setCards(fetchedCards);
      return fetchedCards;
    } catch (caughtError) {
      console.error("[BoosterOpener] fetch error:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Erreur inconnue lors de l'ouverture du booster"
      );
      return null;
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const reset = useCallback((): void => {
    setCards([]);
    setError(null);
  }, []);

  return { cards, isLoading, error, openBooster, reset };
}

export { CardSchema };