"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { DeckData } from "../../hooks/useDeckBuilder";
import DecksTab from "./DecksTab";
import BoostersTab from "./BoostersTab";

type Tab = "boosters" | "decks";

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
  onTriggerOpenBooster?: (
    boosterId: string,
    name: string,
    slug: string,
  ) => void;
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
  onTriggerOpenBooster,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("boosters");

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

  const handleOpenBoosterClick = (
    boosterId: string,
    name: string,
    slug: string,
  ) => {
    if (onTriggerOpenBooster) {
      onTriggerOpenBooster(boosterId, name, slug);
    }
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
              className={`flex items-center border rounded-xl px-3 bg-white dark:bg-black/20 ${
                formik.errors.deckName
                  ? "border-red-500"
                  : "border-simpson-gray/20 dark:border-white/10"
              }`}
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

          {/* 🌟 AJOUT : Compteur textuel de cartes synchronisé avec la barre de progression */}
          <div className="flex justify-between items-center px-1 text-[11px] font-medium text-simpson-gray">
            <span>Progression</span>
            <span
              className={
                cardCount === maxCards
                  ? "text-emerald-500 font-bold"
                  : "font-semibold"
              }
            >
              {cardCount} / {maxCards} cartes
            </span>
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
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase border border-simpson-gray/20 dark:border-white/10 text-simpson-gray! bg-white! shadow-none"
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
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-white dark:bg-simpson-darklight text-simpson-orange dark:text-simpson-yellow shadow-sm"
                    : "text-simpson-gray"
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
          <BoostersTab activeTab={activeTab} onOpen={handleOpenBoosterClick} />
        )}
      </div>
    </div>
  );
}
