/**
 * BoosterOpener
 * ============================================================
 * Composant qui orchestre :
 *  - BoosterPack3D (le booster 3D interactif)
 *  - useBoosterCards (le fetch des cartes au moment de l'ouverture)
 *  - CardGrid (l'affichage des cartes revelees)
 *
 * Flux :
 *  1. Affichage initial : le BoosterPack3D, l'utilisateur peut le tirer
 *  2. Au seuil de dechirure (90 %), BoosterPack3D appelle onOpen
 *  3. On lance le fetch des cartes
 *  4. Quand les cartes arrivent, on cache le booster et on affiche la grille
 *  5. Un bouton "Ouvrir un autre booster" remet le tout a zero
 * ============================================================
 */
import { useCallback, useRef } from "react";
import {
  BoosterPack3D,
  type BoosterPack3DHandle,
} from "@/features/booster/boosterPack3D"; // TODO : adapte le chemin si different

import { useBoosterCards } from "../hooks/useBoosterCards";
import { CardGrid } from "./CardGrid";
import type { Card } from "@/features/card/schema/card.schema";


export interface BoosterOpenerProps {
  /** URL de l'image du booster. Defaut : /booster.png */
  imageUrl?: string;
  /** Taille des cartes affichees (prop `size` de ton composant Card). */
  cardSize?: number;
  /** Callback optionnel quand une carte est cliquee dans la grille. */
  onCardClick?: (card: Card) => void;
}

export function BoosterOpener({
  imageUrl = "/booster.png",
  cardSize = 200,
  onCardClick,
}: BoosterOpenerProps): React.JSX.Element {
  const boosterRef = useRef<BoosterPack3DHandle>(null);
  const { cards, isLoading, error, openBooster, reset } = useBoosterCards();

  // Etape 2 du flux : declenche le fetch quand le booster atteint le seuil.
  const handleBoosterOpen = useCallback(async (): Promise<void> => {
    const fetchedCards = await openBooster();
    if (!fetchedCards) {
      // Echec du fetch : on remet le booster en etat ferme pour que
      // l'utilisateur puisse retenter.
      boosterRef.current?.reset();
    }
    // Si succes : `cards` est mis a jour par le hook, et le rendu
    // bascule automatiquement sur la grille (voir condition plus bas).
  }, [openBooster]);

  // Etape 5 du flux : reset complet (cartes + booster).
  const handleReset = useCallback((): void => {
    reset();
    boosterRef.current?.reset();
  }, [reset]);

  const hasCards = cards.length > 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-8 p-10 bg-[radial-gradient(ellipse_at_top,#1e3a8a_0%,#0f172a_60%,#020617_100%)]">
      {/* Tant qu'on n'a pas les cartes, on montre le booster 3D */}
      {!hasCards && (
        <>
          <BoosterPack3D
            ref={boosterRef}
            imageUrl={imageUrl}
            onOpen={handleBoosterOpen}
          />

          {/* Etat de chargement (pendant le fetch) */}
          {isLoading && (
            <p className="text-amber-200 text-base font-semibold tracking-widest">
              Recuperation des cartes...
            </p>
          )}

          {/* Affichage des erreurs de fetch */}
          {error && (
            <div
              role="alert"
              className="text-rose-100 bg-rose-900/90 px-5 py-3 rounded-lg text-sm max-w-md text-center"
            >
              {error}
            </div>
          )}
        </>
      )}

      {/* Des qu'on a les cartes, on remplace le booster par la grille */}
      {hasCards && (
        <div className="flex flex-col items-center gap-6 w-full">
          <h2 className="text-amber-200 text-3xl m-0 [text-shadow:0_0_20px_#f59e0b]">
            Tes cartes
          </h2>

          <CardGrid
            cards={cards}
            cardSize={cardSize}
            onCardClick={onCardClick}
          />

          <button
            onClick={handleReset}
            className="mt-6 px-7 py-3 text-white border-none rounded-full text-base font-bold tracking-widest cursor-pointer bg-gradient-to-br from-amber-500 to-red-600 shadow-[0_6px_20px_rgba(245,158,11,0.5)] hover:brightness-110 transition"
          >
            Ouvrir un autre booster
          </button>
        </div>
      )}
    </div>
  );
}

export default BoosterOpener;
