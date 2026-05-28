"use client";

import { useState, useEffect } from "react";
import Card from "@/features/card/components/Card";
import { FiMinus, FiPlus, FiZoomIn } from "react-icons/fi";
import CardDetailModal from "@/features/card/components/CardDetailModal";
import { useFilter, Filters } from "@/features/collection/hooks/useFilter";
import { useCollection } from "@/features/collection/hooks/useCollection";
import { useMoney } from "@/features/shop/hooks/useMoney";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  useAllCards,
  SystemCard,
} from "@/features/collection/hooks/useAllCards";
import type { CardData } from "@/features/card/interfaces/card.interface";

interface CollectionControls {
  filters: Filters;
  handleSelect: (group: string, value: string) => void;
  resetFilters: () => void;
  search: string;
  setSearch: (val: string) => void;
  showAllCards: boolean;
  setShowAllCards: (val: boolean) => void;
}

interface CollectionPanelProps {
  isCreatingDeck: boolean;
  selectedCardIds: string[];
  toggleCardSelection: (id: string) => void;
  maxCardsReached: boolean;
  onControlsReady: (controls: CollectionControls) => void;
  isAuthentificated: boolean;
}

export default function CollectionPanel({
  isCreatingDeck,
  selectedCardIds,
  toggleCardSelection,
  maxCardsReached,
  onControlsReady,
  isAuthentificated,
}: CollectionPanelProps) {
  const [cardSize, setCardSize] = useState<number>(135);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [selectedCardQuantity, setSelectedCardQuantity] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [search, setSearch] = useState<string>("");

  const token = useSelector((state: RootState) => state.user.token);
  const { money, updateReduxMoney } = useMoney();

  const { filters, handleSelect, resetFilters } = useFilter();
  const {
    collection = [],
    isLoading: loadingColl,
    error: errorColl,
    refetch: refetchCollection,
  } = useCollection(filters, search);
  const {
    cards = [],
    isLoading: loadingAll,
    error: errorAll,
  } = useAllCards(filters, search);

  const displayedCards = showAllCards ? cards : collection;
  const isLoading = showAllCards ? loadingAll : loadingColl;
  const error = showAllCards ? errorAll : errorColl;
  const title = showAllCards ? "Toutes les cartes" : "Ma Collection";

  const MIN_SIZE = 90;
  const MAX_SIZE = 200;
  const STEP = 15;

  useEffect(() => {
    onControlsReady({
      filters,
      handleSelect,
      resetFilters,
      search,
      setSearch,
      showAllCards,
      setShowAllCards,
    });
  }, [filters, search, showAllCards]);

  // 🌟 Premier chargement uniquement : si c'est vide ET que ça charge au tout début
  if (isLoading && displayedCards.length === 0 && !isModalOpen) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <div className="text-center space-y-2 animate-pulse">
          <div className="w-8 h-8 border-4 border-simpson-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-medium text-simpson-gray">
            Récupération des cartes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent p-6">
        <div className="flex flex-col items-center gap-3 bg-white/40 dark:bg-simpson-darklight/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-red-500/20 dark:border-red-500/10 shadow-lg text-center max-w-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </div>
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-bold tracking-wide uppercase">
            Erreur de connexion
          </p>
          <p className="text-[11px] sm:text-xs text-simpson-gray dark:text-simpson-white/60 font-medium leading-relaxed">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Affiche ce message uniquement si l'API a terminé de charger et qu'il n'y a vraiment rien
  if (displayedCards.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <p className="text-medium text-simpson-gray font-medium">
          Aucune carte dans votre collection
        </p>
      </div>
    );
  }

  const cardQuantities = collection.reduce(
    (acc, card) => {
      const key = card.slug || card.id;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const ownedCardKeys = new Set(collection.map((c) => c.slug || c.id));

  const uniqueDisplayed = displayedCards.filter(
    (card, index, self) =>
      self.findIndex((c) => (c.slug || c.id) === (card.slug || card.id)) ===
      index,
  );

  const handleZoomOut = () =>
    setCardSize((prev) => Math.max(MIN_SIZE, prev - STEP));
  const handleZoomIn = () =>
    setCardSize((prev) => Math.min(MAX_SIZE, prev + STEP));

  const handleCardAction = (card: SystemCard) => {
    if (isCreatingDeck) {
      toggleCardSelection(card.id);
      return;
    }
    const key = card.slug || card.id;
    setSelectedCardQuantity(cardQuantities[key] || 0);
    setSelectedCard(card as unknown as CardData);
    setIsModalOpen(true);
  };

  const handleSellCard = async (cardId: string, count: number) => {
    if (!selectedCard) return;

    const rates: Record<string, number> = { "1": 5, "2": 25, "3": 50 };
    const pricePerCard = rates[selectedCard.rarity] || 5;
    const totalGains = pricePerCard * count;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/collection/sell`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cardId, count }),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors du retrait de la carte côté serveur");
      }

      const newMoneyTotal = money + totalGains;
      updateReduxMoney(newMoneyTotal);

      setSelectedCardQuantity((prev) => Math.max(0, prev - count));
      refetchCollection();
    } catch (err) {
      console.error("Échec de la vente :", err);
      alert(
        "Impossible de finaliser la vente. Problème avec la centrale nucléaire.",
      );
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden px-6 pt-6 bg-transparent flex flex-col select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-simpson-dark/20 pb-4 shrink-0">
        <h1 className="text-subtitle font-black text-simpson-dark dark:text-simpson-white uppercase tracking-wider text-center sm:text-left">
          {isCreatingDeck ? "Sélectionne tes cartes" : title}{" "}
          <span className="text-body font-bold text-simpson-gray ml-2">
            ({displayedCards.length})
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
        {/* 🌟 Plus d'opacité changeante ni de pointer-events bloqués, l'affichage reste stable à 100% */}
        <div
          className="grid gap-6 w-full justify-items-center justify-center content-start pb-10"
          style={{ gridTemplateColumns: `repeat(auto-fill, ${cardSize}px)` }}
        >
          {uniqueDisplayed.map((card) => {
            const isSelected = selectedCardIds.includes(card.id);
            const isDimmed = isCreatingDeck && !isSelected && maxCardsReached;
            const quantity = cardQuantities[card.slug || card.id] || 0;
            const isOwned = ownedCardKeys.has(card.slug || card.id);

            const shouldShowAsNotOwned =
              isAuthentificated && showAllCards && !isOwned;

            return (
              <div
                key={card.id}
                onClick={() => handleCardAction(card)}
                className={`relative transition-all duration-300 rounded-2xl ${isCreatingDeck ? "cursor-pointer" : ""} ${isSelected ? "scale-[1.02]" : "hover:-translate-y-1.5"} ${isDimmed ? "opacity-30 filter grayscale-20" : ""} ${shouldShowAsNotOwned ? "opacity-30 filter grayscale-20" : ""}`}
                style={{ width: `${cardSize}px` }}
              >
                {isSelected && (
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute -inset-0.5 border-4 border-simpson-orange rounded-[0.4em]" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-simpson-orange rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,148,211,0.5)] animate-scaleIn">
                      <span className="text-[12px] text-white font-black leading-none">
                        ✓
                      </span>
                    </div>
                  </div>
                )}

                {!isSelected && isAuthentificated && quantity >= 1 && (
                  <div className="absolute -top-2 -right-2 z-20 min-w-6 h-6 px-1.5 bg-simpson-dark dark:bg-simpson-white text-white dark:text-simpson-dark rounded-full flex items-center justify-center border border-simpson-gray/20 shadow-md pointer-events-none font-black text-[11px]">
                    x{quantity}
                  </div>
                )}

                <Card
                  size={cardSize}
                  card={{
                    id: card.id,
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
        quantity={selectedCardQuantity}
        collectionCards={collection as unknown as CardData[]}
        allCards={cards as unknown as CardData[]}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCard(null);
          setSelectedCardQuantity(0);
        }}
        onSell={handleSellCard}
      />
    </div>
  );
}
