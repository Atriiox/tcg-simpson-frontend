"use client";

import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { PiHandFistFill } from "react-icons/pi";
import type { CardData } from "@/features/card/interfaces/card.interface";
import Card from "./Card";

interface CardAffinityViewProps {
  card: CardData;
  affinityCards: CardData[];
  onBack: () => void;
}

export default function CardAffinityView({ card, affinityCards, onBack }: CardAffinityViewProps) {
  return (
    <div className="flex flex-col gap-6 h-full">
<button
  onClick={onBack}
  className="absolute top-6 left-6 flex items-center gap-2 text-simpson-orange dark:text-simpson-yellow hover:opacity-70 transition-opacity cursor-pointer"
>
  <FaArrowLeft className="w-4 h-4" />
  <span className="text-sm font-bold">Retour</span>
</button>

      <div className="flex items-center justify-between w-full gap-4 flex-1">

        {/* Carte gauche — carte courante */}
        <div className="flex-1 flex justify-center overflow-hidden">
          <Card card={card} size={160} />
        </div>

        {/* Bonus au centre */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <span className="text-xl font-bold text-[#a855f7] dark:text-[#c084fc]">Affinité</span>
          <p className="text-xs text-text/60 dark:text-white/50 text-center max-w-32">
            {card.affinity.description}
          </p>
          <div className="flex flex-col items-center gap-2 mt-2">
            {card.affinity.bonus.ATK > 0 && (
              <div className="flex items-center gap-2.5 bg-simpson-blue/5 border border-simpson-blue/15 pl-1.5 pr-3.5 py-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-[#11568adc] flex items-center justify-center shadow-md">
                  <PiHandFistFill className="w-4.5 h-4.5 text-simpson-yellow" />
                </div>
                <span className="text-xl font-extrabold text-simpson-blue dark:text-simpson-lightblue">
                  +{card.affinity.bonus.ATK} ATK
                </span>
              </div>
            )}
            {card.affinity.bonus.PV > 0 && (
              <div className="flex items-center gap-2.5 bg-simpson-orange/5 border border-simpson-orange/15 pl-1.5 pr-3.5 py-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-[#ad3311d7] flex items-center justify-center shadow-md">
                  <FaHeart className="w-3.5 h-3.5 text-[#ffccc1]" />
                </div>
                <span className="text-xl font-extrabold text-[#ad3311d7] dark:text-[#ffccc1]">
                  +{card.affinity.bonus.PV} PV
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Carte droite — carte de l'affinité */}
        <div className="flex-1 flex justify-center overflow-hidden">
          {affinityCards[0] ? (
            <Card card={affinityCards[0]} size={160} />
          ) : (
            <div className="w-40 h-56 rounded-2xl bg-simpson-light dark:bg-simpson-dark/30 border border-simpson-gray/10 flex items-center justify-center">
              <p className="text-xs text-simpson-gray text-center px-2">Aucune autre carte</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}