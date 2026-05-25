/**
 * Grille des cartes revelees, avec animation d'entree en cascade.
 *
 * Chaque carte apparait avec un delai croissant (0s, 0.15s, 0.3s...)
 * pour creer l'effet "boom une par une". Le keyframe est defini
 * dans Styles/animations.css.
 *
 * !!! IMPORTANT !!! Adapte l'import du composant Card (ligne ci-dessous)
 * au vrai chemin de ton composant dans ton projet.
 */
import "../Styles/animations.css";

// TODO : adapte ce chemin a l'emplacement reel de ton composant Card.
import Card from "@/features/card/components/card";

import type { CardData } from "../schema/card.schema";

export interface CardGridProps {
  cards: CardData[];
  /** Taille des cartes en pixels (la prop `size` de ton composant Card). */
  cardSize?: number;
  /** Delai entre chaque carte qui apparait (en secondes). */
  cascadeDelaySeconds?: number;
  /** Callback optionnel sur le clic d'une carte. */
  onCardClick?: (card: CardData) => void;
}

export function CardGrid({
  cards,
  cardSize = 200,
  cascadeDelaySeconds = 0.15,
  onCardClick,
}: CardGridProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-18 justify-center max-w-275">
      {cards.map((card, index) => (
        <div
          key={`${card.slug}-${index}`}
          style={{
            // Chaque carte est lancee avec un delai croissant.
            // Cf. Styles/animations.css pour le keyframe.
            animation: `booster-card-enter 0.6s ${index * cascadeDelaySeconds}s both`,
          }}
        >
          <Card
            card={card}
            size={cardSize}
            onClick={onCardClick ? () => onCardClick(card) : undefined}
          />
        </div>
      ))}
    </div>
  );
}
