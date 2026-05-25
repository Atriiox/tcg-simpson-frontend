"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { BiSave, BiX, BiCheckCircle } from "react-icons/bi";

type Tab = "boosters" | "decks";

interface BoosterInventory {
  booster1: number;
  booster2: number;
}

interface RightPanelProps {
  isCreatingDeck: boolean;
  deckName: string;
  setDeckName: (name: string) => void;
  cardCount: number;
  maxCards: number;
  isDeckValid: boolean;
  startNewDeck: () => void;
  cancelDeckCreation: () => void;
  setIsCreatingDeck: (val: boolean) => void;
}

export default function RightPanel({
  isCreatingDeck,
  deckName,
  setDeckName,
  cardCount,
  maxCards,
  isDeckValid,
  startNewDeck,
  cancelDeckCreation,
  setIsCreatingDeck,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("decks");
  const [boostersOwned, setBoostersOwned] = useState<BoosterInventory>({
    booster1: 1,
    booster2: 3,
  });

  const handleOpenBooster = (type: keyof BoosterInventory) => {
    if (boostersOwned[type] <= 0) return;
    setBoostersOwned((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    alert(
      `Ouverture du ${type === "booster1" ? "Booster Classique" : "Booster Spécial"} ! 🍩`,
    );
  };

  const handleSaveDeck = () => {
    if (!isDeckValid) return;
    console.log("Enregistrement du deck :", { name: deckName });
    setIsCreatingDeck(false);
  };

  return (
    <div className="h-full flex flex-col bg-transparent relative select-none">
      {isCreatingDeck ? (
        <div className="sticky top-0 z-20 bg-simpson-white dark:bg-simpson-darklight px-4 pt-4 pb-4 border-b border-simpson-gray/5 dark:border-transparent flex flex-col gap-4 shrink-0 animate-fadeIn">
          <div>
            <h2 className="text-center text-[10px] font-bold tracking-widest text-simpson-orange dark:text-simpson-yellow uppercase">
              Création en cours
            </h2>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor="deck-name-input"
              className="text-[11px] font-medium text-simpson-gray pl-1"
            >
              Nom du deck
            </label>
            <input
              id="deck-name-input"
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="bg-simpson-gray/10 dark:bg-black/20 border border-simpson-gray/15 dark:border-white/5 px-3 py-2 rounded-xl text-xs font-semibold outline-none text-simpson-dark dark:text-simpson-white focus:border-simpson-orange dark:focus:border-simpson-yellow w-full transition-colors"
              placeholder="Ex: Mon deck principal"
            />
          </div>

          {/* Jauge de progression fine */}
          <div className="w-full bg-simpson-gray/10 dark:bg-black/20 rounded-full h-1.5 overflow-hidden relative border border-simpson-gray/5">
            <div
              className={`h-full transition-all duration-300 ${isDeckValid ? "bg-emerald-500" : "bg-simpson-orange dark:bg-simpson-yellow"}`}
              style={{ width: `${(cardCount / maxCards) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button
              onClick={handleSaveDeck}
              disabled={!isDeckValid}
              className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 h-10 ${
                !isDeckValid
                  ? "opacity-30 cursor-not-allowed bg-simpson-gray text-white border-none"
                  : ""
              }`}
            >
              <BiSave size={16} /> SAUVEGARDER
            </Button>

            <Button
              onClick={cancelDeckCreation}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 h-10 bg-transparent border border-simpson-gray/20 !text-simpson-gray hover:bg-simpson-gray/5 dark:hover:bg-white/5 transition-all cursor-pointer shadow-none"
            >
              <BiX size={16} /> ANNULER
            </Button>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 z-20 bg-simpson-white dark:bg-simpson-darklight px-4 pt-4 pb-4 border-b border-simpson-gray/5 dark:border-transparent flex flex-col items-center gap-3 shrink-0">
          <h2 className="text-center font-bold tracking-wide text-simpson-dark dark:text-simpson-white text-sm">
            {activeTab === "decks" ? "Mes decks" : "Mes boosters"}
          </h2>

          <div className="flex bg-simpson-gray/10 dark:bg-white/5 p-1 rounded-xl border border-simpson-gray/5 dark:border-white/5 w-full">
            {(["boosters", "decks"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-lg transition-all duration-200 font-bold cursor-pointer text-xs
                  ${
                    activeTab === tab
                      ? "bg-white dark:bg-simpson-darklight text-simpson-orange dark:text-simpson-yellow shadow-sm"
                      : "text-simpson-gray hover:text-simpson-dark dark:hover:text-simpson-white"
                  }`}
              >
                {tab === "decks" ? "Decks" : "Boosters"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "decks" && !isCreatingDeck && (
          <DecksTab onStart={startNewDeck} />
        )}

        {activeTab === "decks" && isCreatingDeck && (
          <div className="py-6 px-2 text-center space-y-4 animate-fadeIn">
            {cardCount < maxCards ? (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-simpson-orange dark:text-simpson-yellow">
                    Sélection en cours
                  </p>
                  <p className="text-[11px] text-simpson-gray leading-relaxed font-medium">
                    Ajoute encore {maxCards - cardCount} carte
                    {maxCards - cardCount > 1 ? "s" : ""} depuis ta collection.
                  </p>
                </div>

                <div className="bg-simpson-gray/5 border border-simpson-gray/10 dark:border-white/5 rounded-2xl py-2.5 px-4 inline-block mx-auto">
                  <span className="text-xs font-bold tracking-wider text-simpson-dark dark:text-simpson-white">
                    {cardCount} / {maxCards} CARTES
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center text-emerald-500 animate-bounce">
                  <BiCheckCircle size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-500">
                    Deck complet !
                  </p>
                  <p className="text-[11px] text-simpson-gray font-medium">
                    Ton équipe est prête à être enregistrée.
                  </p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl py-2.5 px-4 inline-block mx-auto">
                  <span className="text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                    {cardCount} / {maxCards} CARTES
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "boosters" && (
          <BoostersTab inventory={boostersOwned} onOpen={handleOpenBooster} />
        )}
      </div>
    </div>
  );
}

/* ==========================================
   SUB-COMPOSANT : LISTE DES DECKS SAUVEGARDÉS
   ========================================== */
function DecksTab({ onStart }: { onStart: () => void }) {
  const [decks] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={onStart}
        className="w-full py-2.5 text-xs font-bold tracking-wider cursor-pointer"
      >
        CRÉER UN DECK
      </Button>

      {decks.length > 0 ? (
        <div className="flex flex-col gap-2">
          {decks.map((deck, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white dark:bg-simpson-darklight border border-simpson-gray/5 rounded-xl px-4 py-3 shadow-xs hover:border-simpson-orange/30 transition-colors cursor-pointer group"
            >
              <span className="text-xs font-semibold text-simpson-dark dark:text-simpson-white group-hover:text-simpson-orange dark:group-hover:text-simpson-yellow transition-colors">
                {deck}
              </span>
              <span className="text-[11px] font-bold text-simpson-gray bg-simpson-light dark:bg-simpson-dark px-2 py-0.5 rounded-md">
                0 / 10
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-simpson-gray text-center mt-8 font-medium">
          Aucun deck pour le moment
        </p>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPOSANT : PANNEAU DES BOOSTERS
   ========================================== */
function BoostersTab({
  inventory,
  onOpen,
}: {
  inventory: BoosterInventory;
  onOpen: (type: keyof BoosterInventory) => void;
}) {
  const hasBoosters = inventory.booster1 > 0 || inventory.booster2 > 0;
  const boosterList = [
    {
      id: "booster1" as const,
      name: "Booster Standard",
      src: "/booster1.webp",
      quantity: inventory.booster1,
    },
    {
      id: "booster2" as const,
      name: "Booster Premium",
      src: "/booster2.webp",
      quantity: inventory.booster2,
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {hasBoosters ? (
        <div className="w-full flex flex-col gap-6">
          {boosterList.map((booster) => {
            if (booster.quantity === 0) return null;
            return (
              <div
                key={booster.id}
                className="bg-white dark:bg-simpson-darklight border border-simpson-gray/10 p-4 rounded-2xl shadow-xs flex flex-col items-center gap-4 w-full group relative"
              >
                <span className="absolute top-3 right-3 bg-simpson-orange dark:bg-simpson-yellow text-white dark:text-simpson-dark font-bold text-[11px] px-2 py-0.5 rounded-lg shadow-xs">
                  x{booster.quantity}
                </span>
                <div className="w-28 h-40 relative mt-2 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={booster.src}
                    alt={booster.name}
                    fill
                    sizes="112px"
                    priority
                    className="object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
                  />
                </div>
                <div className="w-full text-center space-y-3">
                  <h3 className="font-bold text-simpson-dark dark:text-white text-xs">
                    {booster.name}
                  </h3>
                  <button
                    onClick={() => onOpen(booster.id)}
                    className="w-full h-9 bg-simpson-orange hover:bg-simpson-orange/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    OUVRIR
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-simpson-gray text-center mt-8 font-medium">
          Aucun booster disponible
        </p>
      )}
    </div>
  );
}
