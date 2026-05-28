"use client";

import { BiPencil, BiTrash } from "react-icons/bi";
import Button from "@/components/ui/Button";
import { Deck } from "@/features/collection/schemas/deck.schema";

interface DecksTabProps {
  onStart: () => void;
  decks: Deck[];
  isLoading: boolean;
  maxDecks: number;
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: string) => void;
  onSetActive: (deckId: string) => void;
}

export default function DecksTab({
  onStart,
  decks,
  isLoading,
  maxDecks,
  onEdit,
  onDelete,
  onSetActive,
}: DecksTabProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-simpson-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLimitReached = decks.length >= maxDecks;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-3">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className={`flex flex-col bg-white dark:bg-simpson-darklight border rounded-xl px-4 py-3 transition-all ${
              deck.isActive ? "border-emerald-500/50 bg-emerald-500/3" : "border-simpson-gray/10 dark:border-white/5"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-simpson-dark dark:text-simpson-white">
                {deck.name}
              </span>
              <button
                onClick={() => onDelete(deck.id)}
                className="p-1.5 text-simpson-gray hover:text-red-500 cursor-pointer"
              >
                <BiTrash size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-simpson-gray/10 dark:border-white/5">
              <button
                onClick={() => !deck.isActive && onSetActive(deck.id)}
                disabled={deck.isActive}
                className={`flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  deck.isActive
                    ? "text-emerald-600 bg-emerald-500/10"
                    : "text-simpson-orange dark:text-simpson-yellow bg-white dark:bg-black/20 border border-simpson-orange dark:border-simpson-yellow hover:bg-simpson-orange/10 cursor-pointer"
                }`}
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
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isLimitReached ? "text-red-500 bg-red-500/10" : "text-simpson-orange dark:text-simpson-yellow bg-simpson-orange/10 dark:bg-simpson-yellow/10"
            }`}
          >
            {decks.length} / {maxDecks} decks
          </div>
        </div>
        {!isLimitReached && (
          <Button onClick={onStart} className="w-full py-2.5 text-xs font-bold cursor-pointer">
            Créer un deck
          </Button>
        )}
      </div>
    </div>
  );
}