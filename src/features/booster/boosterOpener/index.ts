/**
 * Point d'entree du module BoosterOpener.
 *
 * Usage :
 *   import { BoosterOpener } from "@/features/BoosterOpener";
 *   <BoosterOpener imageUrl="/booster.png" />
 */
export { BoosterOpener, default } from "./components/BoosterOpener";
export type { BoosterOpenerProps } from "./components/BoosterOpener";

// Composants internes exposes au cas ou tu veuilles composer differemment
export { CardGrid } from "./components/CardGrid";
export type { CardGridProps } from "./components/CardGrid";

// Hook expose au cas ou tu veuilles l'utiliser hors du contexte BoosterOpener
export {
  useBoosterCards,
  type UseBoosterCardsResult,
} from "./hooks/useBoosterCards";

// Types et schemas Zod exposes pour le typage cote consommateur
export {
  CardDataSchema,
  CardTypeSchema,
  CardSerieSchema,
  OpenBoosterResponseSchema,
  type CardData,
  type CardType,
  type CardSerie,
  type OpenBoosterResponse,
} from "./schema/booster.schema";
