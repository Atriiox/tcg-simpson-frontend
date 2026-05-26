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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { env } from "@/config/env";
import { UserBoosterArraySchema } from "../schema/booster.schema";

export interface BoosterOpenerProps {
  boosterId?: string;
  boosterName?: string; // 🌟 AJOUT : Nom du booster passé par le parent
  imageUrl?: string;
  onCardClick?: (card: Card) => void;
  onClose?: () => void;
}

export default function BoosterOpener({
  boosterId,
  boosterName: initialBoosterName, // 🌟 Alias pour clarté
  imageUrl,
  onCardClick,
  onClose,
}: BoosterOpenerProps): React.JSX.Element {
  const boosterRef = useRef<BoosterPack3DHandle>(null);
  
  // 🌟 INITIALISATION SYNCHRONE : Évite le flash textuel du nom par défaut
  const [boosterName, setBoosterName] = useState<string>(
    initialBoosterName || "Nouveau booster !"
  );
  
  // 🌟 INITIALISATION SYNCHRONE : Évite le flash visuel de l'image par défaut
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(() => {
    if (imageUrl) {
      return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    }
    return "/booster1.webp";
  });

  // État pour gérer la taille de la carte dynamiquement
  const [dynamicCardSize, setDynamicCardSize] = useState<number>(100);

  const { token } = useSelector((state: RootState) => state.user);
  const { cards, isLoading, error, hasMoreBoosters, openBooster, reset } =
    useBoosterCards();

  // Écouteur pour adapter la taille des cartes selon l'écran (Responsive)
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 640) {
        setDynamicCardSize(130);
      } else {
        setDynamicCardSize(95);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Récupération du nom ET du slug du booster via l'API (Fallback de sécurité si manquants)
  useEffect(() => {
    async function getBoosterDetails() {
      if (!boosterId || !token) return;
      
      // 🌟 PERFORMANCE : Si le parent a déjà tout fourni, on esquive le fetch API
      if (initialBoosterName && imageUrl) return;

      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/users/me/boosters`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const rawData = await response.json();
          const userBoosters = UserBoosterArraySchema.parse(rawData);
          const current = userBoosters.find((b) => b.booster.id === boosterId);
          
          if (current && current.booster) {
            if (!initialBoosterName) setBoosterName(current.booster.name);
            
            // On ne met à jour l'image depuis l'API que si le parent n'a rien envoyé
            if (!imageUrl && current.booster.slug) {
              const slug = current.booster.slug;
              setCurrentImageUrl(slug.startsWith("/") ? slug : `/${slug}`);
            }
          }
        }
      } catch (err) {
        console.error("Impossible de récupérer les détails du booster", err);
      }
    }
    getBoosterDetails();
  }, [boosterId, token, imageUrl, initialBoosterName]);

  // Synchronisation si la prop imageUrl change en cours de route
  useEffect(() => {
    if (imageUrl) {
      setCurrentImageUrl(imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`);
    }
  }, [imageUrl]);

  const handleBoosterOpen = useCallback(async (): Promise<void> => {
    const fetchedCards = await openBooster(boosterId);
    if (!fetchedCards) boosterRef.current?.reset();
  }, [openBooster, boosterId]);

  const handleReset = useCallback((): void => {
    reset();
    boosterRef.current?.reset();
  }, [reset]);

  const hasCards = cards.length > 0;

  return (
    <div className="bg-simpson-white dark:bg-simpson-dark rounded-2xl shadow-2xl w-[95vw] sm:w-fit sm:min-w-[80vw] h-[85vh] sm:h-fit sm:min-h-[81vh] flex flex-col font-main overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-simpson-gray/10 shrink-0">
        <h2 className="text-subtitle font-bold text-simpson-dark dark:text-simpson-white flex items-center gap-2 truncate">
          Ouverture du {boosterName}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-simpson-gray hover:text-simpson-orange transition cursor-pointer shrink-0"
          >
            <FaTimes size={18} />
          </button>
        )}
      </div>

      {/* ZONE DE CONTENU DYNAMIQUE */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center p-6 sm:py-10 gap-4">
        {!hasCards && (
          <div className="w-full flex flex-col items-center justify-center my-auto">
            <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] flex justify-center items-center relative">
              <BoosterPack3D
                ref={boosterRef}
                imageUrl={currentImageUrl}
                containerWidth="100%"
                containerHeight="100%"
                onOpen={handleBoosterOpen}
              />
            </div>

            {isLoading && (
              <p className="text-body text-simpson-orange font-semibold animate-pulse mt-4">
                Récupération des cartes...
              </p>
            )}
            {error && (
              <div
                role="alert"
                className="text-body text-simpson-orange bg-simpson-orange/10 px-4 py-2 rounded-lg text-center mt-4 text-xs"
              >
                {error}
              </div>
            )}
          </div>
        )}

        {hasCards && (
          <div className="w-full flex flex-col items-center gap-4 my-auto">
            <p className="text-medium text-simpson-orange font-semibold tracking-widest uppercase text-xs sm:text-sm">
              {cards.length} nouvelles cartes !
            </p>

            <CardGrid
              cards={cards}
              cardSize={dynamicCardSize}
              onCardClick={onCardClick}
            />
          </div>
        )}
      </div>

      {/* Footer permanent */}
      {hasCards && (
        <div className="flex gap-3 justify-center items-center px-6 py-4 border-t border-simpson-gray/10 dark:border-white/5 flex-shrink-0 bg-gray-50/50 dark:bg-black/10">
          {hasMoreBoosters && (
            <Button className="text-xs py-2 px-4" onClick={handleReset}>
              Ouvrir un autre
            </Button>
          )}
          {onClose && (
            <Button
              className="bg-simpson-gray! text-xs py-2 px-4"
              onClick={onClose}
            >
              Fermer
            </Button>
          )}
        </div>
      )}
    </div>
  );
}