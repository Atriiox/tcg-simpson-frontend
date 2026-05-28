"use client";

import Image from "next/image";

interface DailyBannerProps {
  isReady: boolean;
  isMounted: boolean;
  isClaiming: boolean;
  formattedTime: string;
  onClaim: () => void;
}

export default function DailyBanner({ isReady, isMounted, isClaiming, formattedTime, onClaim }: DailyBannerProps) {
  return (
    <div className="w-full bg-white/40 dark:bg-simpson-darklight/40 backdrop-blur-md p-2 rounded-2xl border border-white/40 dark:border-white/5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center shrink-0">
          <Image src="/donuts1.webp" alt="Daily Gift" width={36} height={36} className="object-contain animate-bounce" style={{ animationDuration: "4s" }} />
        </div>
        <div>
          <h3 className="text-base font-bold text-simpson-dark dark:text-simpson-white">Donuts quotidiens gratuits</h3>
          <p className="text-xs text-simpson-gray dark:text-simpson-white/60 mt-0.5">Récupère ton bonus de 100 donuts toutes les 12 heures !</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {!isReady && isMounted && (
          <div className="text-center sm:text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-simpson-gray block mb-0.5">Disponible dans</span>
            <span className="font-mono text-sm font-black text-simpson-dark dark:text-simpson-white bg-simpson-gray/10 dark:bg-white/5 px-2.5 py-1 rounded-md tracking-wider">{formattedTime}</span>
          </div>
        )}
        <button
          onClick={onClaim}
          disabled={!isReady || isClaiming}
          className={`w-full sm:w-44 h-11 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${
            !isReady
              ? "bg-simpson-gray/10 text-simpson-gray/40 dark:bg-white/5 dark:text-simpson-gray/50 cursor-not-allowed select-none"
              : "bg-simpson-lightblue hover:bg-simpson-lightblue/90 text-simpson-white cursor-pointer"
          }`}
        >
          {isClaiming ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isReady ? (
            <span className="flex items-center gap-1.5">
              Récupérer +100
              <Image src="/donuts1.webp" alt="Donut" width={18} height={18} className="object-contain w-4.5 h-4.5 shrink-0 select-none" priority />
            </span>
          ) : (
            <span>Indisponible</span>
          )}
        </button>
      </div>
    </div>
  );
}
