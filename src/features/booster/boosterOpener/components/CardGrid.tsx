"use client";

import { useState, useEffect } from "react";

// Chemin vers ton composant Card
import Card from "@/features/card/components/Card";
import type { Card as CardType } from "@/features/card/schema/card.schema";

// On étend temporairement le type si isNew n'est pas encore dans ton schéma strict
interface ExtendedCardType extends CardType {
  isNew?: boolean;
}

export interface CardGridProps {
  cards: ExtendedCardType[];
  /** Taille des cartes en pixels. */
  cardSize?: number;
  /** Délai entre chaque carte qui apparaît (en secondes). */
  cascadeDelaySeconds?: number;
  /** Callback optionnel sur le clic d'une carte. */
  onCardClick?: (card: CardType) => void;
}

export function CardGrid({
  cards,
  cardSize = 200,
  cascadeDelaySeconds = 0.15,
  onCardClick,
}: CardGridProps): React.JSX.Element {
  const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>(
    {},
  );

  useEffect(() => {
    setRevealedCards({});
  }, [cards]);

  const handleCardClick = (index: number, card: ExtendedCardType) => {
    if (!revealedCards[index]) {
      setRevealedCards((prev) => ({ ...prev, [index]: true }));
    } else {
      if (onCardClick) onCardClick(card);
    }
  };

  /**
   * Énorme effet de lueur colorée diffuse au survol (Glow)
   * 100% géré par les ombres (shadow) de Tailwind.
   */
  const getRarityHoverClasses = (rarity?: string) => {
    switch (rarity) {
      case "2":
        // 🔵 Rare : Énorme lueur bleue diffuse et scale propre
        return "hover:scale-105 hover:-translate-y-2 hover:shadow-[0_0_50px_15px_rgba(59,130,246,0.6)]";
      case "3":
        // 🟠 Légendaire : Gros effet incandescent jaune/orange qui claque
        return "hover:scale-105 hover:-translate-y-2 hover:shadow-[0_0_55px_18px_rgba(249,115,22,0.75)]";
      default:
        // ⚪ Commun : Lueur blanche/grise très épurée
        return "hover:scale-105 hover:-translate-y-2 hover:shadow-[0_0_40px_12px_rgba(255,255,255,0.4)]";
    }
  };

  /**
   * Style pour les badges textuels de rareté en dessous des cartes
   */
  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case "2":
        return {
          text: "Rare",
          style: "text-blue-400 bg-blue-500/10 border-blue-500/30",
        };
      case "3":
        return {
          text: "Légendaire",
          style:
            "text-orange-500 bg-orange-500/10 border-orange-500/30 font-black animate-pulse",
        };
      default:
        return {
          text: "Commun",
          style: "text-gray-400 bg-gray-500/10 border-gray-500/20",
        };
    }
  };

  return (
    <div className="flex flex-wrap gap-6 justify-center max-w-275 p-6">
      {cards.map((card, index) => {
        const isRevealed = revealedCards[index];
        const hoverClasses = getRarityHoverClasses(card.rarity);
        const badge = getRarityBadge(card.rarity);

        return (
          <div
            key={`${card.slug}-${index}`}
            style={{
              transitionDelay: `${index * cascadeDelaySeconds}s`,
              animation:
                "booster-card-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
              animationDelay: `${index * cascadeDelaySeconds}s`,
            }}
            className="flex flex-col items-center gap-3 select-none"
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
              @keyframes booster-card-enter {
                from { opacity: 0; transform: translateY(24px) scale(0.92); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `,
              }}
            />

            {/* --- CONTENEUR PERSPECTIVE (Donne la profondeur 3D nécessaire pour le Flip) --- */}
            <div
              style={{
                width: cardSize,
                height: cardSize * 1.4,
                perspective: "1000px",
              }}
              className="bg-transparent"
            >
              {/* --- LE CONTENEUR DU FLIP & HOVER GLOW --- */}
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
                className={`w-full h-full relative transition-transform duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.1)] cursor-pointer rounded-[0.4em] ${hoverClasses}`}
                onClick={() => handleCardClick(index, card)}
              >
                {/* --- FACE A : LE DOS DE LA CARTE (Visible au départ) --- */}
                <div
                  style={{ backfaceVisibility: "hidden" }}
                  className="absolute inset-0 w-full h-full z-10"
                >
                  <div
                    style={{ backgroundImage: "url('/logo.webp')" }}
                    className="w-full h-full bg-contain bg-center bg-no-repeat bg-[#f4f2ee] shadow-2xl rounded-[0.4em] border border-black overflow-hidden"
                  />
                </div>

                {/* --- FACE B : LA CARTE RÉVÉLÉE (Masquée à l'envers, pivote à 180deg) --- */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Ta carte d'origine */}
                  <Card card={card} size={cardSize} />

                  {/* --- BADGE "NEW" FLOTTANT ULTRA STYLÉ --- */}
                  {card.isNew && (
                    <span className="absolute -top-2 -right-2 z-30 bg-simpson-orange text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md border border-simpson-orange animate-bounce">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* --- BADGE DE RARETÉ FIXE (Sous la carte, sans décaler la grille) --- */}
            <span
              className={`text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm font-bold transition-all duration-500 transform ${
                isRevealed
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 -translate-y-1 invisible"
              } ${badge.style}`}
            >
              {badge.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
