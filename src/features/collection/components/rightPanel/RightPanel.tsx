"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {Deck} from "@/features/collection/schemas/deck.schema";
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
  decks: Deck[];
  isLoadingDecks: boolean;
  maxDecks: number;
  startEditDeck: (deck: Deck) => void;
  handleDeleteDeck: (deckId: string) => void;
  handleSetActiveDeck: (deckId: string) => void;
  onTriggerOpenBooster?: (
    boosterId: string,
    name: string,
    slug: string,
  ) => void;
  boostersRefreshRef?: React.RefObject<(() => void) | null>;
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
  setDeckName,
  handleDeleteDeck,
  handleSetActiveDeck,
  onTriggerOpenBooster,
  boostersRefreshRef,
  isDeckValid,
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
      <div className="sticky top-0 z-20 bg-simpson-white dark:bg-simpson-darklight px-4 pt-4 pb-4 border-b border-simpson-gray/10 dark:border-white/5 flex flex-col items-center gap-3">
        <h2 className="text-center font-bold text-sm text-simpson-dark dark:text-simpson-white">
          {isCreatingDeck
            ? "Mode Création"
            : activeTab === "decks"
              ? "Mes decks"
              : "Mes boosters"}
        </h2>
        <div className="flex bg-simpson-gray/10 dark:bg-black/20 p-1 rounded-xl w-full">
          {(["boosters", "decks"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => !isCreatingDeck && setActiveTab(tab)}
              disabled={isCreatingDeck}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isCreatingDeck
                  ? "text-simpson-gray/40 cursor-not-allowed"
                  : activeTab === tab
                    ? "bg-white dark:bg-simpson-darklight text-simpson-orange dark:text-simpson-yellow shadow-sm cursor-pointer"
                    : "text-simpson-gray cursor-pointer"
              }`}
            >
              {tab === "decks" ? "Decks" : "Boosters"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* Onglet Decks classique */}
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

        {/* Onglet Boosters classique */}
        {activeTab === "boosters" && !isCreatingDeck && (
          <BoostersTab
            activeTab={activeTab}
            onOpen={handleOpenBoosterClick}
            onRefreshRef={boostersRefreshRef}
          />
        )}

        {/* Mode Création / Édition de deck actif */}
        {isCreatingDeck && (
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-5 h-full"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-simpson-gray">
                Nom du Deck
              </label>
              <input
                type="text"
                name="deckName"
                value={formik.values.deckName}
                onChange={(e) => {
                  formik.handleChange(e);
                  setDeckName(e.target.value);
                }}
                onBlur={formik.handleBlur}
                placeholder="Mon super deck..."
                className="w-full px-3 py-2 text-xs border rounded-xl bg-white dark:bg-black/10 border-simpson-gray/20 dark:border-white/5 focus:outline-hidden focus:border-simpson-orange text-simpson-dark dark:text-simpson-white"
              />
              {formik.touched.deckName && formik.errors.deckName && (
                <span className="text-[10px] text-red-500 font-semibold px-1">
                  {formik.errors.deckName}
                </span>
              )}
            </div>

            {/* Barre de progression des cartes */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-simpson-gray uppercase">
                  Cartes ajoutées
                </span>
                <span
                  className={
                    cardCount === maxCards
                      ? "text-emerald-500"
                      : "text-simpson-orange dark:text-simpson-yellow"
                  }
                >
                  {cardCount} / {maxCards}
                </span>
              </div>
              <div className="w-full h-2 bg-simpson-gray/10 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-simpson-orange dark:bg-simpson-yellow transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (cardCount / maxCards) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Actions du formulaire */}
            <div className="mt-auto pt-4 border-t border-simpson-gray/10 dark:border-white/5 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={
                  !isDeckValid || !formik.isValid || formik.isSubmitting
                }
                className="w-full py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Enregistrer le deck
              </Button>
              <button
                type="button"
                onClick={cancelDeckCreation}
                className="w-full py-2 text-xs font-bold text-simpson-gray hover:text-red-500 transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
