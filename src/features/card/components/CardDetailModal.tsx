"use client";

import { FaTimes, FaHeart, FaCoins } from "react-icons/fa";
import { useEffect, useState } from "react";
import type { Card } from "@/features/card/schema/card.schema";
import CardComponent from "./Card";
import CardAffinityView from "./CardAffinityView";
import CardFamilyView from "./CardFamilyView";
import { useReward } from "@/components/RewardContext";
import { PiHandFistFill } from "react-icons/pi";

interface CardDetailModalProps {
  isOpen: boolean;
  card: Card | null;
  quantity: number;
  collectionCards?: Card[];
  allCards?: Card[];
  onClose: () => void;
  onSell?: (cardId: string, count: number) => void;
}

type View = "card" | "affinity" | "family";

export default function CardDetailModal({
  isOpen,
  card,
  quantity,
  onClose,
  collectionCards = [],
  allCards = [],
  onSell,
}: CardDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("card");
  const { triggerReward } = useReward(); // Utilisation du hook

  const [localQuantity, setLocalQuantity] = useState(quantity);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setView("card");
      setLocalQuantity(quantity);
    }
  }, [isOpen, quantity]);

  if (!mounted) return null;
  if (!isOpen || !card) return null;

  const isOwned = localQuantity > 0;
  const duplicatesCount = localQuantity - 1;
  const rarityCount = parseInt(card.rarity || "1") || 1;

  const rarityConfig: Record<string, { text: string; style: string }> = {
    "1": {
      text: "Commun",
      style: "text-simpson-gray bg-simpson-light dark:bg-simpson-dark",
    },
    "2": {
      text: "Rare",
      style: "text-simpson-lightblue bg-simpson-lightblue/10",
    },
    "3": {
      text: "Légendaire",
      style:
        "text-simpson-orange bg-simpson-orange/10 border-simpson-orange/20",
    },
  };

  const currentRarity = rarityConfig[card.rarity || "1"] || rarityConfig["1"];
  const isBonusType = card.type === "Objet" || card.type === "Terrain";

  const affinityCards = collectionCards.filter(
    (c) => c.affinity?.id === card.affinity?.id,
  );
  const familyCards = collectionCards.filter(
    (c) => c.family?.id === card.family?.id,
  );

  const handleSellAction = (count: number) => {
    if (onSell) {
      // Calcul du gain
      const rates: Record<string, number> = { "1": 5, "2": 25, "3": 50 };
      const pricePerCard = rates[card.rarity || "1"] || 5;
      const totalGain = pricePerCard * count;

      // Déclenchement de l'animation
      triggerReward(totalGain);

      // Action de vente
      onSell(card.id, count);

      // Décrémentation visuelle immédiate
      setLocalQuantity((prev) => Math.max(0, prev - count));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-simpson-darklight border border-white/20 dark:border-simpson-dark w-full max-w-3xl rounded-3xl p-8 shadow-2xl relative flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 h-[90vh] overflow-y-auto text-black dark:text-white"
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
        <div className="flex flex-col items-center text-center gap-3 shrink-0">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h2 className="text-4xl font-extrabold text-black dark:text-white tracking-wide">
              {view === "card"
                ? card.name
                : view === "affinity"
                  ? card.affinity?.name
                  : card.family?.name}
            </h2>

            {view === "card" &&
              (isOwned ? (
                <span className="bg-simpson-dark dark:bg-white text-white dark:text-simpson-dark font-black text-sm px-3 py-1 rounded-xl shadow-sm select-none">
                  x{localQuantity}
                </span>
              ) : (
                <span className="bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs px-2.5 py-1 rounded-xl shadow-sm select-none uppercase tracking-wider">
                  Non possédée
                </span>
              ))}
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
                onClick={() =>
                  setView(view === "affinity" ? "card" : "affinity")
                }
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
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-12 mt-2 flex-1 overflow-hidden">
            <div className="shrink-0 flex items-center">
              <div>
                <CardComponent card={card} size={200} />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between h-full py-1 overflow-y-auto pr-1">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-simpson-light dark:border-simpson-dark pb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-title text-simpson-blue dark:text-simpson-lightblue tracking-wide">
                      {card.type}
                    </h3>
                    <span
                      className={`text-xs uppercase px-2.5 py-0.5 rounded-md font-bold tracking-wide border border-transparent ${currentRarity.style}`}
                    >
                      {currentRarity.text}
                    </span>
                  </div>
                  {/* 🌟 LE DONUT DE RARETÉ : Remplacé par ton image personnalisée */}
                  <div className="flex gap-1.5 bg-simpson-orange/5 dark:bg-simpson-yellow/5 px-3 py-1.5 rounded-full backdrop-blur-md items-center">
                    {Array.from({ length: rarityCount }).map((_, i) => (
                      <img
                        key={i}
                        src="/Donuts1.webp"
                        alt="Donut Rarity"
                        className="w-4.5 h-4.5 shrink-0 object-contain select-none"
                      />
                    ))}
                  </div>
                </div>

                {(card.ATK > 0 || card.PV > 0) && (
                  <div className="flex items-center gap-4 mt-1 select-none">
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

                <div className="bg-simpson-light/60 dark:bg-simpson-dark/30 border border-white/40 dark:border-white/5 p-4 rounded-2xl mt-1 shadow-inner-xs">
                  <p className="text-medium text-black/80 dark:text-white leading-relaxed antialiased">
                    {card.description}
                  </p>
                </div>

                {duplicatesCount > 0 &&
                  (() => {
                    const rates: Record<string, number> = {
                      "1": 5,
                      "2": 25,
                      "3": 50,
                    };
                    const pricePerCard = rates[card.rarity || "1"] || 5;
                    const singleSellGain = pricePerCard;
                    const totalSellGain = pricePerCard * duplicatesCount;

                    return (
                      <div className="mt-2 p-4 rounded-2xl border border-simpson-orange/20 bg-simpson-orange/5 dark:bg-simpson-orange/10 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-simpson-orange dark:text-simpson-yellow uppercase tracking-wide">
                            Doubles disponibles ({duplicatesCount})
                          </span>
                          <span className="text-[11px] text-black/60 dark:text-white/60 font-medium">
                            Gagne des donuts en recyclant tes doublons.
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 w-full sm:justify-end">
                          {/* 🌟 BOUTON VENDRE 1 : Remplacé par ton image personnalisée */}
                          <button
                            type="button"
                            onClick={() => handleSellAction(1)}
                            className="px-4 h-9 flex items-center gap-1 text-xs font-black uppercase tracking-wider rounded-xl bg-white dark:bg-simpson-dark text-simpson-orange dark:text-simpson-yellow border border-simpson-orange/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                          >
                            <FaCoins className="w-3 h-3 text-simpson-orange dark:text-simpson-yellow" />
                            Vendre 1 pour {singleSellGain}
                            <img
                              src="/Donuts1.webp"
                              alt="Donut"
                              className="w-4.5 h-4.5 inline object-contain align-middle"
                            />
                          </button>

                          {duplicatesCount >= 2 && (
                            <button
                              type="button"
                              onClick={() => handleSellAction(duplicatesCount)}
                              className="px-4 h-9 flex items-center gap-2 text-xs font-black uppercase tracking-wider rounded-xl bg-simpson-orange text-white hover:bg-simpson-orange/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                            >
                              <FaCoins className="w-3 h-3 text-white" />
                              Tout Vendre +{totalSellGain}
                              <img
                                src="/Donuts1.webp"
                                alt="Donut"
                                className="w-4.5 h-4.5 inline object-contain align-middle"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
              </div>

              <div className="mt-4 flex items-center justify-end gap-4 shrink-0">
                <span className="text-body font-semibold text-simpson-dark dark:text-white text-right">
                  {card.serie?.id_serie?.name || "Série 1"} <br /> N°
                  {card.serie?.position || 0}/40
                </span>
              </div>
            </div>
          </div>
        )}

        {view === "affinity" && (
          <div className="flex-1 overflow-hidden">
            <CardAffinityView
              card={card}
              affinityCards={affinityCards}
              allCards={allCards}
              onBack={() => setView("card")}
            />
          </div>
        )}

        {view === "family" && (
          <div className="flex-1 overflow-hidden">
            <CardFamilyView
              card={card}
              familyCards={familyCards}
              allCards={allCards}
              onBack={() => setView("card")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
