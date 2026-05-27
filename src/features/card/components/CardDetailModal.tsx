"use client";

import { FaTimes, FaHeart } from "react-icons/fa";
import { LuDonut } from "react-icons/lu";
import { PiHandFistFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import type { CardData } from "@/features/card/interfaces/card.interface";
import Card from "./Card";
import CardAffinityView from "./CardAffinityView";
import CardFamilyView from "./CardFamilyView";

interface CardDetailModalProps {
  isOpen: boolean;
  card: CardData | null;
  quantity: number;
  onClose: () => void;
  collectionCards?: CardData[];
}

type View = "card" | "affinity" | "family";

export default function CardDetailModal({
  isOpen,
  card,
  quantity: initialQuantity,
  onClose,
  collectionCards = [],
}: CardDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("card");

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (isOpen) setView("card"); }, [isOpen]);

  if (!mounted) return null;
  if (!isOpen || !card) return null;

  // 🌟 CALCUL EN AMONT DE LA QUANTITÉ POSSÉDÉE REELLEMENT
  const realQuantity = collectionCards.filter((c) => c.id === card.id).length;
  
  // On détermine si la carte est dans la collection
  const isOwned = realQuantity > 0;
  
  // Si elle est dans la collection on prend le compte exact, sinon on applique un fallback de sécurité
  const finalQuantity = isOwned ? realQuantity : initialQuantity;

  const rarityCount = parseInt(card.rarity || "1") || 1;

  const rarityConfig: Record<string, { text: string; style: string }> = {
    "1": { text: "Commun", style: "text-simpson-gray bg-simpson-light dark:bg-simpson-dark" },
    "2": { text: "Rare", style: "text-simpson-lightblue bg-simpson-lightblue/10" },
    "3": { text: "Légendaire", style: "text-simpson-orange bg-simpson-orange/10 border-simpson-orange/20" },
  };
  
  const currentRarity = rarityConfig[card.rarity || "1"] || rarityConfig["1"];
  const isBonusType = card.type === "Objet" || card.type === "Terrain";

  const affinityCards = collectionCards.filter(
    (c) => c.affinity.id === card.affinity.id && c.id !== card.id
  );

  const familyCards = collectionCards.filter(
    (c) => c.family.id === card.family.id && c.id !== card.id
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-simpson-darklight border border-white/20 dark:border-simpson-dark w-full max-w-3xl rounded-3xl p-8 shadow-2xl relative flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-200 min-h-125 max-h-[90vh] overflow-y-auto text-black dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white cursor-pointer transition-colors z-10 outline-none p-1"
          aria-label="Fermer"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* HEADER */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h2 className="text-4xl font-extrabold text-black dark:text-white tracking-wide">
              {view === "card" ? card.name : view === "affinity" ? card.affinity?.name : card.family?.name}
            </h2>
            
            {/* AFFICHAGE CONDITIONNEL DYNAMIQUE xN / NON POSSÉDÉE */}
            {view === "card" && (
              isOwned ? (
                <span className="bg-simpson-dark dark:bg-white text-white dark:text-simpson-dark font-black text-sm px-3 py-1 rounded-xl shadow-sm select-none">
                  x{finalQuantity}
                </span>
              ) : (
                <span className="bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs px-2.5 py-1 rounded-xl shadow-sm select-none uppercase tracking-wider">
                  Non possédée
                </span>
              )
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {card.family && card.family.name !== "Sans Famille" && (
              <span
                onClick={() => setView(view === "family" ? "card" : "family")}
                className={`cursor-pointer text-body px-4 py-1.5 rounded-full border backdrop-blur-md shadow-xs transition-all text-black dark:text-white ${
                  view === "family"
                    ? "bg-simpson-orange/20 border-simpson-orange/40"
                    : "bg-simpson-orange/5 dark:bg-simpson-orange/10 border-simpson-orange/20 hover:bg-simpson-orange/10"
                }`}
              >
                Famille{" "}
                <strong className="text-simpson-orange dark:text-simpson-yellow font-bold ml-1">
                  {card.family.name}
                </strong>
              </span>
            )}
            {card.affinity && card.affinity.name !== "Sans Affinité" && (
              <span
                onClick={() => setView(view === "affinity" ? "card" : "affinity")}
                className={`cursor-pointer text-body px-4 py-1.5 rounded-full border backdrop-blur-md shadow-xs transition-all text-black dark:text-white ${
                  view === "affinity"
                    ? "bg-[#a855f7]/20 border-[#a855f7]/40"
                    : "bg-simpson-orange/5 dark:bg-[#a855f7]/10 border-[#a855f7]/20 hover:bg-[#a855f7]/10"
                }`}
              >
                Affinité{" "}
                <strong className="text-[#a855f7] dark:text-[#c084fc] font-bold ml-1">
                  {card.affinity.name}
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* VUE CARTE */}
        {view === "card" && (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mt-4">
            <div className="shrink-0">
              {/* Opacité et effet visuel si la carte n'est pas encore obtenue */}
              <div className={!isOwned ? "opacity-40 grayscale-[30%]" : ""}>
                <Card card={card} size={200} />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between h-full min-h-90 py-2">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-simpson-light dark:border-simpson-dark pb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-title text-simpson-blue dark:text-simpson-lightblue tracking-wide">
                      {card.type}
                    </h3>
                    <span className={`text-xs uppercase px-2.5 py-0.5 rounded-md font-bold tracking-wide border border-transparent ${currentRarity.style}`}>
                      {currentRarity.text}
                    </span>
                  </div>
                  <div className="flex gap-1.5 text-simpson-orange dark:text-simpson-yellow bg-simpson-orange/5 dark:bg-simpson-yellow/5 px-3 py-1.5 rounded-full backdrop-blur-md">
                    {Array.from({ length: rarityCount }).map((_, i) => (
                      <LuDonut key={i} className="w-4.5 h-4.5 shrink-0" />
                    ))}
                  </div>
                </div>

                {(card.ATK > 0 || card.PV > 0) && (
                  <div className="flex items-center gap-4 mt-2 select-none">
                    {isBonusType && (
                      <span className="text-body uppercase font-black tracking-wider text-simpson-gray dark:text-white/40 bg-simpson-light dark:bg-simpson-dark/40 px-2.5 py-1 rounded-md">
                        Bonus
                      </span>
                    )}
                    {card.ATK > 0 && (
                      <div className="flex items-center gap-2.5 bg-simpson-blue/5 dark:bg-simpson-blue/10 border border-simpson-blue/15 pl-1.5 pr-3.5 py-1 rounded-full">
                        <div className="w-8 h-8 rounded-full bg-[#11568adc] flex items-center justify-center shadow-md">
                          <PiHandFistFill className="w-4.5 h-4.5 text-simpson-yellow" />
                        </div>
                        <span className="text-xl font-extrabold text-simpson-blue dark:text-simpson-lightblue tracking-tight">
                          {card.ATK}
                        </span>
                      </div>
                    )}
                    {card.PV > 0 && (
                      <div className="flex items-center gap-2.5 bg-simpson-orange/5 dark:bg-simpson-orange/10 border border-simpson-orange/15 pl-1.5 pr-3.5 py-1 rounded-full">
                        <div className="w-8 h-8 rounded-full bg-[#ad3311d7] flex items-center justify-center shadow-md">
                          <FaHeart className="w-3.5 h-3.5 text-[#ffccc1]" />
                        </div>
                        <span className="text-xl font-extrabold text-[#ad3311d7] dark:text-[#ffccc1] tracking-tight">
                          {card.PV}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-simpson-light/60 dark:bg-simpson-dark/30 border border-white/40 dark:border-white/5 p-4 rounded-2xl mt-2 shadow-inner-xs">
                  <p className="text-medium text-black/80 dark:text-white leading-relaxed antialiased">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-4">
                <span className="text-body font-semibold text-simpson-dark dark:text-white text-right">
                  {card.serie?.id_serie?.name || "Série 1"} <br /> N°{card.serie?.position || 0}/50
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VUE AFFINITÉ */}
        {view === "affinity" && (
          <div className="flex-1 overflow-hidden">
            <CardAffinityView card={card} affinityCards={affinityCards} onBack={() => setView("card")} />
          </div>
        )}

        {/* VUE FAMILLE */}
        {view === "family" && (
          <div className="flex-1 overflow-hidden">
            <CardFamilyView card={card} familyCards={familyCards} onBack={() => setView("card")} />
          </div>
        )}
      </div>
    </div>
  );
}