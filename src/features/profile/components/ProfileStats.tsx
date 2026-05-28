"use client";

interface Stats {
  legendary: number;
  legendaryTotal: number;
  rare: number;
  rareTotal: number;
  common: number;
  commonTotal: number;
  uniqueCards: number;
  totalCards: number;
}

interface ProfileStatsProps {
  stats: Stats;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="flex flex-col gap-4 bg-black/2 dark:bg-white/2 rounded-2xl p-4 border border-black/5 dark:border-white/5">
      <h4 className="text-xs font-bold text-black dark:text-white">Statistiques de collection</h4>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-sm bg-white dark:bg-simpson-darklight/40 px-3 py-2 rounded-xl border border-black/3 dark:border-white/2">
          <span className="font-bold text-amber-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Légendaire
          </span>
          <span className="font-extrabold text-xs">
            {stats.legendary} <span className="opacity-40 font-normal">/ {stats.legendaryTotal}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-sm bg-white dark:bg-simpson-darklight/40 px-3 py-2 rounded-xl border border-black/3 dark:border-white/2">
          <span className="font-bold text-blue-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Rare
          </span>
          <span className="font-extrabold text-xs">
            {stats.rare} <span className="opacity-40 font-normal">/ {stats.rareTotal}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-sm bg-white dark:bg-simpson-darklight/40 px-3 py-2 rounded-xl border border-black/3 dark:border-white/2">
          <span className="font-bold opacity-70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
            Commune
          </span>
          <span className="font-extrabold text-xs">
            {stats.common} <span className="opacity-40 font-normal">/ {stats.commonTotal}</span>
          </span>
        </div>
      </div>

      <div className="h-px bg-black/5 dark:bg-white/5 my-1" />

      <div className="grid grid-cols-2 gap-4 px-1 py-0.5">
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-black/60 dark:text-white/60 block truncate">Cartes uniques</span>
          <span className="text-sm font-black">
            {stats.uniqueCards}{" "}
            <span className="text-xs font-normal opacity-40">/ {stats.legendaryTotal + stats.rareTotal + stats.commonTotal}</span>
          </span>
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-black/60 dark:text-white/60 block truncate">Total de cartes</span>
          <span className="text-sm font-black">{stats.totalCards}</span>
        </div>
      </div>
    </div>
  );
}
