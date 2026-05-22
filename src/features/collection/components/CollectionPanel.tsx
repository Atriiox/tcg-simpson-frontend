"use client";

import { useState } from "react";
import Card from "../../card/components/Card";
import { useCollection } from "../hooks/useCollection";
import { FiMinus, FiPlus, FiZoomIn } from "react-icons/fi";
import CardDetailModal from "../../card/components/CardDetailModal";

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

export default function CollectionPanel() {
  const { collection, isLoading, error } = useCollection();

  // State pour gérer la taille en pixels de la carte
  const [cardSize, setCardSize] = useState<number>(135);

  // 🎯 States pour gérer l'ouverture de la modal et la carte ciblée
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Bornes minimales et maximales du zoom
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

  // 🎯 Handler au clic pour préparer les données et ouvrir la modal
  const handleCardClick = (card: any) => {
    const formattedCard: CardData = {
      name: card.name,
      slug: card.slug,
      type: card.type,
      rarity: String(card.rarity),
      description:
        card.description || "Aucune description disponible pour cette carte.",
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
    <div className="flex-1 h-full overflow-hidden px-6 pt-6 bg-transparent flex flex-col">
      {/* 📌 HEADER DE LA COLLECTION (FIXE) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-simpson-gray/5 pb-4 shrink-0">
        <h1 className="text-subtitle font-black text-simpson-dark dark:text-simpson-white uppercase tracking-wider text-center sm:text-left">
          Ma Collection{" "}
          <span className="text-body font-bold text-simpson-gray ml-2">
            ({collection.length})
          </span>
        </h1>

        {/* 🎛️ BARRE DE ZOOM (SLIDER + ET -) */}
        <div className="flex items-center gap-3 bg-white dark:bg-simpson-darklight p-2 rounded-xl border border-simpson-gray/10 dark:border-transparent select-none shadow-sm">
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-simpson-gray md:flex">
            <FiZoomIn size={14} className="mr-1" />
          </div>

          <button
            onClick={handleZoomOut}
            disabled={cardSize <= MIN_SIZE}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-simpson-gray hover:bg-simpson-light dark:hover:bg-simpson-dark border border-simpson-gray/10 hover:text-simpson-dark dark:hover:text-simpson-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
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
            className="w-7 h-7 flex items-center justify-center rounded-lg text-simpson-gray hover:bg-simpson-light dark:hover:bg-simpson-dark border border-simpson-gray/10 hover:text-simpson-dark dark:hover:text-simpson-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
          >
            <FiPlus size={12} />
          </button>
        </div>
      </div>

      {/* 🔮 ZONE DE SCROLL DE LA GRILLE */}
      <div className="flex-1 pt-6 overflow-y-auto overflow-x-hidden custom-scrollbar w-full">
        <div
          className="grid gap-6 w-full justify-items-center justify-center content-start pb-10"
          style={{
            gridTemplateColumns: `repeat(auto-fill, ${cardSize}px)`,
          }}
        >
          {uniqueCollection.map((card) => (
            <div
              key={card.id}
              // 🎯 L'événement onClick est branché ici sur le wrapper
              onClick={() => handleCardClick(card)}
              className="transition-all duration-300 hover:-translate-y-1.5 hover:drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)] dark:hover:drop-shadow-[0_10px_15px_rgba(255,255,255,0.1)]"
              style={{ width: `${cardSize}px` }}
            >
              <Card
                size={cardSize}
                name={card.name}
                slug={card.slug}
                type={card.type as "Personnage" | "Terrain" | "Objet"}
                rarity={card.rarity}
                ATK={card.ATK}
                PV={card.PV}
                family={card.family.name}
                affinity={card.affinity.name}
                serie={{
                  name_serie: card.serie.id_serie.name,
                  position: card.serie.position,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🎯 RENDU DE TA MODAL DE DÉTAIL */}
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
