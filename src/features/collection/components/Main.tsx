"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterPanel from "./FilterPanel";
import RightPanel from "./rightPanel/RightPanel";
import CollectionPanel from "./CollectionPanel";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { useDeckBuilder } from "../hooks/useDeckBuilder";
import BoosterOpener from "@/features/booster/boosterOpener/components/BoosterOpener";
import { useReward } from "@/components/RewardContext";
import { Filters } from "@/features/collection/hooks/useFilter";

interface ActiveBoosterState {
  id: string;
  name: string;
  slug: string;
}

interface CollectionControls {
  filters: Filters;
  handleSelect: (group: string, value: string) => void;
  resetFilters: () => void;
  search: string;
  setSearch: (val: string) => void;
  showAllCards: boolean;
  setShowAllCards: (val: boolean) => void;
}

export default function Main() {
  const [showFilter, setShowFilter] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [collectionKey, setCollectionKey] = useState(0);
  const [activeBooster, setActiveBooster] = useState<ActiveBoosterState | null>(null);
  const [collectionControls, setCollectionControls] = useState<CollectionControls | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const isNewUser = searchParams.get("newUser") === "true";
  const [showBoosterModal, setShowBoosterModal] = useState(isNewUser);

  const { triggerReward } = useReward();

  useEffect(() => {
    if (isNewUser) triggerReward(100);
  }, [isNewUser]);

  const handleCloseBooster = () => {
    setShowBoosterModal(false);
    setActiveBooster(null);
    router.replace("/collection");
    setCollectionKey((prev) => prev + 1);
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

  const onSaveDeckAndClear = async (name: string) => {
    await handleSaveDeck(name);
    setCollectionKey((prev) => prev + 1);
  };

  const onCancelCreationAndClear = () => {
    cancelCreation();
    setCollectionKey((prev) => prev + 1);
  };

  return (
    <>
      {showBoosterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={handleCloseBooster}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <BoosterOpener
              boosterId={activeBooster?.id || undefined}
              boosterName={activeBooster?.name}
              imageUrl={activeBooster?.slug}
              onClose={handleCloseBooster}
            />
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
            {collectionControls && (
              <FilterPanel
                filters={collectionControls.filters}
                handleSelect={collectionControls.handleSelect}
                resetFilters={() => {
                  collectionControls.resetFilters();
                  collectionControls.setSearch("");
                }}
                searchTerm={collectionControls.search}
                onSearchChange={collectionControls.setSearch}
                showAllCards={collectionControls.showAllCards}
                onToggleShowAll={collectionControls.setShowAllCards}
              />
            )}
          </div>
        </div>

        {/* 🔘 TOGGLE FILTRES */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="absolute top-1/2 -translate-y-1/2 z-40 w-6 h-12 flex items-center justify-center bg-white dark:bg-simpson-darklight border border-simpson-gray/20 dark:border-simpson-dark text-simpson-gray hover:text-white hover:bg-simpson-orange dark:hover:bg-simpson-yellow dark:hover:text-simpson-dark rounded-r-xl shadow-md transition-all duration-200 cursor-pointer"
          style={{ left: showFilter ? "240px" : "0px", transition: "left 300ms ease-in-out" }}
        >
          {showFilter ? <FaAngleLeft size={14} /> : <FaAngleRight size={14} />}
        </button>

        {/* 2. CENTRE : PANNEAU DE LA COLLECTION */}
        <CollectionPanel
          key={collectionKey}
          isCreatingDeck={isCreating}
          selectedCardIds={isCreating ? selectedCardIds : []}
          toggleCardSelection={toggleCardSelection}
          maxCardsReached={cardCount >= maxCards}
          onControlsReady={setCollectionControls}
        />

        {/* 3. PANNEAU DROIT */}
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
              cancelDeckCreation={onCancelCreationAndClear}
              handleSaveDeck={onSaveDeckAndClear}
              decks={decks}
              isLoadingDecks={isLoadingDecks}
              maxDecks={3}
              startEditDeck={startEditDeck}
              handleDeleteDeck={handleDeleteDeck}
              handleSetActiveDeck={handleSetActiveDeck}
              onTriggerOpenBooster={(boosterId, name, slug) => {
                setActiveBooster({ id: boosterId, name, slug });
                setShowBoosterModal(true);
              }}
            />
          </div>
        </div>

        {/* 🔘 TOGGLE DROITE */}
        <button
          onClick={() => setShowRight(!showRight)}
          className="absolute top-1/2 -translate-y-1/2 z-40 w-6 h-12 flex items-center justify-center bg-white dark:bg-simpson-darklight border border-simpson-gray/20 dark:border-simpson-dark text-simpson-gray hover:text-white hover:bg-simpson-orange dark:hover:bg-simpson-yellow dark:hover:text-simpson-dark rounded-l-xl shadow-md transition-all duration-200 cursor-pointer"
          style={{ right: showRight ? "220px" : "0px", transition: "right 300ms ease-in-out" }}
        >
          {showRight ? <FaAngleRight size={14} /> : <FaAngleLeft size={14} />}
        </button>
      </div>
    </>
  );
}