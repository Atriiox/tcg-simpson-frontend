"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Tab = "boosters" | "decks";

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("decks");

  return (
<div className="flex flex-col min-h-full w-64 bg-simpson-white border-l border-simpson-gray/20 shadow-md">
      {/* Tabs */}
      <div className="flex border-b border-simpson-gray/20">
        {(["boosters", "decks"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-medium font-semibold capitalize transition-all duration-200 cursor-pointer
              ${activeTab === tab
                ? "text-simpson-orange border-b-2 border-simpson-orange bg-white"
                : "text-simpson-gray hover:text-simpson-dark"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "decks" && <DecksTab />}
        {activeTab === "boosters" && <BoostersTab />}
      </div>
    </div>
  );
}

function DecksTab() {
  const [decks, setDecks] = useState<string[]>([]);

  const createDeck = () => {
    setDecks((prev) => [...prev, `Deck ${prev.length + 1}`]);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-simpson-dark text-center tracking-wide uppercase text-[22px] [text-shadow:1px_1px_2px_rgba(0,0,0,0.7)]">
        Decks
      </h2>

  <Button onClick={createDeck} className="w-full">
  Créer un deck
</Button>

      {decks.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {decks.map((deck, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm"
            >
              <span className="text-medium text-simpson-dark font-medium">{deck}</span>
              <span className="text-body text-simpson-gray">0 cartes</span>
            </div>
          ))}
        </div>
      )}

      {decks.length === 0 && (
        <p className="text-body text-simpson-gray text-center mt-8">
          Aucun deck créé pour l'instant
        </p>
      )}
    </div>
  );
}

function BoostersTab() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-simpson-dark text-center tracking-wide uppercase text-[22px] [text-shadow:1px_1px_2px_rgba(0,0,0,0.7)]">
        Boosters
      </h2>
      <p className="text-body text-simpson-gray text-center mt-8">
        Aucun booster disponible
      </p>
    </div>
  );
}
