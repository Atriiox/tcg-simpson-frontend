"use client";

import Image from "next/image";

interface DailyBannerProps {
  isReady: boolean;
  isMounted: boolean;
  isClaiming: boolean;
  formattedTime: string;
  onClaim: () => void;
}

export default function DailyBanner({
  isReady,
  isMounted,
  isClaiming,
  formattedTime,
  onClaim,
}: DailyBannerProps) {
  return (
    <div className="bg-white/40 dark:bg-simpson-darklight/40 backdrop-blur-md p-2 rounded-xl border border-white/40 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 max-w-xl w-full">
      {/* SECTION INFO DE GAUCHE SERRÉE */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <Image
            src="/donuts1.webp"
            alt="Daily Gift"
            width={28}
            height={28}
            className="w-7 h-7 object-contain animate-bounce"
            style={{ animationDuration: "4s" }}
          />
        </div>
        <div>
          <h3 className="text-xs font-bold text-simpson-dark dark:text-simpson-white leading-tight">
            Donuts quotidiens gratuits
          </h3>
          <p className="text-[11px] text-simpson-gray dark:text-simpson-white/60 leading-tight mt-0.5">
            Récupère ton bonus de 100 donuts toutes les 12 heures !
          </p>
        </div>
      </div>

      {/* SECTION BOUTON ET TIMER À DROITE */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {!isReady && isMounted && (
          <div className="text-right shrink-0">
            <span className="text-[9px] uppercase font-bold tracking-wider text-simpson-gray block -mb-0.5">
              Disponible dans
            </span>
            <span className="font-mono text-xs font-black text-simpson-dark dark:text-simpson-white bg-simpson-gray/10 dark:bg-white/5 px-2 py-0.5 rounded-md tracking-wider">
              {formattedTime}
            </span>
          </div>
        )}
        <button
          onClick={onClaim}
          disabled={!isReady || isClaiming}
          className={`px-3 h-8 text-[11px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 whitespace-nowrap w-full md:w-auto
            ${
              !isReady
                ? "bg-simpson-gray/10 text-simpson-gray/40 dark:bg-white/5 dark:text-simpson-gray/50 cursor-not-allowed select-none"
                : "bg-simpson-lightblue hover:bg-simpson-lightblue/90 text-simpson-white cursor-pointer"
            }`}
        >
          {isClaiming ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isReady ? (
            <span className="flex items-center gap-1">
              Récupérer +100
              <Image
                src="/donuts1.webp"
                alt="Donut"
                width={14}
                height={14}
                className="object-contain w-3.5 h-3.5 shrink-0 select-none"
                priority
              />
            </span>
          ) : (
            <span>Indisponible</span>
          )}
        </button>
      </div>
    </div>
  );
}
