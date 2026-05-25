"use client";

import { useState } from "react";
import Card from "@/features/card/components/card";
import { useCollection } from "../hooks/useCollection";
import { FiMinus, FiPlus, FiZoomIn } from "react-icons/fi";
import CardDetailModal from "@/features/card/components/CardDetailModal";

interface CardData {
  name: string;
  slug: string;
  type: string;
  rarity: string;
  description: string;
  ATK?: number;
  PV?: number;
  family?: string;
  affinity?: string;
  serie?: {
    name_serie: string;
    position: number;
  };
}

interface CollectionPanelProps {
  isCreatingDeck: boolean;
  selectedCardIds: string[];
  toggleCardSelection: (id: string) => void;
  maxCardsReached: boolean;
}

export default function CollectionPanel({
  isCreatingDeck,
  selectedCardIds,
  toggleCardSelection,
  maxCardsReached,
}: CollectionPanelProps) {
const { collection, isLoading, error, refetch } = useCollection();  
const [cardSize, setCardSize] = useState<number>(135);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const MIN_SIZE = 90;
  const MAX_SIZE = 200;
  const STEP = 15;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <div className="text-center space-y-2 animate-pulse">
          <div className="w-8 h-8 border-4 border-simpson-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-medium text-simpson-gray">
            Récupération de l'inventaire...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent p-6">
        <p className="text-medium text-simpson-orange font-semibold bg-simpson-orange/5 px-4 py-2 rounded-xl border border-simpson-orange/10">
          {error}
        </p>
      </div>
    );
  }

  if (collection.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <p className="text-medium text-simpson-gray font-medium">
          Aucune carte dans votre collection
        </p>
      </div>
    );
  }

  const uniqueCollection = collection.filter(
    (card, index, self) => self.findIndex((c) => c.id === card.id) === index,
  );

  const handleZoomOut = () =>
    setCardSize((prev) => Math.max(MIN_SIZE, prev - STEP));
  const handleZoomIn = () =>
    setCardSize((prev) => Math.min(MAX_SIZE, prev + STEP));

  const handleCardAction = (card: any) => {
    if (isCreatingDeck) {
      toggleCardSelection(card.id);
      return;
    }

    const formattedCard: CardData = {
      name: card.name,
      slug: card.slug,
      type: card.type,
      rarity: String(card.rarity),
      description: card.description || "Aucune description disponible pour cette carte.",
      ATK: card.ATK,
      PV: card.PV,
      family: card.family?.name || card.family,
      affinity: card.affinity?.name || card.affinity,
      serie: {
        name_serie: card.serie?.id_serie?.name || card.serie?.name_serie,
        position: card.serie?.position,
      },
    };
    setSelectedCard(formattedCard);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 h-full overflow-hidden px-6 pt-6 bg-transparent flex flex-col select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-simpson-dark/20 pb-4 shrink-0">
        <h1 className="text-subtitle font-black text-simpson-dark dark:text-simpson-white uppercase tracking-wider text-center sm:text-left">
          {isCreatingDeck ? "Sélectionne tes cartes" : "Ma Collection"}{" "}
          <span className="text-body font-bold text-simpson-gray ml-2">
            ({collection.length})
          </span>
        </h1>

        <div className="flex items-center gap-3 bg-white dark:bg-simpson-darklight p-2 rounded-xl border border-simpson-gray/10 dark:border-transparent shadow-sm">
          <FiZoomIn size={14} className="text-simpson-gray" />
          <button
            onClick={handleZoomOut}
            disabled={cardSize <= MIN_SIZE}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-simpson-gray hover:bg-simpson-light dark:hover:bg-simpson-dark border border-simpson-gray/10 disabled:opacity-30 cursor-pointer transition-all"
          >
            <FiMinus size={12} />
          </button>
          <input
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={cardSize}
            onChange={(e) => setCardSize(Number(e.target.value))}
            className="w-24 sm:w-32 h-1.5 bg-simpson-gray/20 rounded-lg appearance-none cursor-pointer accent-simpson-orange dark:accent-simpson-yellow"
          />
          <button
            onClick={handleZoomIn}
            disabled={cardSize >= MAX_SIZE}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-simpson-gray hover:bg-simpson-light dark:hover:bg-simpson-dark border border-simpson-gray/10 disabled:opacity-30 cursor-pointer transition-all"
          >
            <FiPlus size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 pt-6 overflow-y-auto overflow-x-hidden scrollbar-none [&::-webkit-scrollbar]:hidden w-full">
        <div
          className="grid gap-6 w-full justify-items-center justify-center content-start pb-10"
          style={{ gridTemplateColumns: `repeat(auto-fill, ${cardSize}px)` }}
        >
          {uniqueCollection.map((card) => {
            const isSelected = selectedCardIds.includes(card.id);
            const isDimmed = isCreatingDeck && !isSelected && maxCardsReached;

            return (
              <div
                key={card.id}
                onClick={() => handleCardAction(card)}
                className={`relative transition-all duration-300 rounded-2xl ${
                  isCreatingDeck ? "cursor-pointer" : ""
                } ${isSelected ? "scale-[1.02]" : "hover:-translate-y-1.5"} 
                ${isDimmed ? "opacity-30 filter grayscale-20" : ""}`}
                style={{ width: `${cardSize}px` }}
              >
                {isSelected && (
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute -inset-0.5 border-4 border-simpson-orange rounded-[0.4em]" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-simpson-orange rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,148,211,0.5)] animate-scaleIn">
                      <span className="text-[12px] text-white font-black leading-none">✓</span>
                    </div>
                  </div>
                )}

                <Card
                  size={cardSize}
                  card={{
                    name: card.name,
                    slug: card.slug,
                    type: card.type as "Personnage" | "Terrain" | "Objet",
                    rarity: card.rarity,
                    ATK: card.ATK,
                    PV: card.PV,
                    description: card.description,
                    family: card.family,
                    affinity: card.affinity,
                    serie: card.serie,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <CardDetailModal
        isOpen={isModalOpen}
        card={selectedCard}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCard(null);
        }}
      />
    </div>
  );
}