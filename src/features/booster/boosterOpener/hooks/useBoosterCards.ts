"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  OpenBoosterResponseSchema,
  UserBoosterArraySchema,
  UserBoosters,
} from "../schema/booster.schema";
import { Card, CardSchema } from "@/features/card/schema/card.schema";
import { env } from "@/config/env";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

async function fetchUserBoosters(token: string): Promise<UserBoosters> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me/boosters`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok)
    throw new Error(
      `Échec de la récupération des boosters (HTTP ${response.status})`,
    );

  const rawData: unknown = await response.json();
  return UserBoosterArraySchema.parse(rawData);
}

async function fetchOpenBooster(
  boosterId: string,
  token: string,
): Promise<Card[]> {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/users/me/boosters/${boosterId}/open`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok)
    throw new Error(
      `Échec de l'ouverture du booster (HTTP ${response.status})`,
    );

  const rawData: unknown = await response.json();
  const parsedResponse = OpenBoosterResponseSchema.parse(rawData);
  return parsedResponse.cards;
}

export interface UseBoosterCardsResult {
  cards: (Card & { isNew?: boolean })[];
  isLoading: boolean;
  error: string | null;
  hasMoreBoosters: boolean;
  boosterDetails: { name: string; slug: string } | null;
  openBooster: (
    specificBoosterId?: string,
  ) => Promise<(Card & { isNew?: boolean })[] | null>;
  reset: () => void;
}

export function useBoosterCards(boosterId?: string): UseBoosterCardsResult {
  const [cards, setCards] = useState<(Card & { isNew?: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreBoosters, setHasMoreBoosters] = useState(true);
  const [boosterDetails, setBoosterDetails] = useState<{
    name: string;
    slug: string;
  } | null>(null);

  const isFetchingRef = useRef(false);
  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function getBoosterDetails() {
      if (!boosterId || !token) return;
      try {
        const userBoosters = await fetchUserBoosters(token);
        const current = userBoosters.find((b) => b.booster.id === boosterId);

        if (current && current.booster) {
          setBoosterDetails({
            name: current.booster.name,
            slug: current.booster.slug,
          });
        }
      } catch (err) {
        console.error(
          "[useBoosterCards] Impossible de charger les détails du booster:",
          err,
        );
      }
    }
    getBoosterDetails();
  }, [boosterId, token]);

  const openBooster = useCallback(
    async (
      specificBoosterId?: string,
    ): Promise<(Card & { isNew?: boolean })[] | null> => {
      if (isFetchingRef.current) return null;
      if (!token) return null;

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const userBoosters = await fetchUserBoosters(token);

        if (userBoosters.length === 0) {
          setHasMoreBoosters(false);
          throw new Error("Aucun booster disponible");
        }

        const targetBooster = specificBoosterId
          ? userBoosters.find((b) => b.booster.id === specificBoosterId)
          : userBoosters[0];

        if (!targetBooster || targetBooster.number <= 0) {
          setHasMoreBoosters(false);
          throw new Error("Le booster sélectionné n'est plus disponible");
        }

        // RÉCUPÉRATION COLLECTION ACTUELLE
        const collectionResponse = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/users/me/collection`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        let ownedCardKeys = new Set<string>();
        if (collectionResponse.ok) {
          const currentCollection =
            (await collectionResponse.json()) as Card[];
          ownedCardKeys = new Set(currentCollection.map((c) => c.slug || c.id));
        }

        // Récupération des cartes du booster ouvert
        const fetchedCards = await fetchOpenBooster(
          targetBooster.booster.id,
          token,
        );

        // COMPARAISON ET INJECTION DU BADGE IS_NEW
        const mappedCards = fetchedCards.map((card) => ({
          ...card,
          isNew: !ownedCardKeys.has(card.slug || card.id),
        }));

        const currentBoosterRemaining = targetBooster.number - 1;
        setHasMoreBoosters(currentBoosterRemaining > 0);

        setCards(mappedCards);
        return mappedCards;
      } catch (caughtError) {
        console.error("[BoosterOpener] fetch error:", caughtError);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Erreur inconnue lors de l'ouverture du booster",
        );
        return null;
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [token],
  );

  const reset = useCallback((): void => {
    setCards([]);
    setError(null);
  }, []);

  return {
    cards,
    isLoading,
    error,
    hasMoreBoosters,
    boosterDetails,
    openBooster,
    reset,
  };
}

export { CardSchema };
