"use client";

import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { PiHandFistFill } from "react-icons/pi";
import type { Card } from "@/features/card/schema/card.schema";
import CardComponent from "./Card";

interface CardAffinityViewProps {
  card: Card;
  affinityCards: Card[];
  allCards?: Card[];
  onBack: () => void;
}

export default function CardAffinityView({
  card,
  affinityCards,
  allCards = [],
  onBack,
}: CardAffinityViewProps) {
  const currentQty = affinityCards.filter(
    (c) => (c.slug || c.id) === (card.slug || card.id),
  ).length;

  const globalTargetCard = allCards.find(
    (c) =>
      c.affinity?.id === card.affinity?.id &&
      (c.slug || c.id) !== (card.slug || card.id),
  );

  const partnerQty = globalTargetCard
    ? affinityCards.filter(
        (c) =>
          (c.slug || c.id) === (globalTargetCard.slug || globalTargetCard.id),
      ).length
    : 0;

  const isCurrentOwned = currentQty > 0;
  const isPartnerOwned = partnerQty > 0;

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <button
        onClick={onBack}
        className="absolute top-0 left-0 flex items-center gap-2 text-simpson-orange dark:text-simpson-yellow hover:opacity-70 transition-opacity cursor-pointer z-10"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold">Retour</span>
      </button>

      <div className="flex flex-column md:flex-row items-center justify-between w-full gap-4 flex-1 pt-8 px-2 overflow-y-auto">
        {/* Carte gauche */}
        <div className="flex-1 flex justify-center">
          <div className="relative flex flex-col items-center">
            {isCurrentOwned && (
              <div className="absolute -top-1.5 -right-1.5 z-20 min-w-5 h-5 px-1 bg-simpson-dark dark:bg-white text-white dark:text-simpson-dark rounded-full flex items-center justify-center border border-simpson-gray/20 shadow-md font-black text-[10px]">
                x{currentQty}
              </div>
            )}
            {!isCurrentOwned && (
              <div className="absolute -top-1.5 -right-1.5 z-20 bg-red-500 border border-red-400 text-white font-bold text-[8px] px-1 py-0 rounded-md shadow-md select-none tracking-wide whitespace-nowrap pointer-events-none normal-case">
                non possédée
              </div>
            )}
            <CardComponent card={card} size={200} />
          </div>
        </div>

        {/* Bonus centre */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <span className="text-xl font-bold text-[#a855f7] dark:text-[#c084fc]">
            Duo d'Affinité
          </span>
          <p className="text-xs text-text/60 dark:text-white/50 text-center max-w-32 leading-relaxed">
            {card.affinity.description}
          </p>
          <div className="flex flex-col items-center gap-2 mt-2">
            {card.affinity.bonus.ATK > 0 && (
              <div className="flex items-center gap-2.5 bg-simpson-blue/5 border border-simpson-blue/15 pl-1.5 pr-3.5 py-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-[#11568adc] flex items-center justify-center shadow-md">
                  <PiHandFistFill className="w-4.5 h-4.5 text-simpson-yellow" />
                </div>
                <span className="text-sm font-extrabold text-simpson-blue dark:text-simpson-lightblue">
                  +{card.affinity.bonus.ATK} ATK
                </span>
              </div>
            )}
            {card.affinity.bonus.PV > 0 && (
              <div className="flex items-center gap-2.5 bg-simpson-orange/5 border border-simpson-orange/15 pl-1.5 pr-3.5 py-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-[#ad3311d7] flex items-center justify-center shadow-md">
                  <FaHeart className="w-3.5 h-3.5 text-[#ffccc1]" />
                </div>
                <span className="text-sm font-extrabold text-[#ad3311d7] dark:text-[#ffccc1]">
                  +{card.affinity.bonus.PV} PV
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Carte droite (partenaire) */}
        <div className="flex-1 flex justify-center">
          {globalTargetCard ? (
            <div className="relative flex flex-col items-center">
              {isPartnerOwned && (
                <div className="absolute -top-1.5 -right-1.5 z-20 min-w-5 h-5 px-1 bg-simpson-dark dark:bg-white text-white dark:text-simpson-dark rounded-full flex items-center justify-center border border-simpson-gray/20 shadow-md font-black text-[10px]">
                  x{partnerQty}
                </div>
              )}
              {!isPartnerOwned && (
                <div className="absolute -top-1.5 -right-1.5 z-20 bg-red-500 border border-red-400 text-white font-bold text-[8px] px-1 py-0 rounded-md shadow-md select-none tracking-wide whitespace-nowrap pointer-events-none normal-case">
                  non possédée
                </div>
              )}
              <CardComponent card={globalTargetCard} size={200} />
            </div>
          ) : (
            <div className="w-40 h-56 rounded-2xl bg-simpson-light dark:bg-simpson-dark/30 border border-simpson-gray/10 flex items-center justify-center text-center p-4">
              <p className="text-xs text-simpson-gray">Aucun partenaire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
