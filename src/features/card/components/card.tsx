import styles from "../style/Card.module.css";
import { FaHeart } from "react-icons/fa";
import { PiHandFistFill } from "react-icons/pi";
import { LuDonut } from "react-icons/lu";

interface CardProps {
  name?: string;
  slug?: string;
  type?: "Personnage" | "Terrain" | "Objet";
  rarity?: string;
  ATK?: number;
  PV?: number;
  family?: string;
  affinity?: string;
  serie?: {
    name_serie: string;
    position: number;
  };
  card?: {
    name: string;
    slug: string;
    type: "Personnage" | "Terrain" | "Objet";
    rarity: string;
    ATK: number;
    PV: number;
    family: string;
    affinity: string;
    serie: {
      name_serie: string;
      position: number;
    };
  };
}

function Card(props: CardProps) {
  const dataSource = props.card ? props.card : props;

  const { name, slug, type, rarity, ATK, PV, family, affinity, serie } =
    dataSource;

  if (!slug) {
    return <div className={styles.cardError}>Carte invalide</div>;
  }

  // 1. Mapping pour la classe CSS de rareté
  const rarityStyles: Record<string, string> = {
    "1": styles.commun,
    "2": styles.rare,
    "3": styles.legendaire,
  };
  const currentRarityClass = rarityStyles[rarity || "1"] || styles.commun;

  const rarityDonuts = [];
  const rarityCount = parseInt(rarity || "1") || 1;
  for (let i = 0; i < rarityCount; i++) {
    rarityDonuts.push(<LuDonut key={i} />);
  }

  const currentType = type ? type.toLowerCase() : "";
  const bgImageUrl = `/cards/${slug}.webp`;
  const videoUrl = `/cards/${slug}-anime.webm`;

  return (
    <div
      // 🎯 Injection de la classe de rareté (styles.commun, styles.rare ou styles.legendaire)
      className={`${styles.card} ${styles[`type-${currentType}`] || ""} ${currentRarityClass}`}
      style={{
        backgroundImage: `url('${bgImageUrl}')`,
      }}
    >
      {/* 🎥 Vidéo d'arrière-plan pour les cartes Ultra Rares / Légendaires */}
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
              {family && family !== "Sans Famille" && (
                <span className={styles.famille}>
                  <span className={styles.nameFamille}>{family}</span>
                </span>
              )}
              {affinity && affinity !== "Sans Affinité" && (
                <span className={styles.affinite}>
                  <span className={styles.nameAffinite}>{affinity}</span>
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
          {serie?.name_serie} - {serie?.position}/50
        </span>
        <span className={styles.rarity}>{rarityDonuts}</span>
      </div>
    </div>
  );
}

export default Card;
