"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { BiSave, BiX, BiCheckCircle, BiPencil, BiTrash, BiStar, BiSolidStar } from "react-icons/bi";
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
  handleDeleteDeck,
  handleSetActiveDeck,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("decks");
  const [boostersOwned, setBoostersOwned] = useState<BoosterInventory>({
    booster1: 1,
    booster2: 3,
  });
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (deckToDelete) {
      await handleDeleteDeck(deckToDelete);
      setDeckToDelete(null);
    }
  };

  // 🎯 Contrat Zod aligné avec ta méthode d'authentification
  const deckSchema = z
    .object({
      deckName: z
        .string()
        .min(1, "Le nom du deck est obligatoire") // Remplace efficacement required_error
        .min(3, "Le nom doit contenir au moins 3 caractères")
        .max(25, "Le nom est trop long"),
    })
    .refine(() => decks.length < maxDecks, {
      message: "Limite de 3 decks atteinte !",
      path: ["deckName"],
    });
  type DeckFormValues = z.infer<typeof deckSchema>;

  // 🎯 Configuration Formik locale
  const formik = useFormik<DeckFormValues>({
    initialValues: { deckName: "" },
    validationSchema: toFormikValidationSchema(deckSchema),
    enableReinitialize: true, // Permet de reset les valeurs si isCreatingDeck change
    onSubmit: async (values, { setFieldError, setSubmitting, resetForm }) => {
      try {
        await handleSaveDeck(values.deckName);
        resetForm();
      } catch (err: any) {
        setFieldError("deckName", err.message || "Erreur de sauvegarde");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOpenBooster = (type: keyof BoosterInventory) => {
    if (boostersOwned[type] <= 0) return;
    setBoostersOwned((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    alert(
      `Ouverture du ${type === "booster1" ? "Booster Classique" : "Booster Spécial"} ! 🍩`,
    );
  };

  const handleCancel = () => {
    formik.resetForm();
    cancelDeckCreation();
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

          {/* Saisie Nom du Deck */}
          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor="deckName"
              className="text-[11px] font-medium text-simpson-gray pl-1"
            >
              Nom du deck
            </label>
            <div
              className={`flex items-center border rounded-xl px-3 bg-white dark:bg-black/20 ${
                formik.touched.deckName && formik.errors.deckName
                  ? "border-red-500"
                  : "border-simpson-gray/15 dark:border-white/5 focus-within:border-simpson-orange dark:focus-within:border-simpson-yellow"
              }`}
            >
              <input
                id="deckName"
                type="text"
                maxLength={25}
                placeholder="Ex: Mon deck principal"
                className="flex-1 border-none bg-transparent outline-none py-2 text-xs font-semibold text-simpson-dark dark:text-simpson-white placeholder-simpson-gray/40"
                {...formik.getFieldProps("deckName")}
              />
            </div>
            {/* 🎯 h-5 fixe pour bloquer l'espace et éviter les sursauts visuels de l'UI */}
            <div className="h-5 mt-0.5 flex items-center">
              {formik.touched.deckName && formik.errors.deckName && (
                <p className="text-red-500 text-[10px] font-bold pl-1">
                  {formik.errors.deckName}
                </p>
              )}
            </div>
          </div>

          {/* Jauge de progression des cartes */}
          <div className="w-full bg-simpson-gray/10 dark:bg-black/20 rounded-full h-1.5 overflow-hidden relative border border-simpson-gray/5">
            <div
              className={`h-full transition-all duration-300 ${
                cardCount === maxCards
                  ? "bg-emerald-500"
                  : "bg-simpson-orange dark:bg-simpson-yellow"
              }`}
              style={{ width: `${(cardCount / maxCards) * 100}%` }}
            />
          </div>

          {/* Actions de Soumission */}
          <div className="flex flex-col gap-2 w-full">
            <Button
              onClick={() => formik.handleSubmit()}
              disabled={
                !formik.isValid || cardCount !== maxCards || formik.isSubmitting
              }
              className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 h-10 ${
                cardCount !== maxCards || !formik.isValid
                  ? "opacity-30 cursor-not-allowed bg-simpson-gray text-white border-none"
                  : ""
              }`}
            >
              <BiSave size={16} />{" "}
              {formik.isSubmitting ? "SAUVEGARDE..." : "SAUVEGARDER"}
            </Button>

            <Button
              type="button"
              onClick={handleCancel}
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
          <DecksTab
            onStart={startNewDeck}
            decks={decks}
            isLoading={isLoadingDecks}
            maxDecks={maxDecks}
            onEdit={startEditDeck}
            onDelete={(id) => setDeckToDelete(id)}
            onSetActive={handleSetActiveDeck}
          />
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

      <Modal isOpen={!!deckToDelete} onClose={() => setDeckToDelete(null)}>
        <div className="flex flex-col items-center p-6 gap-6 w-80">
          <div className="bg-red-500/10 p-4 rounded-full text-red-500">
            <BiTrash size={32} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-black text-xl text-simpson-dark dark:text-white uppercase">Supprimer ce deck ?</h3>
            <p className="text-sm font-medium text-simpson-gray">
              Cette action est irréversible. Le deck sera perdu à tout jamais !
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <Button
              onClick={() => setDeckToDelete(null)}
              className="flex-1 bg-transparent border border-simpson-gray/20 text-simpson-gray hover:bg-simpson-gray/5 !shadow-none"
            >
              ANNULER
            </Button>
            <Button
              onClick={confirmDelete}
              className="flex-1 bg-red-500 border-none hover:bg-red-600 text-white !shadow-none"
            >
              SUPPRIMER
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ==========================================
   SUB-COMPOSANT : LISTE DES DECKS DYNAMIQUE
   ========================================== */
interface DecksTabProps {
  onStart: () => void;
  decks: DeckData[];
  isLoading: boolean;
  maxDecks: number;
  onEdit: (deck: DeckData) => void;
  onDelete: (deckId: string) => void;
  onSetActive: (deckId: string) => void;
}

function DecksTab({ onStart, decks, isLoading, maxDecks, onEdit, onDelete, onSetActive }: DecksTabProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-6 h-6 border-2 border-simpson-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLimitReached = decks.length >= maxDecks;

  return (
    <div className="flex flex-col gap-4">
      {!isLimitReached && (
        <div className="w-full relative group">
          <Button
            onClick={onStart}
            className="w-full py-2.5 text-xs font-bold tracking-wider cursor-pointer"
          >
            CRÉER UN DECK
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between mt-1 px-1">
        <span className="text-[11px] font-bold text-simpson-gray uppercase tracking-wider">
          Vos decks
        </span>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
          isLimitReached 
            ? "text-red-500 bg-red-500/10" 
            : "text-simpson-orange bg-simpson-orange/10 dark:text-simpson-yellow dark:bg-simpson-yellow/10"
        }`}>
          {decks.length} / {maxDecks} DECKS
        </div>
      </div>

      {decks.length > 0 ? (
        <div className="flex flex-col gap-2">
          {decks.map((deck) => (
            <div
              key={deck._id}
              className={`flex flex-col bg-white dark:bg-simpson-darklight border rounded-xl px-4 py-3 shadow-xs transition-colors group ${
                deck.isActive
                  ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                  : "border-simpson-gray/5 hover:border-simpson-orange/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-simpson-dark dark:text-simpson-white transition-colors">
                    {deck.name}
                  </span>
                  {deck.isActive && (
                    <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">
                      Actif
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(deck._id || (deck as any).id)}
                  className="p-1.5 rounded-md text-simpson-gray hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <BiTrash size={16} />
                </button>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-simpson-gray/10 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => !deck.isActive && onSetActive(deck._id || (deck as any).id)}
                  disabled={deck.isActive}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    deck.isActive 
                      ? "text-emerald-500 bg-emerald-500/10 cursor-default" 
                      : "text-simpson-gray hover:text-simpson-orange hover:bg-simpson-orange/10 dark:hover:text-simpson-yellow dark:hover:bg-simpson-yellow/10 cursor-pointer"
                  }`}
                >
                  {deck.isActive ? (
                    <>
                      Deck actif
                    </>
                  ) : (
                    <>
                      Activer le deck
                    </>
                  )}
                </button>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(deck)}
                    className="p-1.5 rounded-md text-simpson-gray hover:text-simpson-orange hover:bg-simpson-orange/10 dark:hover:text-simpson-yellow dark:hover:bg-simpson-yellow/10 transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <BiPencil size={14} />
                  </button>
                </div>
              </div>
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
