"use client";

import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { PiHandFistFill } from "react-icons/pi";
import type { CardData } from "@/features/card/interfaces/card.interface";
import Card from "./Card";

interface CardFamilyViewProps {
  card: CardData;
  familyCards: CardData[];
  allCards?: CardData[];
  onBack: () => void;
}

export default function CardFamilyView({ card, familyCards, allCards = [], onBack }: CardFamilyViewProps) {
  const hasFamilyBonus = card.family?.bonus?.ATK > 0 || card.family?.bonus?.PV > 0;

  const ownedQuantities = familyCards.reduce((acc, c) => {
    const key = c.slug || c.id;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const allFamilyMembers = allCards
    .filter((c) => c.family?.id === card.family?.id)
    .filter((c, index, self) => self.findIndex((o) => (o.slug || o.id) === (c.slug || c.id)) === index);

  return (
    <div className="flex flex-col gap-4 h-full relative">
      {/* Bouton retour fixe */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-simpson-orange dark:text-simpson-yellow hover:opacity-70 transition-opacity cursor-pointer z-10"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold">Retour</span>
      </button>

      {/* Conteneur principal avec scroll vertical */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-col items-center gap-6 pb-6">
          <p className="text-sm text-text/70 dark:text-white/60 text-center max-w-md">
            {card.family.description}
          </p>

          <div className="flex flex-col items-center gap-4">
            <span className="text-lg font-bold text-simpson-orange dark:text-simpson-yellow">Bonus de Famille</span>
            <div className="flex flex-wrap justify-center gap-4">
              {card.family.bonus.ATK > 0 && (
                <div className="flex items-center gap-2 bg-simpson-blue/5 border border-simpson-blue/15 px-3 py-1 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-[#11568adc] flex items-center justify-center shadow-md">
                    <PiHandFistFill className="w-3.5 h-3.5 text-simpson-yellow" />
                  </div>
                  <span className="text-sm font-extrabold text-simpson-blue dark:text-simpson-lightblue">
                    +{card.family.bonus.ATK} ATK
                  </span>
                </div>
              )}
              {card.family.bonus.PV > 0 && (
                <div className="flex items-center gap-2 bg-simpson-orange/5 border border-simpson-orange/15 px-3 py-1 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-[#ad3311d7] flex items-center justify-center shadow-md">
                    <FaHeart className="w-3 h-3 text-[#ffccc1]" />
                  </div>
                  <span className="text-sm font-extrabold text-[#ad3311d7] dark:text-[#ffccc1]">
                    +{card.family.bonus.PV} PV
                  </span>
                </div>
              )}
            </div>
          </div>

          {allFamilyMembers.length > 0 && (
            <div className="flex flex-col items-center gap-4 w-full">
              <span className="text-sm font-semibold text-simpson-gray">Membres de la famille</span>
              {/* Grille de cartes qui scrollera si la liste est longue */}
              <div className="flex gap-4 flex-wrap justify-center">
                {allFamilyMembers.map((c) => {
                  const qty = ownedQuantities[c.slug || c.id] || 0;
                  const isOwned = qty > 0;

                  return (
                    <div key={c.id} className="relative flex flex-col items-center">
                      {isOwned && (
                        <div className="absolute -top-1.5 -right-1.5 z-20 min-w-5 h-5 px-1 bg-simpson-dark dark:bg-white text-white dark:text-simpson-dark rounded-full flex items-center justify-center border border-simpson-gray/20 shadow-md font-black text-[10px]">
                          x{qty}
                        </div>
                      )}
                      {!isOwned && (
                        <div className="absolute -top-1.5 -right-1.5 z-20 bg-red-500 border border-red-400 text-white font-bold text-[8px] px-1 py-0 rounded-md shadow-md select-none tracking-wide whitespace-nowrap pointer-events-none normal-case">
                          non possédée
                        </div>
                      )}
                      <Card card={c} size={150} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}