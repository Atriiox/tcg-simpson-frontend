"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { FaSearch } from "react-icons/fa";


type FilterData = {
  [group: string]: string[];
};

const filterData: FilterData = {
  Raretés: ["Normal", "Rare", "Légendaire"],
  Types: ["Personnage", "Objets", "Terrains"],
  Séries: ["Série 1", "Série 2"],
};

export default function FilterPanel() {
  const [search, setSearch] = useState<string>("");
  const [checked, setChecked] = useState<Record<string, boolean>>({ Normal: true });

  const toggle = (item: string): void =>
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));

  const reset = (): void => {
    setSearch("");
    setChecked({});
  };

  return (
    <div className="h-full w-64 bg-simpson-light flex flex-col p-7 border-r border-simpson-gray/20 overflow-y-auto">
      
      <h2 className="text-center text-title text-simpson-dark mb-5 tracking-wide uppercase text-[22px] [text-shadow:1px_1px_2px_rgba(0,0,0,0.7)]">
        Filtrer
      </h2>
      <div className="relative mb-5">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-simpson-gray" />
        <input
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white text-simpson-dark text-body placeholder-simpson-gray outline-none shadow-sm"
          placeholder="Nom, famille, aff..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="flex-1">
        {Object.entries(filterData).map(([group, items]: [string, string[]]) => (
          <div key={group} className="mb-5">
            <p className="text-body font-medium text-simpson-gray mb-2">{group}</p>
            {items.map((item: string) => (
              <label
                key={item}
                className="flex items-center gap-3 cursor-pointer mb-2 select-none"
                onClick={() => toggle(item)}
              >
                <span
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${checked[item]
                      ? "bg-simpson-orange border-simpson-orange"
                      : "bg-white border-gray-300"
                    }`}
                >
                  {checked[item] && (
                    <svg viewBox="0 0 12 10" fill="none" className="w-3 h-2.5">
                      <path
                        d="M1 5l3.5 3.5L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-medium text-simpson-dark">{item}</span>
              </label>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-simpson-gray/20">
        <Button className="w-24 flex-1">Valider</Button>
        <Button className="flex-1 w-24 bg-white !text-simpson-dark hover:bg-gray-100">Annuler</Button>
      </div>

    </div>
  );
}
