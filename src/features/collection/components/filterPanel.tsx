"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useFilter, Filters } from "@/features/collection/hooks/useFilter"
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
  onFilter: (filters: Filters) => void;
  onClose: () => void;
}

export default function FilterPanel({ onFilter, onClose }: FilterPanelProps) {
  const [search, setSearch] = useState<string>("");
  const [checked, setChecked] = useState<Record<string, boolean>>({
    Normal: true,
  });
  const { filters, handleSelect, resetFilters } = useFilter();

  const toggle = (item: string): void =>
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));

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
              {items.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                  onClick={() => {toggle(item) ; handleSelect(group, item)} }
                >
                  <span
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      checked[item]
                        ? "bg-simpson-orange border-simpson-orange dark:bg-simpson-yellow dark:border-simpson-yellow"
                        : "bg-white dark:bg-simpson-darklight border-gray-200 dark:border-simpson-dark group-hover:border-simpson-orange dark:group-hover:border-simpson-yellow"
                    }`}
                  >
                    {checked[item] && (
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
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions de pied de page */}
      <div className="flex gap-2 pt-4 border-t border-simpson-gray/10 dark:border-simpson-darklight/40">
        <Button className="flex-1 py-2 text-sm font-bold cursor-pointer">
          Valider
        </Button>
        <Button className="flex-1 py-2 text-sm font-bold !bg-transparent border border-simpson-gray/20 dark:border-simpson-dark !text-simpson-dark dark:text-simpson-white hover:!bg-simpson-light dark:hover:!bg-simpson-darklight cursor-pointer">
          Annuler
        </Button>
      </div>
    </div>
  );
}
