"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { DeckData } from "../hooks/useDeckBuilder";

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
  handleSaveDeck: (name: string) => Promise<void>;
  decks: DeckData[];
  isLoadingDecks: boolean;
  maxDecks: number;
  startEditDeck: (deck: DeckData) => void;
  handleDeleteDeck: (deckId: string) => void;
  handleSetActiveDeck: (deckId: string) => void;
}

export default function RightPanel({
  isCreatingDeck,
  cardCount,
  maxCards,
  startNewDeck,
  cancelDeckCreation,
  handleSaveDeck,
  decks,
  isLoadingDecks,
  maxDecks,
  startEditDeck,
  deckName,
  handleDeleteDeck,
  handleSetActiveDeck,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("decks");
  const [boostersOwned, setBoostersOwned] = useState<BoosterInventory>({
    booster1: 1,
    booster2: 3,
  });

  const deckSchema = z.object({
    deckName: z
      .string()
      .min(1, "Obligatoire")
      .min(3, "Trop court")
      .max(25, "Trop long"),
  });

  type DeckFormValues = z.infer<typeof deckSchema>;

  const formik = useFormik<DeckFormValues>({
    initialValues: { deckName: "" },
    validationSchema: toFormikValidationSchema(deckSchema),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSaveDeck(values.deckName);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isCreatingDeck && deckName) formik.setFieldValue("deckName", deckName);
  }, [isCreatingDeck, deckName]);

  const handleOpenBooster = (type: keyof BoosterInventory) => {
    if (boostersOwned[type] <= 0) return;
    setBoostersOwned((prev) => ({ ...prev, [type]: prev[type] - 1 }));
  };

  return (
    <div className="h-full flex flex-col bg-transparent relative select-none">
      {isCreatingDeck ? (
        <div className="sticky top-0 z-20 bg-simpson-white dark:bg-simpson-darklight px-4 pt-4 pb-4 border-b border-simpson-gray/10 dark:border-white/5 flex flex-col gap-4">
          <h2 className="text-center text-[10px] font-bold tracking-widest text-simpson-orange dark:text-simpson-yellow uppercase">
            Création en cours
          </h2>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[11px] font-medium text-simpson-gray pl-1">
              Nom du deck
            </label>
            <div
              className={`flex items-center border rounded-xl px-3 bg-white dark:bg-black/20 ${formik.errors.deckName ? "border-red-500" : "border-simpson-gray/20 dark:border-white/10"}`}
            >
              <input
                id="deckName"
                type="text"
                maxLength={25}
                className="flex-1 bg-transparent outline-none py-2 text-xs font-semibold text-simpson-dark dark:text-simpson-white"
                {...formik.getFieldProps("deckName")}
              />
            </div>
          </div>
          <div className="w-full bg-simpson-gray/10 dark:bg-black/30 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-simpson-orange dark:bg-simpson-yellow transition-all duration-300"
              style={{ width: `${(cardCount / maxCards) * 100}%` }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => formik.handleSubmit()}
              disabled={!formik.isValid || cardCount !== maxCards}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase"
            >
              Sauvegarder
            </Button>
            <Button
              onClick={cancelDeckCreation}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase bg-transparent border border-simpson-gray/20 dark:border-white/10 !text-simpson-gray shadow-none"
            >
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 z-20 bg-simpson-white dark:bg-simpson-darklight px-4 pt-4 pb-4 border-b border-simpson-gray/10 dark:border-white/5 flex flex-col items-center gap-3">
          <h2 className="text-center font-bold text-sm text-simpson-dark dark:text-simpson-white">
            {activeTab === "decks" ? "Mes decks" : "Mes boosters"}
          </h2>
          <div className="flex bg-simpson-gray/10 dark:bg-black/20 p-1 rounded-xl w-full">
            {(["boosters", "decks"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? "bg-white dark:bg-simpson-darklight text-simpson-orange dark:text-simpson-yellow shadow-sm" : "text-simpson-gray"}`}
              >
                {tab === "decks" ? "Decks" : "Boosters"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "decks" && !isCreatingDeck && (
          <DecksTab
            onStart={startNewDeck}
            decks={decks}
            isLoading={isLoadingDecks}
            maxDecks={maxDecks}
            onEdit={startEditDeck}
            onDelete={handleDeleteDeck}
            onSetActive={handleSetActiveDeck}
          />
        )}
        {activeTab === "boosters" && (
          <BoostersTab inventory={boostersOwned} onOpen={handleOpenBooster} />
        )}
      </div>
    </div>
  );
}

function DecksTab({
  onStart,
  decks,
  isLoading,
  maxDecks,
  onEdit,
  onDelete,
  onSetActive,
}: any) {
  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-simpson-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  const isLimitReached = decks.length >= maxDecks;
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-3">
        {decks.map((deck: DeckData) => (
          <div
            key={deck._id}
            className={`flex flex-col bg-white dark:bg-simpson-darklight border rounded-xl px-4 py-3 transition-all ${deck.isActive ? "border-emerald-500/50 bg-emerald-500/3" : "border-simpson-gray/10 dark:border-white/5"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-simpson-dark dark:text-simpson-white">
                {deck.name}
              </span>
              <button
                onClick={() => onDelete(deck._id)}
                className="p-1.5 text-simpson-gray hover:text-red-500 cursor-pointer"
              >
                <BiTrash size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-simpson-gray/10 dark:border-white/5">
              <button
                onClick={() => !deck.isActive && onSetActive(deck._id)}
                disabled={deck.isActive}
                className={`flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${deck.isActive ? "text-emerald-600 bg-emerald-500/10" : "text-simpson-orange dark:text-simpson-yellow bg-white dark:bg-black/20 border border-simpson-orange dark:border-simpson-yellow hover:bg-simpson-orange/10 cursor-pointer"}`}
              >
                {deck.isActive ? "Deck actif" : "Activer ce deck"}
              </button>
              <button
                onClick={() => onEdit(deck)}
                className="p-1.5 text-simpson-gray hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer"
              >
                <BiPencil size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-simpson-gray/10 dark:border-white/5">
        <div className="flex justify-center items-center px-1">
          <div
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isLimitReached ? "text-red-500 bg-red-500/10" : "text-simpson-orange dark:text-simpson-yellow bg-simpson-orange/10 dark:bg-simpson-yellow/10"}`}
          >
            {decks.length} / {maxDecks} decks
          </div>
        </div>
        {!isLimitReached && (
          <Button
            onClick={onStart}
            className="w-full py-2.5 text-xs font-bold cursor-pointer"
          >
            Créer un deck
          </Button>
        )}
      </div>
    </div>
  );
}

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
