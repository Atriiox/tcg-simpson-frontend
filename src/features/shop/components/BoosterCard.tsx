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

export default function BoosterCard({ booster, owned, canAfford, isBuying, isAnyBuying, isMounted, onBuy, onDetail }: BoosterCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full max-w-md bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-6 rounded-xl border border-white/40 dark:border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl group">
      <div className="flex justify-center transform transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:-rotate-1 filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_20px_rgba(0,0,0,0.35)] shrink-0">
        <Booster imageUrl={`/${booster.slug}`} className="w-44 h-62 sm:w-48 sm:h-68" />
      </div>

      <div className="flex flex-col justify-between flex-1 w-full min-h-60">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="text-xs font-semibold text-simpson-gray dark:text-simpson-white/40 bg-simpson-gray/10 dark:bg-white/5 px-2.5 py-1 rounded-md">
            Possédé : <span className="text-simpson-dark dark:text-simpson-white font-bold">{owned}</span>
          </div>
          <button onClick={() => onDetail(booster)} className="text-simpson-gray/70 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer transition-colors duration-200 outline-none p-1.5 hover:bg-simpson-gray/10 dark:hover:bg-white/5 rounded-xl">
            <LuInfo size={20} />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-simpson-dark dark:text-simpson-white">{booster.name}</h3>
          <p className="text-xs font-medium text-simpson-gray mt-0.5">Contient {booster.quantity || 5} carte{(booster.quantity || 5) > 1 ? "s" : ""}</p>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-simpson-gray/10 dark:border-white/5">
          <div className="flex flex-col items-start shrink-0">
            <span className="text-[10px] font-medium text-simpson-gray block mb-0.5 uppercase tracking-wider">Prix</span>
            <div className="flex items-center gap-1 font-black text-xl text-simpson-dark dark:text-simpson-white">
              <span>{isMounted ? booster.price : "--"}</span>
              <Image src="/donuts1.webp" alt="Donut Icon" width={18} height={18} className="w-4.5 h-4.5 object-contain" priority />
            </div>
          </div>

          <button
            onClick={() => onBuy(booster)}
            disabled={!canAfford || isBuying || isAnyBuying}
            className={`flex-1 h-11 text-xs font-bold rounded-xl shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer
              ${!canAfford ? "bg-simpson-gray/10 text-simpson-gray/40 dark:bg-white/5 dark:text-simpson-gray/60 cursor-not-allowed" : "bg-simpson-orange hover:bg-simpson-orange/90 text-simpson-white shadow-md"}
              ${isBuying || (isAnyBuying && !isBuying) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {!isMounted ? (
              <div className="w-4 h-4 border-2 border-simpson-gray/40 border-t-transparent rounded-full animate-spin" />
            ) : isBuying ? (
              <div className="w-4 h-4 border-2 border-simpson-white border-t-transparent rounded-full animate-spin" />
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
