"use client";

import Image from "next/image";
import { FaTimes, FaHeart } from "react-icons/fa";
import { LuDonut } from "react-icons/lu";
import { PiHandFistFill } from "react-icons/pi";
import { useEffect, useState } from "react";

interface CardData {
  name: string;
  slug: string;
  type: string;
  rarity: string;
  description: string;
  ATK?: number;
  PV?: number;
  family?: string;
  affinity?: string;
  serie?: {
    name_serie: string;
    position: number;
  };
}

interface CardDetailModalProps {
  isOpen: boolean;
  card: CardData | null;
  quantity: number; // 🌟 Ajout de la prop pour la quantité possédée
  onClose: () => void;
}

export default function CardDetailModal({
  isOpen,
  card,
  quantity, // 🌟 Récupération de la quantité
  onClose,
}: CardDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen || !card) return null;

  const rarityCount = parseInt(card.rarity || "1") || 1;

  // 🎯 Configuration pour le badge textuel de rareté calqué sur tes variables de thème
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

  // ⚔️ Détection si c'est une carte de type bonus (Objet ou Terrain)
  const isBonusType = card.type === "Objet" || card.type === "Terrain";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      {/* Container Principal de la Modal */}
      <div
        className="bg-white dark:bg-simpson-darklight border border-simpson-white/20 dark:border-simpson-dark w-full max-w-3xl rounded-3xl p-8 shadow-2xl relative flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-text/60 hover:text-text cursor-pointer transition-colors z-10 outline-none p-1"
          aria-label="Fermer"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* 🔝 HEADER : Titre centré, Quantité et Badges horizontaux */}
        <div className="flex flex-col items-center text-center gap-3">
          {/* 🌟 Titre et badge xQuantity alignés proprement */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h2 className="text-4xl font-extrabold text-text tracking-wide">
              {card.name}
            </h2>
            <span className="bg-simpson-dark dark:bg-white text-white dark:text-simpson-dark font-black text-sm px-3 py-1 rounded-xl shadow-sm select-none">
              x{quantity}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {card.family && card.family !== "Sans Famille" && (
              <span className="cursor-pointer text-body px-4 py-1.5 bg-simpson-orange/5 dark:bg-simpson-orange/10 rounded-full text-text border border-simpson-orange/20 backdrop-blur-md shadow-xs transition-all hover:bg-simpson-orange/10">
                Famille{" "}
                <strong className="text-simpson-orange dark:text-simpson-yellow font-bold ml-1">
                  {card.family}
                </strong>
              </span>
            )}
            {card.affinity && card.affinity !== "Sans Affinité" && (
              <span className="cursor-pointer text-body px-4 py-1.5 bg-simpson-orange/5 dark:bg-[#a855f7]/10 rounded-full text-text border border-[#a855f7]/20 backdrop-blur-md shadow-xs transition-all hover:bg-[#a855f7]/10">
                Affinité{" "}
                <strong className="text-[#a855f7] dark:text-[#c084fc] font-bold ml-1">
                  {card.affinity}
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* 🎴 CORPS : Deux colonnes */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mt-4">
          {/* 🖼️ Colonne Gauche : La carte Simpson */}
          <div className="w-50 shrink-0 aspect-2/3 relative">
            <Image
              src={`/cards/${card.slug}.webp`}
              alt={card.name}
              fill
              sizes={card.rarity === "3" ? "640px" : "340"}
              priority
              className={`rounded-2xl ${
                card.rarity === "1"
                  ? "object-contain"
                  : "object-cover shadow-xl"
              }`}
            />
          </div>

          {/* 📝 Colonne Droite : Infos, Rareté Donuts et Bouton Action */}
          <div className="flex-1 flex flex-col justify-between h-full min-h-90 py-2">
            <div className="flex flex-col gap-4">
              {/* 🎯 Ligne Type + Rareté alignée sur le design */}
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

                {/* 🍩 Donuts de rareté */}
                <div className="flex gap-1.5 text-simpson-orange dark:text-simpson-yellow bg-simpson-orange/5 dark:bg-simpson-yellow/5 px-3 py-1.5 rounded-full backdrop-blur-md">
                  {Array.from({ length: rarityCount }).map((_, i) => (
                    <LuDonut
                      key={i}
                      className="w-4.5 h-4.5 shrink-0 filter drop-shadow-[0_1.5px_2px_rgba(233,80,41,0.2)] dark:drop-shadow-[0_1.5px_2px_rgba(255,222,0,0.3)]"
                    />
                  ))}
                </div>
              </div>

              {/* ⚔️ Statistiques */}
              {((card.ATK !== undefined && card.ATK > 0) ||
                (card.PV !== undefined && card.PV > 0)) && (
                <div className="flex items-center gap-4 mt-2 select-none">
                  {isBonusType && (
                    <span className="text-body uppercase font-black tracking-wider text-simpson-gray dark:text-simpson-white/40 bg-simpson-light dark:bg-simpson-dark/40 px-2.5 py-1 rounded-md">
                      Bonus
                    </span>
                  )}

                  {card.ATK !== undefined && card.ATK > 0 && (
                    <div className="flex items-center gap-2.5 bg-simpson-blue/5 dark:bg-simpson-blue/10 border border-simpson-blue/15 pl-1.5 pr-3.5 py-1 rounded-full group transition-colors hover:bg-simpson-blue/10">
                      <div className="w-8 h-8 rounded-full bg-[#11568adc] flex items-center justify-center shadow-md">
                        <PiHandFistFill className="w-4.5 h-4.5 text-simpson-yellow drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]" />
                      </div>
                      <span className="text-xl font-extrabold text-simpson-blue dark:text-simpson-lightblue tracking-tight">
                        {card.ATK}
                      </span>
                    </div>
                  )}

                  {card.PV !== undefined && card.PV > 0 && (
                    <div className="flex items-center gap-2.5 bg-simpson-orange/5 dark:bg-simpson-orange/10 border border-simpson-orange/15 pl-1.5 pr-3.5 py-1 rounded-full group transition-colors hover:bg-simpson-orange/10">
                      <div className="w-8 h-8 rounded-full bg-[#ad3311d7] flex items-center justify-center shadow-md">
                        <FaHeart className="w-3.5 h-3.5 text-[#ffccc1] drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]" />
                      </div>
                      <span className="text-xl font-extrabold text-[#ad3311d7] dark:text-[#ffccc1] tracking-tight">
                        {card.PV}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="bg-simpson-light/60 dark:bg-simpson-dark/30 border border-simpson-white/40 dark:border-simpson-darklight/40 p-4 rounded-2xl mt-2 shadow-inner-xs">
                <p className="text-medium text-text/85 dark:text-white leading-relaxed antialiased">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Infos de Série */}
            <div className="mt-8 flex items-center justify-end gap-4">
              <span className="text-body font-semibold text-simpson-dark dark:text-white text-right">
                {card.serie?.name_serie || "Série 1"} <br /> N°
                {card.serie?.position || 0}/50
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}