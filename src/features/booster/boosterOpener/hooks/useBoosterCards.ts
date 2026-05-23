/**
 * Gere le fetch des cartes d'un booster.
 *
 * TODO : remplace l'implementation de `fetchBoosterCards` par ton vrai
 * endpoint. Le reste du hook (state, validation Zod, gestion d'erreur)
 * n'a pas besoin de bouger.
 */
import { useCallback, useRef, useState } from "react";
import {
  CardDataSchema,
  OpenBoosterResponseSchema,
  type CardData,
} from "../schema/card.schema";

/**
 * Appel API d'ouverture de booster.
 *
 * !!! TODO !!! adapte cette fonction a ton backend :
 * - methode HTTP (POST si l'ouverture "consomme" un booster en base)
 * - URL de l'endpoint
 * - body (si tu dois envoyer l'ID du booster, le user, etc.)
 * - headers (Authorization si tu as un token JWT, etc.)
 *
 * Le schema OpenBoosterResponseSchema valide la reponse au runtime,
 * donc si le backend renvoie un format inattendu, tu auras une erreur
 * lisible plutot qu'un crash plus loin dans le rendu.
 */
async function fetchBoosterCards(): Promise<CardData[]> {
  const response = await fetch("/api/booster/open", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ boosterId: ... }) // a adapter
  });

  if (!response.ok) {
    throw new Error(
      `Echec de l'ouverture du booster (HTTP ${response.status})`
    );
  }

  const rawData: unknown = await response.json();
  const parsedResponse = OpenBoosterResponseSchema.parse(rawData);
  return parsedResponse.cards;
}

export interface UseBoosterCardsResult {
  cards: CardData[];
  isLoading: boolean;
  error: string | null;
  /** Declenche l'ouverture du booster. Retourne les cartes ou null si echec. */
  openBooster: () => Promise<CardData[] | null>;
  /** Vide le state (a appeler quand on remet le booster a zero). */
  reset: () => void;
}

/**
 * Hook qui encapsule le fetch + le state (cards, loading, error).
 * Le composant parent appelle `openBooster()` quand BoosterPack3D
 * emet son callback `onOpen`, puis lit `cards` pour afficher la grille.
 */
export function useBoosterCards(): UseBoosterCardsResult {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const openBooster = useCallback(
    async (): Promise<CardData[] | null> => {
      // Garde-fou : si un fetch est deja en cours, on n'en lance pas un second.
      if (isFetchingRef.current) return null;
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const fetchedCards = await fetchBoosterCards();
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
    },
    []
  );

  const reset = useCallback((): void => {
    setCards([]);
    setError(null);
  }, []);

  return { cards, isLoading, error, openBooster, reset };
}

// Re-export pour permettre au consommateur de valider lui-meme une carte
// (par exemple s'il prefere appeler son propre fetch ailleurs).
export { CardDataSchema };
