"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterPanel from "./FilterPanel";
import RightPanel from "./rightPanel/RightPanel";
import CollectionPanel from "./CollectionPanel";
import { FaFilter, FaLayerGroup, FaTimes } from "react-icons/fa";
import { useDeckBuilder } from "@/features/collection/hooks/useDeckBuilder";
import BoosterOpener from "@/features/booster/boosterOpener/components/BoosterOpener";
import { useReward } from "@/components/RewardContext";
import { Filters } from "@/features/collection/hooks/useFilter";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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

  // États additionnels pour le responsive mobile (tiroirs ouverts)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);

  const [collectionKey, setCollectionKey] = useState(0);
  const [activeBooster, setActiveBooster] = useState<ActiveBoosterState | null>(
    null,
  );
  const [collectionControls, setCollectionControls] =
    useState<CollectionControls | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Sur mobile, on ferme les panneaux par défaut pour laisser place à la collection
    if (window.innerWidth < 768) {
      setShowFilter(false);
      setShowRight(false);
    }
  }, []);

  const token = useSelector((state: RootState) => state.user.token);
  const isAuthentificated = isMounted ? !!token : false;

  const searchParams = useSearchParams();
  const router = useRouter();
  const isNewUser = searchParams.get("newUser") === "true";
  const [showBoosterModal, setShowBoosterModal] = useState(isNewUser);
  const boostersRefreshRef = useRef<(() => void) | null>(null);
  const { triggerReward } = useReward();

  useEffect(() => {
    if (isNewUser) triggerReward(100);
  }, [isNewUser]);

  useEffect(() => {
    if (!isAuthentificated && collectionControls) {
      collectionControls.setShowAllCards(true);
    }
  }, [isAuthentificated, collectionControls]);

  const handleCloseBooster = () => {
    setShowBoosterModal(false);
    setActiveBooster(null);
    router.replace("/collection");
    if (boostersRefreshRef.current) boostersRefreshRef.current();
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

  // Force l'ouverture du volet Deck si l'utilisateur entre en mode création sur mobile
  useEffect(() => {
    if (isCreating && window.innerWidth < 768) {
      setMobileRightOpen(true);
    }
  }, [isCreating]);

  const onSaveDeckAndClear = async (name: string) => {
    await handleSaveDeck(name);
    setCollectionKey((prev) => prev + 1);
    setMobileRightOpen(false);
  };

  const onCancelCreationAndClear = () => {
    cancelCreation();
    setCollectionKey((prev) => prev + 1);
    setMobileRightOpen(false);
  };

  return (
    <>
      {showBoosterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleCloseBooster}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
            <BoosterOpener
              boosterId={activeBooster?.id || undefined}
              boosterName={activeBooster?.name}
              imageUrl={activeBooster?.slug}
              onClose={handleCloseBooster}
              onBoosterOpenedSuccess={() => {
                if (boostersRefreshRef.current) boostersRefreshRef.current();
              }}
            />
          </div>
        </div>
      )}

      {/* BARRE D'ACTIONS FIXE EN BAS UNIQUE AUX MOBILES */}
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/90 dark:bg-simpson-darklight/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-simpson-gray/20 dark:border-white/10 flex items-center gap-6">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex flex-col items-center gap-0.5 text-simpson-dark dark:text-simpson-white text-[10px] font-bold"
        >
          <FaFilter
            size={16}
            className="text-simpson-orange dark:text-simpson-yellow"
          />
          Filtres
        </button>
        {isAuthentificated && (
          <button
            onClick={() => setMobileRightOpen(true)}
            className="flex flex-col items-center gap-0.5 text-simpson-dark dark:text-simpson-white text-[10px] font-bold relative"
          >
            <FaLayerGroup
              size={16}
              className="text-simpson-orange dark:text-simpson-yellow"
            />
            {isCreating ? "Mon Deck Builder" : "Boosters & Decks"}
            {isCreating && (
              <span className="absolute -top-1 -right-2 bg-emerald-500 w-2.5 h-2.5 rounded-full border border-white" />
            )}
          </button>
        )}
      </div>

      {/* CONTENEUR PRINCIPAL GRID (DESKTOP) ET FLEX (MOBILE) */}
      <div
        className="flex flex-col md:grid h-full w-full overflow-hidden relative bg-simpson-white dark:bg-simpson-dark"
        style={{
          gridTemplateColumns: isAuthentificated
            ? `${showFilter ? "240px" : "0px"} minmax(0, 1fr) ${showRight ? "220px" : "0px"}`
            : `${showFilter ? "240px" : "0px"} minmax(0, 1fr)`,
          transition: "grid-template-columns 300ms ease-in-out",
        }}
      >
        {/* ============================================================
            1. PANNEAU GAUCHE : FILTRES (Desktop + Tiroir Mobile intégré)
           ============================================================ */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-72 transform bg-simpson-white dark:bg-simpson-dark shadow-2xl transition-transform duration-300
            md:relative md:inset-auto md:z-10 md:w-60 md:transform-none md:border-r md:border-simpson-gray/10 md:dark:border-simpson-darklight/40 md:shadow-xl
            ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Bouton de fermeture mobile */}
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="md:hidden absolute top-4 right-4 text-simpson-gray z-30"
          >
            <FaTimes size={18} />
          </button>

          <div className="h-full overflow-y-auto custom-scrollbar">
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
                isAuthentificated={isAuthentificated}
              />
            )}
          </div>
        </div>

        {/* Arrière-plan sombre quand le filtre mobile est affiché */}
        {mobileFilterOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
        )}

        {/* 🔘 TOGGLE FILTRES (DESKTOP UNIQUEMENT) */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-40 w-5 h-12 items-center justify-center bg-white dark:bg-simpson-darklight border border-simpson-gray/20 dark:border-simpson-dark text-simpson-gray hover:text-white hover:bg-simpson-orange dark:hover:bg-simpson-yellow rounded-r-xl shadow-md cursor-pointer"
          style={{
            left: showFilter ? "240px" : "0px",
            transition: "left 300ms ease-in-out",
          }}
        >
          <span className="text-[10px] font-bold">
            {showFilter ? "‹" : "›"}
          </span>
        </button>

        {/* ============================================================
            2. CENTRE : PANNEAU DE LA COLLECTION
           ============================================================ */}
        <div className="flex-1 h-full min-h-0 overflow-hidden pb-16 md:pb-0">
          <CollectionPanel
            key={collectionKey}
            isCreatingDeck={isCreating}
            selectedCardIds={isCreating ? selectedCardIds : []}
            toggleCardSelection={toggleCardSelection}
            maxCardsReached={cardCount >= maxCards}
            onControlsReady={setCollectionControls}
            isAuthentificated={isAuthentificated}
          />
        </div>

        {/* ============================================================
            3. PANNEAU DROIT : DECKS & BOOSTERS (Desktop + Tiroir Mobile)
           ============================================================ */}
        {isAuthentificated && (
          <>
            <div
              className={`
                fixed inset-y-0 right-0 z-50 w-80 transform bg-simpson-white dark:bg-simpson-dark shadow-2xl transition-transform duration-300
                md:relative md:inset-auto md:z-10 md:w-55 md:transform-none md:border-l md:border-simpson-gray/10 md:dark:border-simpson-darklight/40 md:shadow-xl
                ${mobileRightOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
              `}
            >
              {/* Bouton de fermeture mobile */}
              <button
                onClick={() => setMobileRightOpen(false)}
                className="md:hidden absolute top-4 left-4 text-simpson-gray z-30"
              >
                <FaTimes size={18} />
              </button>

              <div className="h-full overflow-y-auto custom-scrollbar">
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
                  boostersRefreshRef={boostersRefreshRef}
                />
              </div>
            </div>

            {/* Arrière-plan sombre quand le panneau droit mobile est affiché */}
            {mobileRightOpen && (
              <div
                className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
                onClick={() => setMobileRightOpen(false)}
              />
            )}

            {/* 🔘 TOGGLE DROITE (DESKTOP UNIQUEMENT) */}
            <button
              onClick={() => setShowRight(!showRight)}
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-40 w-5 h-12 items-center justify-center bg-white dark:bg-simpson-darklight border border-simpson-gray/20 dark:border-simpson-dark text-simpson-gray hover:text-white hover:bg-simpson-orange dark:hover:bg-simpson-yellow rounded-l-xl shadow-md cursor-pointer"
              style={{
                right: showRight ? "220px" : "0px",
                transition: "right 300ms ease-in-out",
              }}
            >
              <span className="text-[10px] font-bold">
                {showRight ? "›" : "‹"}
              </span>
            </button>
          </>
        )}
      </div>
    </>
  );
}
