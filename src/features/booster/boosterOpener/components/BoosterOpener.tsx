"use client";

import { useCallback, useRef, useState, useEffect } from "react";
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
  boosterId?: string;
  boosterName?: string;
  imageUrl?: string;
  onCardClick?: (card: Card) => void;
  onClose?: () => void;
  onBoosterOpenedSuccess?: () => void; // 🌟 AJOUT : Callback de succès
}

export default function BoosterOpener({
  boosterId,
  boosterName: initialBoosterName,
  imageUrl,
  onCardClick,
  onClose,
  onBoosterOpenedSuccess, // 🌟 Récupération
}: BoosterOpenerProps): React.JSX.Element {
  const boosterRef = useRef<BoosterPack3DHandle>(null);

  const {
    cards,
    isLoading,
    error,
    hasMoreBoosters,
    boosterDetails,
    openBooster,
    reset,
  } = useBoosterCards(boosterId);

  const displayBoosterName =
    initialBoosterName || boosterDetails?.name || "Nouveau booster !";

  const [currentImageUrl, setCurrentImageUrl] =
    useState<string>("/booster1.webp");

  useEffect(() => {
    const rawSlug = imageUrl || boosterDetails?.slug;
    if (rawSlug) {
      setCurrentImageUrl(rawSlug.startsWith("/") ? rawSlug : `/${rawSlug}`);
    }
  }, [imageUrl, boosterDetails?.slug]);

  const [dynamicCardSize, setDynamicCardSize] = useState<number>(100);

  useEffect(() => {
    function handleResize() {
      window.innerWidth >= 640 ? setDynamicCardSize(130) : setDynamicCardSize(95);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBoosterOpen = useCallback(async (): Promise<void> => {
    const fetchedCards = await openBooster(boosterId);
    if (!fetchedCards) {
      boosterRef.current?.reset();
    } else {
      // 🌟 SUCCÈS : On notifie immédiatement le parent pour mettre à jour les comptes
      if (onBoosterOpenedSuccess) {
        onBoosterOpenedSuccess();
      }
    }
  }, [openBooster, boosterId, onBoosterOpenedSuccess]);

  const handleReset = useCallback((): void => {
    reset();
    boosterRef.current?.reset();
  }, [reset]);

  const hasCards = cards.length > 0;

  return (
    <div className="bg-simpson-white dark:bg-simpson-dark rounded-2xl shadow-2xl w-[95vw] sm:w-fit sm:min-w-[80vw] h-[85vh] sm:h-fit sm:min-h-[81vh] flex flex-col font-main overflow-hidden">
      {/* UI Restante inchangée... */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-simpson-gray/10 shrink-0">
        <h2 className="text-subtitle font-bold text-simpson-dark dark:text-simpson-white flex items-center gap-2 truncate">
          Ouverture du {displayBoosterName}
        </h2>
        {onClose && (
          <button onClick={onClose} className="text-simpson-gray hover:text-simpson-orange transition cursor-pointer shrink-0">
            <FaTimes size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center p-6 sm:py-10 gap-4">
        {!hasCards && (
          <div className="w-full flex flex-col items-center justify-center my-auto">
            <div className="w-full max-w-70 sm:max-w-85 aspect-3/4 flex justify-center items-center relative">
              <BoosterPack3D ref={boosterRef} imageUrl={currentImageUrl} containerWidth="100%" containerHeight="100%" onOpen={handleBoosterOpen} />
            </div>
            {isLoading && <p className="text-body text-simpson-orange font-semibold animate-pulse mt-4">Récupération des cartes...</p>}
            {error && <div role="alert" className="text-body text-simpson-orange bg-simpson-orange/10 px-4 py-2 rounded-lg text-center mt-4 text-xs">{error}</div>}
          </div>
        )}

        {hasCards && (
          <div className="w-full flex flex-col items-center gap-4 my-auto">
            <p className="text-medium text-simpson-orange font-semibold tracking-widest uppercase text-xs sm:text-sm">{cards.length} nouvelles cartes !</p>
            <CardGrid cards={cards} cardSize={dynamicCardSize} onCardClick={onCardClick} />
          </div>
        )}
      </div>

      {hasCards && (
        <div className="flex gap-3 justify-center items-center px-6 py-4 border-t border-simpson-gray/10 dark:border-white/5 shrink-0 bg-gray-50/50 dark:bg-black/10">
          {hasMoreBoosters && <Button className="text-xs py-2 px-4" onClick={handleReset}>Ouvrir un autre</Button>}
          {onClose && <Button className="bg-simpson-gray! text-xs py-2 px-4" onClick={onClose}>Fermer</Button>}
        </div>
      )}
    </div>
  );
}