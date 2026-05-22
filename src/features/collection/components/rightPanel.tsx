"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Tab = "boosters" | "decks";

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("decks");

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* 🎯 Onglets Modernes Fluides adaptés au blanc cassé */}
      <div className="flex p-1.5 bg-white dark:bg-simpson-darklight rounded-xl mx-4 mt-4 gap-1">
        {(["boosters", "decks"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer
              ${activeTab === tab
                ? "bg-simpson-white dark:bg-simpson-dark text-simpson-orange dark:text-simpson-yellow shadow-xs"
                : "text-simpson-gray hover:text-simpson-dark dark:hover:text-simpson-white"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Zone de Contenu */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "decks" && <DecksTab />}
        {activeTab === "boosters" && <BoostersTab />}
      </div>
    </div>
  );
}

function DecksTab() {
  const [decks, setDecks] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-subtitle font-bold mb-2 tracking-wide text-simpson-dark dark:text-simpson-white text-sm">
        Mes Decks
      </h2>

      <Button 
        onClick={() => setDecks((p) => [...p, `Deck ${p.length + 1}`])} 
        className="w-full py-2.5 text-sm font-bold cursor-pointer"
      >
        Créer un deck
      </Button>

      {decks.length > 0 ? (
        <div className="flex flex-col gap-2">
          {decks.map((deck, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white dark:bg-simpson-darklight border border-simpson-gray/5 dark:border-transparent rounded-xl px-4 py-3 shadow-xs hover:border-simpson-orange/30 transition-colors cursor-pointer group"
            >
              <span className="text-body font-semibold text-simpson-dark dark:text-simpson-white group-hover:text-simpson-orange dark:group-hover:text-simpson-yellow transition-colors">
                {deck}
              </span>
              <span className="text-xs font-bold text-simpson-gray bg-simpson-light dark:bg-simpson-dark px-2 py-0.5 rounded-md">
                0 / 50
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-body text-simpson-gray text-center mt-8 font-medium">
          Aucun deck pour l'instant
        </p>
      )}
    </div>
  );
}

function BoostersTab() {
  return (
    <div className="flex flex-col items-center justify-center pt-4">
      <h2 className="text-center text-subtitle font-bold mb-6 tracking-wide text-simpson-dark dark:text-simpson-white text-sm w-full">
        Mes Boosters
      </h2>
      <p className="text-body text-simpson-gray text-center mt-4 font-medium">
        Aucun booster disponible
      </p>
    </div>
  );
}