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
  imageUrl?: string;
  cardSize?: number;
  onCardClick?: (card: Card) => void;
  onClose?: () => void;
}

export default function BoosterOpener({
  boosterId,
  imageUrl = "/booster1.webp",
  cardSize = 150,
  onCardClick,
  onClose,
}: BoosterOpenerProps): React.JSX.Element {
  const boosterRef = useRef<BoosterPack3DHandle>(null);
  const [boosterName, setBoosterName] = useState<string>("Nouveau booster !");
  const { token } = useSelector((state: RootState) => state.user);
  const { cards, isLoading, error, hasMoreBoosters, openBooster, reset } =
    useBoosterCards();

  // 🌟 Récupération du nom du booster actuel via l'API
  useEffect(() => {
    async function getBoosterName() {
      if (!boosterId || !token) return;
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
          if (current) {
            setBoosterName(current.booster.name);
          }
        }
      } catch (err) {
        console.error("Impossible de récupérer le nom du booster", err);
      }
    }
    getBoosterName();
  }, [boosterId, token]);

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
    <div className="bg-simpson-white dark:bg-simpson-dark rounded-2xl shadow-2xl w-[90vw] max-w-2xl flex flex-col font-main">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-simpson-gray/10">
        {/* 🌟 Le titre s'adapte maintenant au nom du booster */}
        <h2 className="text-subtitle font-bold text-simpson-dark dark:text-simpson-white flex items-center gap-2">
          Ouverture du {boosterName}
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
      <div className="flex flex-col items-center gap-4 px-6 tp-1 pb-6">
        {!hasCards && (
          <>
            <div
              className="w-full flex justify-center items-center"
              style={{ height: "380px" }} // Augmenté légèrement pour donner de l'air au hint texte en bas
            >
              {/* On supprime la div scale-50 origin-top */}
              <BoosterPack3D
                ref={boosterRef}
                imageUrl={imageUrl}
                containerWidth={360} // Moitié de 520 : parfait pour la largeur
                containerHeight={360} // Moitié de 720 : rentre nickel dans les 380px de haut sans déformer la scène 3D
                onOpen={handleBoosterOpen}
              />
            </div>

            {isLoading && (
              <p className="text-body text-simpson-orange font-semibold animate-pulse">
                Récupération des cartes...
              </p>
            )}
            {error && (
              <div
                role="alert"
                className="text-body text-simpson-orange bg-simpson-orange/10 px-4 py-2 rounded-lg text-center"
              >
                {error}
              </div>
            )}
          </>
        )}

        {hasCards && (
          <>
            <p className="pt-2 text-medium text-simpson-orange font-semibold tracking-widest">
            
            </p>
            <CardGrid
              cards={cards}
              cardSize={cardSize}
              onCardClick={onCardClick}
            />
            <div className="flex gap-3 mt-2">
              {hasMoreBoosters && (
                <Button onClick={handleReset}>Ouvrir un autre booster</Button>
              )}
              {onClose && <Button onClick={onClose}>Fermer</Button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
