"use client";

import { useState } from "react";

interface SerieStats {
  name: string;
  legendary: { owned: number; total: number };
  rare: { owned: number; total: number };
  common: { owned: number; total: number };
  uniqueCards: number;
  totalInSerie: number;
}

interface Stats {
  bySerie: SerieStats[];
  uniqueCards: number;
  totalCards: number;
}

export default function ProfileStats({ stats }: { stats: Stats }) {
  const [activeSerie, setActiveSerie] = useState(0);
  const serie = stats.bySerie[activeSerie];

  if (!serie) return null;

  return (
    <div className="flex flex-col gap-4 bg-black/2 dark:bg-white/2 rounded-2xl p-4 border border-black/5 dark:border-white/5">
      <h4 className="text-xs font-bold text-black dark:text-white">Statistiques de collection</h4>

      {stats.bySerie.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {stats.bySerie.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActiveSerie(i)}
              className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${activeSerie === i
                  ? "bg-simpson-orange text-white dark:bg-simpson-yellow dark:text-simpson-dark"
                  : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10"
                }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-sm bg-white dark:bg-simpson-darklight/40 px-3 py-2 rounded-xl border border-black/3 dark:border-white/2">
          <span className="font-bold text-amber-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />Légendaire
          </span>
          <span className="font-extrabold text-xs">
            {serie.legendary.owned} <span className="opacity-40 font-normal">/ {serie.legendary.total}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-sm bg-white dark:bg-simpson-darklight/40 px-3 py-2 rounded-xl border border-black/3 dark:border-white/2">
          <span className="font-bold text-blue-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />Rare
          </span>
          <span className="font-extrabold text-xs">
            {serie.rare.owned} <span className="opacity-40 font-normal">/ {serie.rare.total}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-sm bg-white dark:bg-simpson-darklight/40 px-3 py-2 rounded-xl border border-black/3 dark:border-white/2">
          <span className="font-bold opacity-70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />Commune
          </span>
          <span className="font-extrabold text-xs">
            {serie.common.owned} <span className="opacity-40 font-normal">/ {serie.common.total}</span>
          </span>
        </div>
      </div>

      <div className="h-px bg-black/5 dark:bg-white/5 my-1" />

      <div className="grid grid-cols-3 gap-2 px-1 py-0.5">
        {stats.bySerie.map((s) => (
          <div key={s.name} className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-black/60 dark:text-white/60 truncate w-full">{s.name}</span>
            <span className="text-sm font-black">
              {s.uniqueCards}
              <span className="text-[10px] font-normal opacity-40"> / {s.totalInSerie}</span>
            </span>
          </div>
        ))}

        <div className="flex flex-col items-center text-center border-l border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-black dark:text-white">Total</span>
          <span className="text-sm font-black">
            {stats.uniqueCards}
            <span className="text-[10px] font-normal opacity-40"> / {stats.bySerie.reduce((acc, s) => acc + s.totalInSerie, 0)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}