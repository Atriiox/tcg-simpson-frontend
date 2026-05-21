"use client";

import Image from "next/image";
import { FaHeart, FaTimes } from "react-icons/fa";
import { PiHandFistFill } from "react-icons/pi";
import { LuDonut } from "react-icons/lu";
import { useEffect, useState } from "react";

interface CardData {
  name: string;
  slug: string;
  type: string;
  rarity: string;
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
  isOpen: boolean; // 🎯 Aligné sur ProfileForm
  card: CardData | null;
  onClose: () => void;
}

export default function CardDetailModal({ isOpen, card, onClose }: CardDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  // Gestion du montage SSR identique à ton ProfileForm
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen || !card) return null;

  const currentType = card.type.toLowerCase();
  const rarityCount = parseInt(card.rarity || "1") || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      {/* Container de la Modal - Même ADN structurel et animations */}
      <div className="bg-white dark:bg-simpson-darklight border border-gray-300 dark:border-simpson-dark w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative flex flex-col p-5 gap-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text/50 hover:text-text cursor-pointer transition-colors z-10 outline-none"
          aria-label="Fermer"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Visuel de la Carte */}
        <div className="w-full aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-100 dark:bg-simpson-dark border border-gray-200 dark:border-simpson-dark/50 shadow-xs">
          <Image
            src={`/cards/${card.slug}.png`}
            alt={card.name}
            fill
            sizes="(max-w-md) 100vw"
            priority
            className="object-cover"
          />
        </div>

        {/* Infos textuelles */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <span className="text-title font-bold text-text truncate">
              {card.name}
            </span>
            <span className="text-xs uppercase px-2.5 py-1 bg-gray-100 dark:bg-simpson-dark font-semibold rounded-md text-text/70 border border-gray-200 dark:border-simpson-dark/40 shrink-0">
              {card.type}
            </span>
          </div>

          {/* Section conditionnelle : Personnage */}
          {currentType === "personnage" && (
            <div className="flex justify-between items-center bg-gray-50 dark:bg-simpson-dark/40 p-3 rounded-xl border border-gray-200 dark:border-simpson-dark/60 mt-1">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text/40 font-medium">Famille / Affinité</span>
                <span className="text-medium font-semibold text-text">
                  {card.family || "Sans Famille"} • {card.affinity || "Sans Affinité"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-medium font-bold">
                <span className="flex items-center gap-1.5 text-text">
                  {card.ATK || 0} <PiHandFistFill className="text-text/40 w-4 h-4" />
                </span>
                <span className="flex items-center gap-1.5 text-red-500">
                  {card.PV || 0} <FaHeart className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}

          {/* Footer de la modal : Série et Rareté */}
          <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-200 dark:border-simpson-dark">
            <span className="text-xs font-medium text-text/50">
              {card.serie?.name_serie || "Série Spéciale"} — {card.serie?.position || 0}/50
            </span>
            <div className="flex gap-0.5 text-simpson-orange dark:text-simpson-yellow">
              {Array.from({ length: rarityCount }).map((_, i) => (
                <LuDonut key={i} className="w-4 h-4 shrink-0" />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}