"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Filters } from "@/features/collection/hooks/useFilter";
import { FaSearch } from "react-icons/fa";

type FilterData = {
  [group: string]: string[];
};

const filterData: FilterData = {
  Raretés: ["Normal", "Rare", "Légendaire"],
  Types: ["Personnage", "Objet", "Terrain"],
  Séries: ["Série 1", "Série 2"],
};

interface FilterPanelProps {
  filters: Filters;
  handleSelect: (group: string, value: string) => void;
  resetFilters: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onToggleShowAll?: (showAll: boolean) => void;
}

export default function FilterPanel({
  filters,
  handleSelect,
  resetFilters,
  searchTerm,
  onSearchChange,
  onToggleShowAll,
}: FilterPanelProps) {
  const [showAllCards, setShowAllCards] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [checked, setChecked] = useState<Record<string, boolean>>({
    Normal: true,
  });

  // Fonction simplifiée et corrigée pour vérifier si un élément est sélectionné
const isChecked = (group: string, item: string): boolean => {
  let key: keyof Filters;

  // Mapping strict qui évite les pièges des accents et des pluriels
  if (group === "Raretés") {
    key = "rarity";
  } else if (group === "Types") {
    key = "type";
  } else if (group === "Séries") {
    key = "serie";
  } else {
    return false; // Si le groupe est inconnu, la case n'est pas cochée
  }

  // On compare proprement la valeur dans l'état global avec l'élément courant
  return filters[key]?.includes(item) ?? false;
};

// Gère le clic sur le switch à slide
  const handleToggleSlide = () => {
    const nextState = !showAllCards;
    setShowAllCards(nextState);
    if (onToggleShowAll) {
      onToggleShowAll(nextState);
    }
  };

  


  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-center text-subtitle font-bold mb-6 tracking-wide text-simpson-dark dark:text-simpson-white">
        Filtrer
      </h2>

      {/* Barre de Recherche Épurée */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-simpson-gray dark:text-simpson-gray" />
        <input
          className="w-full pl-9 pr-3 py-2 text-body rounded-xl bg-white dark:bg-simpson-darklight border border-transparent dark:border-simpson-dark text-simpson-dark dark:text-simpson-white placeholder-simpson-gray/60 outline-none shadow-xs focus:border-simpson-orange dark:focus:border-simpson-yellow transition-colors"
          placeholder="Nom, famille, aff..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* 🎯 NOUVEAU : Barre à Slide (Identique au style de ton ProfileForm) */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-500 dark:border-simpson-dark">
        <span className="text-body font-medium text-simpson-dark dark:text-simpson-white">
          Voir toutes les cartes:
        </span>
        <button
          type="button"
          onClick={handleToggleSlide}
          className="group relative w-13 h-7 rounded-full p-0.5 transition-all duration-300 outline-none cursor-pointer bg-gray-200 dark:bg-simpson-darklight border border-gray-200 dark:border-simpson-dark shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] shrink-0"
          aria-label="Afficher toutes les cartes existantes"
        >
          <div
            className={`relative w-full h-full flex items-center justify-between ${
              showAllCards ? "pl-0 pr-1.5" : "pl-0.5 pr-1"
            }`}
          >
            {/* La bille qui glisse */}
            <div
              className={`w-5 h-5 rounded-full bg-linear-to-b from-[#3b3a4e] to-[#272733] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 z-10 ${
                showAllCards ? "translate-x-6" : "translate-x-0"
              }`}
            />
            {/* La petite LED témoin (Bleu Simpsons si actif, Orange si inactif) */}
            <div
              className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                showAllCards
                  ? "border-simpson-lightblue bg-simpson-lightblue/20 shadow-[0_0_5px] shadow-simpson-lightblue -translate-x-6"
                  : "border-simpson-orange bg-simpson-orange/20 shadow-[0_0_5px] shadow-simpson-orange translate-x-0"
              }`}
            />
          </div>
        </button>
      </div>


      {/* Groupes de filtres */}
      <div className="flex-1 space-y-6">
        {Object.entries(filterData).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs font-bold uppercase tracking-wider text-simpson-gray mb-3">
              {group}
            </p>
            <div className="space-y-2">
              {items.map((item) => {
                const active = isChecked(group, item);
                return (
                  <div
                    key={item}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                    onClick={() => {
                      handleSelect(group, item);
                    }}
                  >
                    <span
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        active
                          ? "bg-simpson-orange border-simpson-orange dark:bg-simpson-yellow dark:border-simpson-yellow"
                          : "bg-white dark:bg-simpson-darklight border-gray-200 dark:border-simpson-dark group-hover:border-simpson-orange dark:group-hover:border-simpson-yellow"
                      }`}
                    >
                      {active && (
                        <svg
                          viewBox="0 0 12 10"
                          fill="none"
                          className="w-3 h-2.5 stroke-white dark:stroke-simpson-dark"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 5l3.5 3.5L11 1" />
                        </svg>
                      )}
                    </span>
                    <span className="text-body font-medium text-simpson-dark/90 dark:text-simpson-white/90 transition-colors group-hover:text-simpson-orange dark:group-hover:text-simpson-yellow">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions de pied de page */}
      <div className="flex gap-2 pt-4 border-t border-simpson-gray/10 dark:border-simpson-darklight/40">
        <Button
          onClick={resetFilters}
          className="flex-1 py-2 text-sm font-bold cursor-pointer"
        >
          Réinitaliser les filtres
        </Button>
      </div>
    </div>
  );
}
