"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { LuDonut } from "react-icons/lu";
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
  onClose: () => void;
}

export default function CardDetailModal({
  isOpen,
  card,
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

        {/* 🔝 HEADER : Titre centré et Badges horizontaux */}
        <div className="flex flex-col items-center text-center gap-3">
          <h2 className="text-4xl font-extrabold text-text tracking-wide">
            {card.name}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {card.family && card.family !== "Sans Famille" && (
              <span className="text-body px-4 py-1.5 bg-simpson-light dark:bg-simpson-dark rounded-full text-simpson-gray border border-simpson-white dark:border-simpson-darklight shadow-inner-xs">
                Famille{" "}
                <strong className="text-simpson-orange dark:text-simpson-yellow font-semibold">
                  {card.family}
                </strong>
              </span>
            )}
            {card.affinity && card.affinity !== "Sans Affinité" && (
              <span className="text-body px-4 py-1.5 bg-simpson-light dark:bg-simpson-dark rounded-full text-simpson-gray border border-simpson-white dark:border-simpson-darklight shadow-inner-xs">
                Affinité{" "}
                <strong className="text-[#a855f7] font-semibold">
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
                card.rarity === "1" ? "object-contain" : "object-cover shadow-xl"
              }`}
            />
          </div>

          {/* 📝 Colonne Droite : Infos, Rareté Donuts et Bouton Action */}
          <div className="flex-1 flex flex-col justify-between h-full min-h-90 py-2">
            <div className="flex flex-col gap-4">
              {/* 🎯 Ligne Type + Rareté alignée sur le design */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-simpson-light dark:border-simpson-dark pb-3">
                <div className="flex items-center gap-3">
                  {/* Utilisation de l'utilitaire de classe text-title */}
                  <h3 className="text-title text-simpson-blue dark:text-simpson-lightblue tracking-wide">
                    {card.type}
                  </h3>
                  <span
                    className={`text-xs uppercase px-2.5 py-0.5 rounded-md font-bold tracking-wide border border-transparent ${currentRarity.style}`}
                  >
                    {currentRarity.text}
                  </span>
                </div>

                {/* Donuts de rareté */}
                <div className="flex gap-0.5 text-simpson-orange dark:text-simpson-yellow bg-simpson-light dark:bg-simpson-dark p-1.5 rounded-xl border border-simpson-white dark:border-simpson-darklight shadow-inner-xs">
                  {Array.from({ length: rarityCount }).map((_, i) => (
                    <LuDonut
                      key={i}
                      className="w-5 h-5 shrink-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
                    />
                  ))}
                </div>
              </div>

              {/* Utilisation de l'utilitaire text-medium pour le descriptif */}
              <p className="text-medium text-text/80 dark:text-text/70 leading-relaxed mt-2">
                {card.description}
              </p>
            </div>

            {/* 🎯 Bouton d'action et Infos de Série */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                className="px-6 h-12 bg-simpson-orange hover:bg-simpson-orange/90 text-white font-bold text-lg rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer tracking-wide"
              >
                Ajouter au deck
              </button>

              <span className="text-body font-semibold text-simpson-gray text-right">
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
