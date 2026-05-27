"use client";

import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { PiHandFistFill } from "react-icons/pi";
import type { CardData } from "@/features/card/interfaces/card.interface";
import Card from "./Card";

interface CardFamilyViewProps {
  card: CardData;
  familyCards: CardData[];
  onBack: () => void;
}

export default function CardFamilyView({ card, familyCards, onBack }: CardFamilyViewProps) {
  const hasFamilyBonus = card.family?.bonus?.ATK > 0 || card.family?.bonus?.PV > 0;

  return (
    <div className="flex flex-col gap-6 h-full">
  <button
  onClick={onBack}
  className="absolute top-6 left-6 flex items-center gap-2 text-simpson-orange dark:text-simpson-yellow hover:opacity-70 transition-opacity cursor-pointer"
>
  <FaArrowLeft className="w-4 h-4" />
  <span className="text-sm font-bold">Retour</span>
</button>
      <div className="flex flex-col items-center gap-6 flex-1">
        <p className="text-medium text-text/70 dark:text-white/60 text-center max-w-md">
          {card.family.description}
        </p>

        <div className="flex flex-col items-center gap-4">
          <span className="text-xl font-bold text-simpson-orange dark:text-simpson-yellow">Famille</span>
          <div className="flex items-center gap-6">
            {card.family.bonus.ATK > 0 && (
              <div className="flex items-center gap-2.5 bg-simpson-blue/5 border border-simpson-blue/15 pl-1.5 pr-3.5 py-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-[#11568adc] flex items-center justify-center shadow-md">
                  <PiHandFistFill className="w-4.5 h-4.5 text-simpson-yellow" />
                </div>
                <span className="text-xl font-extrabold text-simpson-blue dark:text-simpson-lightblue">
                  +{card.family.bonus.ATK} ATK
                </span>
              </div>
            )}
            {card.family.bonus.PV > 0 && (
              <div className="flex items-center gap-2.5 bg-simpson-orange/5 border border-simpson-orange/15 pl-1.5 pr-3.5 py-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-[#ad3311d7] flex items-center justify-center shadow-md">
                  <FaHeart className="w-3.5 h-3.5 text-[#ffccc1]" />
                </div>
                <span className="text-xl font-extrabold text-[#ad3311d7] dark:text-[#ffccc1]">
                  +{card.family.bonus.PV} PV
                </span>
              </div>
            )}
            {!hasFamilyBonus && (
              <p className="text-medium text-simpson-gray">Aucun bonus de famille</p>
            )}
          </div>
        </div>

        {familyCards.length > 0 && (
          <div className="flex flex-col items-center gap-4 w-full overflow-hidden">
            <span className="text-body font-semibold text-simpson-gray">Cartes de cette famille</span>
            <div className="flex gap-4 flex-wrap justify-center overflow-hidden">
              {familyCards.map((c) => (
                <Card key={c.id} card={c} size={120} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}