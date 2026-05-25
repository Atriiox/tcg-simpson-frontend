"use client";

import { useState } from "react";
import FilterPanel from "./FilterPanel";
import RightPanel from "./RightPanel";
import CollectionPanel from "./CollectionPanel";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

export default function Main() {
  const [showFilter, setShowFilter] = useState(true);
  const [showRight, setShowRight] = useState(true);

  // 🎯 ÉTATS DU DECK BUILDER PARTAGÉS
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  const MAX_CARDS = 10;
  const cardCount = selectedCardIds.length;
  const isDeckValid = cardCount === MAX_CARDS;

  const startNewDeck = () => {
    setIsCreatingDeck(true);
    setSelectedCardIds([]);
    setDeckName("");
    setShowRight(true);
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCardIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= MAX_CARDS) return prev;
      return [...prev, cardId];
    });
  };

  const cancelDeckCreation = () => {
    setIsCreatingDeck(false);
    setSelectedCardIds([]);
  };

  return (
    <div
      className="grid h-full w-full overflow-hidden relative bg-simpson-white dark:bg-simpson-dark"
      style={{
        gridTemplateColumns: `${showFilter ? "240px" : "0px"} minmax(0, 1fr) ${showRight ? "220px" : "0px"}`,
        transition: "grid-template-columns 300ms ease-in-out",
      }}
    >
      {/* 1. PANNEAU GAUCHE : FILTRES */}
      <div className="relative z-10 border-r border-simpson-gray/10 dark:border-simpson-darklight/40 h-full overflow-hidden shadow-xl dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)] bg-simpson-white dark:bg-simpson-dark">
        <div className="w-60 h-full overflow-y-auto custom-scrollbar">
          <FilterPanel />
        </div>
      </div>

      {/* 🔘 TOGGLE FILTRES */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="absolute top-1/2 -translate-y-1/2 z-40 w-6 h-12 flex items-center justify-center bg-white dark:bg-simpson-darklight border border-simpson-gray/20 dark:border-simpson-dark text-simpson-gray hover:text-white hover:bg-simpson-orange dark:hover:bg-simpson-yellow dark:hover:text-simpson-dark rounded-r-xl shadow-md transition-all duration-200 cursor-pointer"
        style={{
          left: showFilter ? "240px" : "0px",
          transition: "left 300ms ease-in-out",
        }}
      >
        {showFilter ? <FaAngleLeft size={14} /> : <FaAngleRight size={14} />}
      </button>

      <CollectionPanel
        isCreatingDeck={isCreatingDeck}
        selectedCardIds={selectedCardIds}
        toggleCardSelection={toggleCardSelection}
        maxCardsReached={cardCount >= MAX_CARDS}
      />

      <div className="relative z-10 border-l border-simpson-gray/10 dark:border-simpson-darklight/40 h-full overflow-hidden shadow-[-10px_0_20px_rgba(0,0,0,0.04)] dark:shadow-[-4px_0_24px_rgba(0,0,0,0.4)] bg-simpson-white dark:bg-simpson-dark">
        <div className="w-55 h-full overflow-y-auto custom-scrollbar">
          <RightPanel
            isCreatingDeck={isCreatingDeck}
            deckName={deckName}
            setDeckName={setDeckName}
            cardCount={cardCount}
            maxCards={MAX_CARDS}
            isDeckValid={isDeckValid}
            startNewDeck={startNewDeck}
            cancelDeckCreation={cancelDeckCreation}
            setIsCreatingDeck={setIsCreatingDeck}
          />
        </div>
      </div>

      {/* 🔘 TOGGLE DROITE */}
      <button
        onClick={() => setShowRight(!showRight)}
        className="absolute top-1/2 -translate-y-1/2 z-40 w-6 h-12 flex items-center justify-center bg-white dark:bg-simpson-darklight border border-simpson-gray/20 dark:border-simpson-dark text-simpson-gray hover:text-white hover:bg-simpson-orange dark:hover:bg-simpson-yellow dark:hover:text-simpson-dark rounded-l-xl shadow-md transition-all duration-200 cursor-pointer"
        style={{
          right: showRight ? "220px" : "0px",
          transition: "right 300ms ease-in-out",
        }}
      >
        {showRight ? <FaAngleRight size={14} /> : <FaAngleLeft size={14} />}
      </button>
    </div>
  );
}
