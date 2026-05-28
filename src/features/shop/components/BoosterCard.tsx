"use client";

import Image from "next/image";
import { LuInfo } from "react-icons/lu";
import Booster from "../../booster/components/BoosterDisplay";
import { ShopBooster } from "../hooks/useShopBooster";

interface BoosterCardProps {
  booster: ShopBooster;
  owned: number;
  canAfford: boolean;
  isBuying: boolean;
  isAnyBuying: boolean;
  isMounted: boolean;
  onBuy: (booster: ShopBooster) => void;
  onDetail: (booster: ShopBooster) => void;
}

export default function BoosterCard({
  booster,
  owned,
  canAfford,
  isBuying,
  isAnyBuying,
  isMounted,
  onBuy,
  onDetail,
}: BoosterCardProps) {
  return (
    <div className="flex flex-col items-center w-full bg-white/40 dark:bg-simpson-darklight/40 backdrop-blur-md p-4 rounded-2xl border border-white/40 dark:border-white/10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative">
      
      {/* BADGES SUPERPOSÉS */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="text-[10px] font-bold text-simpson-dark dark:text-simpson-white bg-white/80 dark:bg-simpson-darklight/80 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-black/5 dark:border-white/5 shadow-sm">
          Possédé : <span className="text-simpson-orange dark:text-simpson-yellow">{owned}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetail(booster);
          }}
          className="pointer-events-auto text-simpson-gray/70 hover:text-simpson-orange dark:hover:text-simpson-yellow transition-colors duration-200 p-1 bg-white/80 dark:bg-simpson-darklight/80 backdrop-blur-sm rounded-lg border border-black/5 dark:border-white/5 shadow-sm cursor-pointer outline-none"
        >
          <LuInfo size={16} />
        </button>
      </div>

      {/* SECTION IMAGE MAXIMISÉE */}
      <div className="flex justify-center transform transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:-rotate-1 filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_16px_24px_rgba(0,0,0,0.5)] shrink-0 pt-6 pb-2">
        <Booster
          imageUrl={`/${booster.slug}`}
          className="w-38 h-52 sm:w-60 sm:h-75 aspect-3/4 object-contain"
        />
      </div>

      {/* SECTION INFOS SERRÉE */}
      <div className="flex flex-col w-full mt-1">
        {/* Titre et description */}
        <div className="text-center mb-3">
          <h3 className="text-sm font-black tracking-tight text-simpson-dark dark:text-simpson-white line-clamp-1 group-hover:text-simpson-orange dark:group-hover:text-simpson-yellow transition-colors duration-200">
            {booster.name}
          </h3>
          <p className="text-[11px] font-medium text-simpson-gray dark:text-simpson-gray/80 mt-0.5">
            Contient {booster.quantity || 5} carte{(booster.quantity || 5) > 1 ? "s" : ""}
          </p>
        </div>

        {/* BLOC ACTION (Fusion Prix + Bouton) */}
        <div className="flex items-center gap-2 w-full bg-simpson-gray/5 dark:bg-white/5 p-1.5 rounded-xl border border-simpson-gray/5 dark:border-white/5">
          {/* Prix à gauche */}
          <div className="flex flex-col items-center justify-center px-2 shrink-0 min-w-[58px]">
            <span className="text-[8px] font-bold text-simpson-gray/60 uppercase tracking-widest block -mb-0.5">Prix</span>
            <div className="flex items-center gap-0.5 font-black text-sm text-simpson-dark dark:text-simpson-white">
              <span>{isMounted ? booster.price : "--"}</span>
              <Image
                src="/donuts1.webp"
                alt="Donut"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain"
                priority
              />
            </div>
          </div>

          {/* Bouton Acheter */}
          <button
            onClick={() => onBuy(booster)}
            disabled={!canAfford || isBuying || isAnyBuying}
            className={`flex-1 h-9 text-[11px] font-black rounded-lg shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider
              ${!canAfford 
                ? "bg-simpson-gray/10 text-simpson-gray/40 dark:bg-white/5 dark:text-simpson-gray/50 cursor-not-allowed" 
                : "bg-simpson-orange hover:bg-simpson-orange/90 text-simpson-white shadow-md shadow-simpson-orange/10"
              }
              ${isBuying || (isAnyBuying && !isBuying) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {!isMounted ? (
              <div className="w-3.5 h-3.5 border-2 border-simpson-gray/40 border-t-transparent rounded-full animate-spin" />
            ) : isBuying ? (
              <div className="w-3.5 h-3.5 border-2 border-simpson-white border-t-transparent rounded-full animate-spin" />
            ) : !canAfford ? (
              <span>Insuffisant</span>
            ) : (
              <span>Acheter</span>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}