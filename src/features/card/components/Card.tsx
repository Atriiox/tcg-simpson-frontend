"use client";

import styles from "@card/style/Card.module.css";
import { FaHeart } from "react-icons/fa";
import { PiHandFistFill } from "react-icons/pi";
import { LuDonut } from "react-icons/lu";

import type { Card } from "@/features/card/schema/card.schema";

interface CardProps {
  card: Card;
  onClick?: () => void;
  size?: number;
}

function Card({ card, onClick, size = 200 }: CardProps) {
  const { name, slug, type, rarity, ATK, PV, family, affinity, serie } = card;

  if (!slug) {
    return <div className={styles.cardError}>Carte invalide</div>;
  }

  const rarityStyles: Record<string, string> = {
    "1": styles.commun,
    "2": styles.rare,
    "3": styles.legendaire,
  };
  const currentRarityClass = rarityStyles[rarity] || styles.commun;

  const rarityDonuts = [];
  const rarityCount = parseInt(rarity) || 1;
  for (let i = 0; i < rarityCount; i++) {
    rarityDonuts.push(<LuDonut key={i} />);
  }

  const currentType = type.toLowerCase();
  const bgImageUrl = `/cards/${slug}.webp`;
  const videoUrl = `/cards/${slug}-anime.webm`;

  return (
    <div
      className={`${styles.card} ${styles[`type-${currentType}`] || ""} ${currentRarityClass} select-none`}
      style={{
        backgroundImage: `url('${bgImageUrl}')`,
        width: `${size}px`,
        maxWidth: size,
        minWidth: size,
        fontSize: `${size / 10}px`,
      }}
      onClick={onClick}
    >
      {rarity === "3" && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.videoBackground}
        >
          <source src={videoUrl} type="video/webm" />
        </video>
      )}

      <div className={styles.headerCard}>
        <span className={styles.name}>{name}</span>
      </div>

      <div className={styles.contentCard}>
        {currentType === "personnage" && (
          <>
            <div className={styles.desc}>
              {family.name && family.name !== "Sans Famille" && (
                <span className={styles.famille}>
                  <span className={styles.nameFamille}>{family.name}</span>
                </span>
              )}
              {affinity.name && affinity.name !== "Sans Affinité" && (
                <span className={styles.affinite}>
                  <span className={styles.nameAffinite}>{affinity.name}</span>
                </span>
              )}
            </div>

            <div className={styles.stats}>
              <span className={styles.atk}>
                {ATK} <PiHandFistFill />
              </span>
              <span className={styles.pv}>
                {PV} <FaHeart />
              </span>
            </div>
          </>
        )}

        {currentType === "terrain" && (
          <div className={styles.desc}>
            <span className={styles.terrain}>
              <span className={styles.nameTerrain}>{name}</span>
            </span>
          </div>
        )}

        {currentType === "objet" && (
          <div className={styles.desc}>
            <span className={styles.objet}>
              <span className={styles.nameObjet}>{name}</span>
            </span>
          </div>
        )}
      </div>

      <div className={styles.footerCard}>
        <span>
          {serie.id_serie.name} - {serie.position}/50
        </span>
        <span className={styles.rarity}>{rarityDonuts}</span>
      </div>
    </div>
  );
}

export default Card;
