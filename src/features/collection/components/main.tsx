"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterPanel from "./filterPanel";
import RightPanel from "./rightPanel";
import CollectionPanel from "./CollectionPanel";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { useDeckBuilder } from "../hooks/useDeckBuilder";
import BoosterOpener from "@/features/booster/boosterOpener/components/BoosterOpener";

export default function Main() {
  const [showFilter, setShowFilter] = useState(true);
  const [showRight, setShowRight] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const isNewUser = searchParams.get("newUser") === "true";
  const [showBoosterModal, setShowBoosterModal] = useState(isNewUser);

  const handleCloseBooster = () => {
    setShowBoosterModal(false);
    router.replace("/collection");
  };

  const {
    isCreating,
    deckName,
    setDeckName,
    selectedCardIds,
    cardCount,
    maxCards,
    isValid,
    startNewDeck,
    startEditDeck,
    handleDeleteDeck,
    handleSetActiveDeck,
    toggleCardSelection,
    handleSaveDeck,
    cancelCreation,
    decks,
    isLoadingDecks,
  } = useDeckBuilder();

  return (
    <>
      {showBoosterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={handleCloseBooster}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <BoosterOpener />
          </div>
        </div>
      )}

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

        {/* 2. CENTRE : PANNEAU DE LA COLLECTION */}
        <CollectionPanel
          isCreatingDeck={isCreating}
          selectedCardIds={selectedCardIds}
          toggleCardSelection={toggleCardSelection}
          maxCardsReached={cardCount >= maxCards}
        />

      {/* 3. PANNEAU DROIT : DECKS & BOOSTERS */}
      <div className="relative z-10 border-l border-simpson-gray/10 dark:border-simpson-darklight/40 h-full overflow-hidden shadow-[-10px_0_20px_rgba(0,0,0,0.04)] dark:shadow-[-4px_0_24px_rgba(0,0,0,0.4)] bg-simpson-white dark:bg-simpson-dark">
        <div className="w-55 h-full overflow-y-auto custom-scrollbar">
          <RightPanel
            isCreatingDeck={isCreating}
            deckName={deckName}
            setDeckName={setDeckName}
            cardCount={cardCount}
            maxCards={maxCards}
            isDeckValid={isValid}
            startNewDeck={startNewDeck}
            cancelDeckCreation={cancelCreation}
            handleSaveDeck={handleSaveDeck}
            decks={decks}
            isLoadingDecks={isLoadingDecks}
            maxDecks={3}
            startEditDeck={startEditDeck}
            handleDeleteDeck={handleDeleteDeck}
            handleSetActiveDeck={handleSetActiveDeck}
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
    </>
  );
}