"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

type Tab = "boosters" | "decks";

interface BoosterInventory {
  booster1: number;
  booster2: number;
}

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("decks");
  
  // 🎯 État pour gérer la quantité de boosters possédés
  const [boostersOwned, setBoostersOwned] = useState<BoosterInventory>({
    booster1: 1,
    booster2: 3,
  });

  const handleOpenBooster = (type: keyof BoosterInventory) => {
    if (boostersOwned[type] <= 0) return;

    setBoostersOwned((prev) => ({
      ...prev,
      [type]: prev[type] - 1,
    }));

    alert(`Ouverture du ${type === "booster1" ? "Booster Classique" : "Booster Spécial"} ! 🍩`);
  };

  return (
    <div className="h-full flex flex-col bg-transparent relative select-none">
      
      {/* 📌 BLOC EN-TÊTE STICKY AVEC LE SÉLECTEUR "GAMING CHIC" DE TA BOUTIQUE */}
      <div className="sticky top-0 z-20 bg-simpson-white dark:bg-simpson-darklight px-4 pt-4 pb-4 border-b border-simpson-gray/5 dark:border-transparent flex flex-col items-center gap-3 shrink-0">
        
        {/* Titre Principal Dynamique */}
        <h2 className="text-center text-subtitle font-black tracking-widest text-simpson-dark dark:text-simpson-white uppercase text-sm">
          {activeTab === "decks" ? "Mes Decks" : "Mes Boosters"}
        </h2>

        {/* 🎯 LE MÊME TOGGLE QUE TA BOUTIQUE */}
        <div className="flex bg-simpson-gray/10 dark:bg-white/5 p-1 rounded-xl border border-simpson-gray/5 dark:border-white/5 w-full">
          {(["boosters", "decks"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-medium uppercase tracking-wider rounded-lg transition-all duration-200 font-bold cursor-pointer text-xs
                ${
                  activeTab === tab
                    ? "bg-white dark:bg-simpson-darklight text-simpson-orange dark:text-simpson-yellow shadow-sm"
                    : "text-simpson-gray hover:text-simpson-dark dark:hover:text-simpson-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Zone de Contenu Défilante */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "decks" && <DecksTab />}
        {activeTab === "boosters" && (
          <BoostersTab 
            inventory={boostersOwned} 
            onOpen={handleOpenBooster} 
          />
        )}
      </div>
    </div>
  );
}

/* ==========================================
   🎯 ONGLET DECKS
   ========================================== */
function DecksTab() {
  const [decks, setDecks] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
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

/* ==========================================
   🎯 ONGLET BOOSTERS
   ========================================== */
interface BoostersTabProps {
  inventory: BoosterInventory;
  onOpen: (type: keyof BoosterInventory) => void;
}

function BoostersTab({ inventory, onOpen }: BoostersTabProps) {
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
                className="bg-white dark:bg-simpson-darklight border border-simpson-gray/10 dark:border-simpson-dark/20 p-4 rounded-2xl shadow-xs flex flex-col items-center gap-4 w-full group relative"
              >
                {/* Badge quantité (Top Right) */}
                <span className="absolute top-3 right-3 bg-simpson-orange dark:bg-simpson-yellow text-white dark:text-simpson-dark font-black text-xs px-2.5 py-1 rounded-lg shadow-xs select-none">
                  x{booster.quantity}
                </span>

                {/* Image du Booster avec effet au survol */}
                <div className="w-28 h-40 relative mt-2 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                  <Image
                    src={booster.src}
                    alt={booster.name}
                    fill
                    sizes="112px"
                    priority
                    className="object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
                  />
                </div>

                {/* Nom et Action */}
                <div className="w-full text-center space-y-3">
                  <h3 className="font-bold text-text dark:text-white text-medium">
                    {booster.name}
                  </h3>
                  
                  <button
                    onClick={() => onOpen(booster.id)}
                    className="w-full h-10 bg-simpson-orange hover:bg-simpson-orange/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-98 cursor-pointer"
                  >
                    Ouvrir le booster
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-body text-simpson-gray text-center mt-8 font-medium">
          Aucun booster disponible
        </p>
      )}
    </div>
  );
}