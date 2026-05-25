import { useCallback, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import {
  BoosterPack3D,
  type BoosterPack3DHandle,
} from "@/features/booster/boosterPack3D";
import { useBoosterCards } from "../hooks/useBoosterCards";
import { CardGrid } from "./CardGrid";
import type { Card } from "@/features/card/schema/card.schema";
import Button from "@/components/ui/Button";

export interface BoosterOpenerProps {
  imageUrl?: string;
  cardSize?: number;
  onCardClick?: (card: Card) => void;
  onClose?: () => void;
}

export function BoosterOpener({
  imageUrl = "/booster.png",
  cardSize = 150,
  onCardClick,
  onClose,
}: BoosterOpenerProps): React.JSX.Element {
  const boosterRef = useRef<BoosterPack3DHandle>(null);
  const { cards, isLoading, error, hasMoreBoosters, openBooster, reset } = useBoosterCards();

  const handleBoosterOpen = useCallback(async (): Promise<void> => {
    const fetchedCards = await openBooster();
    if (!fetchedCards) boosterRef.current?.reset();
  }, [openBooster]);

  const handleReset = useCallback((): void => {
    reset();
    boosterRef.current?.reset();
  }, [reset]);

  const hasCards = cards.length > 0;

  return (
    <div className="bg-simpson-white dark:bg-simpson-dark rounded-2xl shadow-2xl w-[90vw] max-w-2xl flex flex-col font-main">

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-simpson-gray/10">
        <h2 className="text-subtitle font-bold text-simpson-dark dark:text-simpson-white">
          🎁 Nouveau booster !
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-simpson-gray hover:text-simpson-orange transition cursor-pointer"
          >
            <FaTimes size={18} />
          </button>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col items-center gap-4 px-6 py-6">
        {!hasCards && (
          <>
            <p className="text-body text-simpson-gray text-center">
              Tire le booster pour révéler tes cartes !
            </p>
        <div className="w-full flex justify-center overflow-hidden" style={{ height: "350px" }}>
  <div className="scale-50 origin-top">
    <BoosterPack3D
      ref={boosterRef}
      imageUrl={imageUrl}
      onOpen={handleBoosterOpen}
    />
  </div>
</div>


            {isLoading && (
              <p className="text-body text-simpson-orange font-semibold animate-pulse">
                Récupération des cartes...
              </p>
            )}
            {error && (
              <div role="alert" className="text-body text-simpson-orange bg-simpson-orange/10 px-4 py-2 rounded-lg text-center">
                {error}
              </div>
            )}
          </>
        )}

        {hasCards && (
          <>
            <p className="text-medium text-simpson-orange font-semibold uppercase tracking-widest">
              ✨ Tes cartes
            </p>
            <CardGrid
              cards={cards}
              cardSize={cardSize}
              onCardClick={onCardClick}
            />
            <div className="flex gap-3 mt-2">
              {hasMoreBoosters && (
                <Button onClick={handleReset}>
                  Ouvrir un autre booster
                </Button>
              )}
              {onClose && (
                <Button onClick={onClose}>
                  Fermer
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BoosterOpener;