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
  Types: ["Personnage", "Objets", "Terrains"],
  Séries: ["Série 1", "Série 2"],
};

interface FilterPanelProps {
  filters: Filters;
  handleSelect: (group: string, value: string) => void;
  resetFilters: () => void;
  onClose?: () => void;
}

export default function FilterPanel({
  filters,
  handleSelect,
  resetFilters,
  onClose,
}: FilterPanelProps) {
  const [search, setSearch] = useState<string>("");
  const [checked, setChecked] = useState<Record<string, boolean>>({
    Normal: true,
  });

  // Fonction simplifiée et corrigée pour vérifier si un élément est sélectionné
const isChecked = (group: string, item: string): boolean => {
  const groupLower = group.toLowerCase();
  let key: keyof Filters;

  // Mapping strict qui évite les pièges des accents et des pluriels
  if (groupLower.includes("rare")) {
    key = "rarity";
  } else if (groupLower.includes("type")) {
    key = "type";
  } else if (groupLower.includes("seri")) {
    key = "serie";
  } else {
    return false; // Si le groupe est inconnu, la case n'est pas cochée
  }

  // On compare proprement la valeur dans l'état global avec l'élément courant
  return filters[key]?.includes(item) ?? false;
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
          onClick={onClose}
          className="flex-1 py-2 text-sm font-bold cursor-pointer"
        >
          Valider
        </Button>
        <Button
          onClick={resetFilters}
          className="flex-1 py-2 text-sm font-bold !bg-transparent border border-simpson-gray/20 dark:border-simpson-dark !text-simpson-dark dark:text-simpson-white hover:!bg-simpson-light dark:hover:!bg-simpson-darklight cursor-pointer"
        >
          Annuler
        </Button>
      </div>
    </div>
  );
}
