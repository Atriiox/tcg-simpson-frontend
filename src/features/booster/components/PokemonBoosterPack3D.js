/**
 * PokemonBoosterPack3D
 * ============================================================
 * Rendu 3D d'un booster Pokémon TCG avec Three.js / R3F.
 *
 * Le visuel du booster vient d'une IMAGE RÉELLE fournie par
 * l'utilisateur (passée via la prop `imageUrl`). On l'applique
 * comme map de texture sur un plane 3D, on ajoute une normal map
 * procédurale pour les plis du film plastique, et on éclaire la
 * scène avec une HDRI pour des reflets réalistes.
 *
 * Le geste de déchirure : on tient le clic sur le booster et on
 * glisse de gauche à droite. La moitié haute se déchire et pivote
 * autour de la ligne de déchirure. À 90% on déclenche l'ouverture
 * et on affiche 5 cartes piochées via la PokéAPI.
 *
 * UTILISATION :
 *   1. Place ton image de booster dans /public/booster.png
 *   2. <PokemonBoosterPack3D />  (charge /booster.png par défaut)
 *   3. Ou : <PokemonBoosterPack3D imageUrl="/mon-booster.jpg" />
 *
 * Dépendances : three  @react-three/fiber  @react-three/drei
 * ============================================================
 */
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// ============================================================
// Données Pokémon (pool et helpers)
// ============================================================

const SIMPSON_CARDS = [];

const POKEMON_IDS = [
  1, 3, 4, 6, 7, 9, 12, 18, 25, 26, 39, 52, 59, 65, 68, 76, 78, 82, 89, 94, 113,
  130, 131, 134, 135, 136, 143, 144, 145, 146, 149, 150, 151, 196, 197, 248,
  282, 359, 376, 384, 445, 448, 658, 700,
];
const ULTRA_RARE_IDS = new Set([144, 145, 146, 150, 151, 248, 384, 448]);
const RARE_IDS = new Set([
  3, 6, 9, 65, 94, 130, 134, 135, 136, 143, 149, 196, 197, 282, 359, 376, 445,
  658,
]);
const TYPE_FR = {
  normal: "Normal",
  fire: "Feu",
  water: "Eau",
  electric: "Électrique",
  grass: "Plante",
  ice: "Glace",
  fighting: "Combat",
  poison: "Poison",
  ground: "Sol",
  flying: "Vol",
  psychic: "Psy",
  bug: "Insecte",
  rock: "Roche",
  ghost: "Spectre",
  dragon: "Dragon",
  dark: "Ténèbres",
  steel: "Acier",
  fairy: "Fée",
};
const TYPE_COLORS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const pokemonCache = new Map();

async function fetchPokemonCard(id) {
  if (pokemonCache.has(id)) return pokemonCache.get(id);

  const [pokeRes, speciesRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);
  if (!pokeRes.ok || !speciesRes.ok) throw new Error(`#${id}`);
  const pokemon = await pokeRes.json();
  const species = await speciesRes.json();
  const frenchName =
    species.names.find((n) => n.language.name === "fr")?.name ||
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const primaryTypeEn = pokemon.types[0]?.type?.name || "normal";
  const baseHp =
    pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 50;
  const image =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;
  const rarity = ULTRA_RARE_IDS.has(id)
    ? "ultra"
    : RARE_IDS.has(id)
      ? "rare"
      : "common";
  const card = {
    id,
    name: frenchName,
    type: TYPE_FR[primaryTypeEn] || primaryTypeEn,
    color: TYPE_COLORS[primaryTypeEn] || "#888",
    hp: Math.round(baseHp * 1.5 + 30),
    image,
    rarity,
  };
  pokemonCache.set(id, card);
  return card;
}

async function pickRandomCards(count = 5) {
  const shuffled = [...POKEMON_IDS].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, count);
  const hasRare = picked.some(
    (id) => RARE_IDS.has(id) || ULTRA_RARE_IDS.has(id),
  );
  if (!hasRare) {
    const rares = [...RARE_IDS, ...ULTRA_RARE_IDS];
    picked[picked.length - 1] = rares[Math.floor(Math.random() * rares.length)];
  }
  return Promise.all(picked.map(fetchPokemonCard));
}

// ============================================================
// Normal map procédurale (plis du film plastique)
// ============================================================
function generateNormalMap(canvas) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const img = ctx.createImageData(W, H);
  const data = img.data;

  // Height map (somme de sinusoïdes pseudo-aléatoires)
  const heights = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const h =
        Math.sin(x * 0.025 + y * 0.04) * 0.5 +
        Math.sin(x * 0.06 - y * 0.02) * 0.3 +
        Math.sin(x * 0.13 + y * 0.11) * 0.15 +
        Math.cos(x * 0.018 + y * 0.08) * 0.2;
      heights[y * W + x] = h;
    }
  }

  // Différences centrales -> normales
  const SCALE = 2.0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      const hL = heights[Math.max(0, x - 1) + y * W];
      const hR = heights[Math.min(W - 1, x + 1) + y * W];
      const hU = heights[x + Math.max(0, y - 1) * W];
      const hD = heights[x + Math.min(H - 1, y + 1) * W];
      const dx = (hR - hL) * SCALE;
      const dy = (hD - hU) * SCALE;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const nx = -dx / len;
      const ny = -dy / len;
      const nz = 1 / len;
      const i = idx * 4;
      data[i + 0] = (nx * 0.5 + 0.5) * 255;
      data[i + 1] = (ny * 0.5 + 0.5) * 255;
      data[i + 2] = (nz * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// ============================================================
// Détecte la bounding box du booster dans une image (ignore
// les bandes noires qui entourent la photo). On échantillonne
// sur une version réduite pour aller vite.
// ============================================================
function detectBoosterBounds(img) {
  const SAMPLE_W = 200;
  const sampleH = Math.round((SAMPLE_W * img.naturalHeight) / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_W;
  canvas.height = sampleH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, SAMPLE_W, sampleH);
  const data = ctx.getImageData(0, 0, SAMPLE_W, sampleH).data;

  // Seuil de "noirceur" + on cherche la première ligne/colonne
  // où moins de 92% des pixels sont sombres
  const isDark = (r, g, b) => (r + g + b) / 3 < 28;
  const ROW_THRESHOLD = 0.92;

  const rowDarkRatio = (y) => {
    let n = 0;
    for (let x = 0; x < SAMPLE_W; x++) {
      const i = (y * SAMPLE_W + x) * 4;
      if (isDark(data[i], data[i + 1], data[i + 2])) n++;
    }
    return n / SAMPLE_W;
  };
  const colDarkRatio = (x) => {
    let n = 0;
    for (let y = 0; y < sampleH; y++) {
      const i = (y * SAMPLE_W + x) * 4;
      if (isDark(data[i], data[i + 1], data[i + 2])) n++;
    }
    return n / sampleH;
  };

  let minY = 0;
  while (minY < sampleH - 1 && rowDarkRatio(minY) > ROW_THRESHOLD) minY++;
  let maxY = sampleH - 1;
  while (maxY > 0 && rowDarkRatio(maxY) > ROW_THRESHOLD) maxY--;
  let minX = 0;
  while (minX < SAMPLE_W - 1 && colDarkRatio(minX) > ROW_THRESHOLD) minX++;
  let maxX = SAMPLE_W - 1;
  while (maxX > 0 && colDarkRatio(maxX) > ROW_THRESHOLD) maxX--;

  // Petite marge de sécurité pour ne pas couper le booster
  const PAD = 2;
  minX = Math.max(0, minX - PAD);
  minY = Math.max(0, minY - PAD);
  maxX = Math.min(SAMPLE_W - 1, maxX + PAD);
  maxY = Math.min(sampleH - 1, maxY + PAD);

  // Normalisation en UV [0..1] (top-left origin)
  const u0 = minX / SAMPLE_W;
  const u1 = (maxX + 1) / SAMPLE_W;
  const yTop = minY / sampleH;
  const yBottom = (maxY + 1) / sampleH;

  // Ratio largeur/hauteur de la zone détectée (proportions du
  // vrai booster). Si la détection échoue on retombe sur 1949/2600.
  const w = (u1 - u0) * img.naturalWidth;
  const h = (yBottom - yTop) * img.naturalHeight;
  const aspect = w > 0 && h > 0 ? w / h : 1949 / 2600;

  // Pour Three.js (flipY=true) : v augmente vers le haut de l'image
  return {
    u0,
    u1,
    v0: 1 - yBottom, // bas du booster (texture v faible)
    v1: 1 - yTop, // haut du booster (texture v fort)
    aspect,
  };
}

// ============================================================
// Hook : charge l'image du booster + génère la normal map
// ============================================================
function useBoosterTextures(imageUrl) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;

      // Détection de la zone du booster dans la photo (ignore le fond noir)
      const bounds = detectBoosterBounds(img);

      // Texture couleur = image directe
      const colorTex = new THREE.Texture(img);
      colorTex.colorSpace = THREE.SRGBColorSpace;
      colorTex.anisotropy = 16;
      colorTex.minFilter = THREE.LinearMipmapLinearFilter;
      colorTex.magFilter = THREE.LinearFilter;
      colorTex.wrapS = THREE.ClampToEdgeWrapping;
      colorTex.wrapT = THREE.ClampToEdgeWrapping;
      colorTex.needsUpdate = true;

      // Normal map procédurale (plis plastique)
      const cNormal = document.createElement("canvas");
      cNormal.width = 512;
      cNormal.height = 800;
      generateNormalMap(cNormal);
      const normalTex = new THREE.CanvasTexture(cNormal);
      normalTex.wrapS = THREE.RepeatWrapping;
      normalTex.wrapT = THREE.RepeatWrapping;
      normalTex.anisotropy = 8;
      normalTex.needsUpdate = true;

      setData({
        color: colorTex,
        normal: normalTex,
        bounds,
        aspect: bounds.aspect, // proportions DU BOOSTER, pas de l'image
      });
    };
    img.onerror = () => {
      console.error(
        `[PokemonBoosterPack3D] Impossible de charger l'image "${imageUrl}". ` +
          `Place une image PNG/JPG dans /public/ et passe son chemin en prop.`,
      );
    };
    img.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return data;
}

// ============================================================
// Géométrie : un plane dont les UVs ne pointent QUE sur la zone
// du booster (cadré dans la texture via `bounds`).
//
// vStart/vEnd sont exprimés en coordonnées-booster [0..1],
// puis remappés vers les coords-texture via les bounds détectés.
// ============================================================
function buildPartialUVPlane(width, height, vStart, vEnd, bounds) {
  const geo = new THREE.PlaneGeometry(width, height, 1, 1);
  const uvs = geo.attributes.uv.array;
  const { u0, u1, v0, v1 } = bounds;

  for (let i = 0; i < uvs.length; i += 2) {
    const planeU = uvs[i];
    const planeV = uvs[i + 1];
    // U : on cadre sur la largeur du booster dans la texture
    uvs[i] = u0 + planeU * (u1 - u0);
    // V : on mappe d'abord vers la coord-booster [vStart..vEnd]
    // puis on remappe vers la coord-texture via les bounds
    const boosterV = vStart + planeV * (vEnd - vStart);
    uvs[i + 1] = v0 + boosterV * (v1 - v0);
  }
  geo.attributes.uv.needsUpdate = true;
  return geo;
}

// ============================================================
// Mesh 3D du booster (top + bottom)
// ============================================================
const PACK_W = 2.0;
const TEAR_V = 0.12; // ligne de déchirure (12% depuis le haut)

function BoosterMesh({ tearProgress, isOpening, textures }) {
  const bounds = textures?.bounds;
  // Aspect ratio DU BOOSTER (pas de l'image entière)
  const aspect = textures?.aspect ?? 1949 / 2600;
  const packH = PACK_W / aspect;
  const topH = packH * TEAR_V;
  const botH = packH * (1 - TEAR_V);

  const topPivotRef = useRef();
  const bottomMeshRef = useRef();

  const topGeo = useMemo(
    () =>
      bounds ? buildPartialUVPlane(PACK_W, topH, 1 - TEAR_V, 1, bounds) : null,
    [topH, bounds],
  );
  const botGeo = useMemo(
    () =>
      bounds ? buildPartialUVPlane(PACK_W, botH, 0, 1 - TEAR_V, bounds) : null,
    [botH, bounds],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Léger flottement en idle
    if (bottomMeshRef.current && !isOpening) {
      const bob = Math.sin(t * 1.2) * 0.025;
      bottomMeshRef.current.position.y = -packH / 2 + botH / 2 + bob;
      if (topPivotRef.current) {
        topPivotRef.current.position.y = botH - packH / 2 + bob;
      }
    }
    // Animation de déchirure : 0 → 90° (et arrachage vers la caméra)
    if (topPivotRef.current) {
      const p = Math.min(1, Math.max(0, tearProgress / 100));
      const angle = p * (Math.PI / 2); // jusqu'à 90° (edge-on)
      const liftZ = p * 0.6; // vers la caméra
      const liftY = p * 0.25; // remonte un peu
      topPivotRef.current.rotation.x = -angle;
      topPivotRef.current.position.z = liftZ;
      topPivotRef.current.position.y =
        botH - packH / 2 + liftY + (isOpening ? 0 : Math.sin(t * 1.2) * 0.025);
    }
  });

  if (!textures || !topGeo || !botGeo) return null;

  // Matériau : photo déjà éclairée -> on garde du clearcoat
  // pour le brillant plastique, mais on baisse metalness pour
  // ne pas "double-éclairer" l'image
  const matProps = {
    map: textures.color,
    normalMap: textures.normal,
    normalScale: new THREE.Vector2(0.22, 0.22),
    metalness: 0.15,
    roughness: 0.45,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.7,
    side: THREE.FrontSide, // on ne veut pas voir le dos (texture miroir)
    transparent: true,
  };

  return (
    <group>
      {/* Moitié basse (statique) */}
      <mesh
        ref={bottomMeshRef}
        geometry={botGeo}
        position={[0, -packH / 2 + botH / 2, 0]}
      >
        <meshPhysicalMaterial {...matProps} />
      </mesh>

      {/* Moitié haute (pivote autour de la ligne de déchirure) */}
      <group ref={topPivotRef} position={[0, botH - packH / 2, 0]}>
        <mesh geometry={topGeo} position={[0, topH / 2, 0]}>
          <meshPhysicalMaterial {...matProps} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================
// Inclinaison du groupe en fonction de la souris (parallaxe)
// ============================================================
function ParallaxGroup({ tilt, isOpening, children }) {
  const groupRef = useRef();
  useFrame(() => {
    if (!groupRef.current) return;
    const target = isOpening ? { rx: 0, ry: 0 } : tilt;
    groupRef.current.rotation.x +=
      (target.rx - groupRef.current.rotation.x) * 0.08;
    groupRef.current.rotation.y +=
      (target.ry - groupRef.current.rotation.y) * 0.08;
  });
  return <group ref={groupRef}>{children}</group>;
}

// ============================================================
// Scène R3F complète
// ============================================================
function BoosterScene({ tearProgress, isOpening, tilt, textures }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.5], fov: 30 }}
      style={{ width: "100%", height: "100%" }}
      // Ajout de alpha: true pour autoriser la transparence du WebGL
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        alpha: true,
      }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = "none";
        // Optionnel : force le clearColor à transparent
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Environment preset="city" />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={0.9} />
      <pointLight position={[-4, -2, 3]} intensity={0.4} color="#9b6bff" />
      <pointLight position={[4, -1, 2]} intensity={0.35} color="#ff7a3d" />

      <ParallaxGroup tilt={tilt} isOpening={isOpening}>
        <BoosterMesh
          tearProgress={tearProgress}
          isOpening={isOpening}
          textures={textures}
        />
      </ParallaxGroup>
    </Canvas>
  );
}

// ============================================================
// Cartes (2D, identique à la version d'avant)
// ============================================================
function CardReveal({ cards, onReset }) {
  return (
    <div style={styles.revealWrapper}>
      <h2 style={styles.revealTitle}>✨ Tes cartes ! ✨</h2>
      <div style={styles.cardsGrid}>
        {cards.map((card, idx) => (
          <PokemonCard key={`${card.id}-${idx}`} card={card} index={idx} />
        ))}
      </div>
      <button style={styles.resetBtn} onClick={onReset}>
        🎁 Ouvrir un autre booster
      </button>
    </div>
  );
}

function PokemonCard({ card, index }) {
  const isUltra = card.rarity === "ultra";
  return (
    <div
      style={{
        ...styles.cardOuter,
        animation: `cardEnter 0.6s ${index * 0.15}s both`,
        background: `linear-gradient(160deg, ${lighten(card.color)} 0%, ${card.color} 60%, ${darken(card.color)} 100%)`,
        boxShadow: isUltra
          ? `0 0 30px ${card.color}, 0 12px 30px rgba(0,0,0,0.4)`
          : "0 12px 30px rgba(0,0,0,0.3)",
      }}
    >
      {isUltra && <div style={styles.cardHolo} />}
      <div style={styles.cardHeader}>
        <span style={styles.cardName}>{card.name}</span>
        <span style={styles.cardHp}>PV {card.hp}</span>
      </div>
      <div style={styles.cardImageBox}>
        {card.image ? (
          <img
            src={card.image}
            alt={card.name}
            style={styles.cardImage}
            draggable={false}
          />
        ) : (
          <div style={{ color: "#666", fontSize: 12 }}>Image indisponible</div>
        )}
      </div>
      <div style={styles.cardFooter}>
        <span style={styles.cardType}>{card.type}</span>
        <span
          style={{
            ...styles.cardRarity,
            color: isUltra ? "#FFD700" : "#fff",
          }}
        >
          {card.rarity === "ultra"
            ? "★ ULTRA ★"
            : card.rarity === "rare"
              ? "◆ RARE"
              : "● COMMUNE"}
        </span>
      </div>
    </div>
  );
}

function LoadingSpinner({ label = "Chargement..." }) {
  return (
    <div style={styles.loadingWrapper}>
      <div style={styles.spinnerBall}>
        <div style={styles.spinnerTop} />
        <div style={styles.spinnerBand} />
        <div style={styles.spinnerButton} />
      </div>
      <p style={styles.loadingText}>{label}</p>
    </div>
  );
}

function lighten(hex, amt = 30) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255, r + amt)}, ${Math.min(255, g + amt)}, ${Math.min(255, b + amt)})`;
}
function darken(hex, amt = 50) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.max(0, r - amt)}, ${Math.max(0, g - amt)}, ${Math.max(0, b - amt)})`;
}
function hexToRgb(hex) {
  const v = hex.replace("#", "");
  return {
    r: parseInt(v.substring(0, 2), 16),
    g: parseInt(v.substring(2, 4), 16),
    b: parseInt(v.substring(4, 6), 16),
  };
}

// ============================================================
// Composant principal
// ============================================================
export default function PokemonBoosterPack3D({ imageUrl = "/booster1.webp" }) {
  const [tearProgress, setTearProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const containerRef = useRef(null);
  const dragStartXRef = useRef(0);
  const openedRef = useRef(false);

  const textures = useBoosterTextures(imageUrl);

  // Détecte si l'image n'a pas chargé (timeout 3s)
  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => {
    if (textures) return;
    const t = setTimeout(() => setImgFailed(true), 3000);
    return () => clearTimeout(t);
  }, [textures]);

  // Pioche 5 cartes puis affiche la grille
  const triggerOpen = useCallback(async () => {
    if (openedRef.current) return;
    openedRef.current = true;
    setIsDragging(false);
    setLoading(true);
    setError(null);
    try {
      const fetched = await pickRandomCards(5);
      // Laisse l'animation de déchirure se finir avant d'ouvrir
      await new Promise((r) => setTimeout(r, 600));
      setCards(fetched);
      setIsOpened(true);
    } catch (e) {
      console.error(e);
      setError("Impossible de contacter la PokéAPI 😕");
      openedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Démarrage du drag
  const handlePointerDown = (e) => {
    if (isOpened || loading) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
  };

  // Pendant le drag : listeners globaux pour ne JAMAIS perdre le geste
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (ev) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = ev.clientX - dragStartXRef.current;
      const progress = Math.max(0, Math.min(100, (dx / rect.width) * 100));
      setTearProgress(progress);
      if (progress >= 90) {
        triggerOpen();
      }
    };
    const onUp = () => {
      setIsDragging(false);
      // Annulation si pas assez loin
      setTearProgress((p) => (p >= 90 ? p : 0));
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [isDragging, triggerOpen]);

  // Parallaxe (hors drag)
  const handleHoverMove = (e) => {
    if (isDragging || isOpened || loading) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    setTilt({ rx: -ny * 0.25, ry: nx * 0.3 });
  };

  const handleHoverLeave = () => {
    if (!isDragging) setTilt({ rx: 0, ry: 0 });
  };

  const reset = () => {
    setIsOpened(false);
    setTearProgress(0);
    setCards([]);
    setError(null);
    openedRef.current = false;
  };

  const isOpening = tearProgress > 3 || loading;

  return (
    <div style={styles.scene}>
      <style>{KEYFRAMES}</style>

      {!isOpened && (
        <div ref={containerRef} style={styles.canvasWrapper}>
          {/* Canvas R3F en arrière-plan */}
          <div style={styles.canvasLayer}>
            <BoosterScene
              tearProgress={tearProgress}
              isOpening={isOpening}
              tilt={tilt}
              textures={textures}
            />
          </div>

          {/* OVERLAY transparent qui capture TOUS les pointer events */}
          <div
            style={styles.eventOverlay}
            onPointerDown={handlePointerDown}
            onPointerMove={handleHoverMove}
            onPointerLeave={handleHoverLeave}
          />

          {/* États : chargement / erreur image */}
          {!textures && !imgFailed && (
            <div style={styles.statusOverlay}>
              <LoadingSpinner label="Chargement du booster..." />
            </div>
          )}
          {!textures && imgFailed && (
            <div style={styles.statusOverlay}>
              <div style={styles.errorBox}>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  📦 Aucune image trouvée à <code>{imageUrl}</code>
                </p>
                <p style={{ margin: "8px 0 0", fontSize: 13 }}>
                  Place une image PNG/JPG du booster dans &nbsp;
                  <code>/public/booster1.webp</code>&nbsp; ou passe son chemin
                  en prop&nbsp;:
                  <br />
                  <code>
                    &lt;PokemonBoosterPack3D imageUrl="/ton-image.png" /&gt;
                  </code>
                </p>
              </div>
            </div>
          )}

          {/* Loading "ouverture" */}
          {loading && (
            <div style={styles.statusOverlay}>
              <LoadingSpinner label="Récupération des cartes..." />
            </div>
          )}

          {/* Hint en bas */}
          {textures && !loading && (
            <p style={styles.hint}>
              {error
                ? error
                : tearProgress < 3
                  ? "💡 Clique sur le booster et glisse de gauche à droite"
                  : tearProgress < 90
                    ? "Continue à tirer..."
                    : ""}
            </p>
          )}
        </div>
      )}

      {isOpened && <CardReveal cards={cards} onReset={reset} />}
    </div>
  );
}

// ============================================================
// Styles + keyframes
// ============================================================
const KEYFRAMES = `
@keyframes cardEnter {
  0%   { opacity: 0; transform: translateY(40px) scale(0.6) rotate(-8deg); }
  60%  { opacity: 1; transform: translateY(-10px) scale(1.05) rotate(2deg); }
  100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
@keyframes wobble {
  0%, 100% { transform: rotate(-12deg); }
  50%      { transform: rotate( 12deg); }
}
`;

const styles = {
  scene: {
    minHeight: "100vh",
    width: "100%",
    // Remplacement du radial-gradient par un fond transparent
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    overflow: "hidden",
    userSelect: "none",
  },
  canvasWrapper: {
    width: 360,
    height: 500,
    position: "relative",
  },
  canvasLayer: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
  },
  // Couche transparente AU-DESSUS du canvas qui capture les events
  eventOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    cursor: "grab",
    touchAction: "none",
  },
  statusOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(1px)",
    WebkitBackdropFilter: "blur(1px)",
    borderRadius: 8,
    pointerEvents: "none",
  },
  errorBox: {
    color: "#fee",
    background: "rgba(120, 20, 30, 0.9)",
    padding: "18px 22px",
    borderRadius: 10,
    maxWidth: 440,
    fontSize: 14,
    lineHeight: 1.45,
  },
  hint: {
    position: "absolute",
    bottom: -36,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#cbd5e1",
    fontSize: 14,
    fontStyle: "italic",
    margin: 0,
    zIndex: 4,
  },

  // Loading
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
  },
  spinnerBall: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "white",
    position: "relative",
    overflow: "hidden",
    border: "5px solid #111",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    animation: "wobble 0.6s ease-in-out infinite",
  },
  spinnerTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "#dc2626",
  },
  spinnerBand: {
    position: "absolute",
    top: "calc(50% - 4px)",
    left: 0,
    right: 0,
    height: 8,
    background: "#111",
  },
  spinnerButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "white",
    border: "4px solid #111",
    zIndex: 2,
  },
  loadingText: {
    color: "#fde68a",
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 1,
  },

  // Card reveal
  revealWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
    width: "100%",
  },
  revealTitle: {
    color: "#fde68a",
    fontSize: 32,
    margin: 0,
    textShadow: "0 0 20px #f59e0b",
  },
  cardsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    justifyContent: "center",
    maxWidth: 1100,
    marginTop: 16,
  },
  cardOuter: {
    width: 180,
    height: 250,
    position: "relative",
    border: "6px solid #fde68a",
    borderRadius: 12,
    overflow: "hidden",
    padding: 8,
    display: "flex",
    flexDirection: "column",
  },
  cardHolo: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.6) 50%, transparent 65%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 2.5s linear infinite",
    mixBlendMode: "overlay",
    pointerEvents: "none",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  },
  cardName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 110,
  },
  cardHp: {
    background: "rgba(0,0,0,0.4)",
    padding: "2px 6px",
    borderRadius: 6,
    fontSize: 11,
  },
  cardImageBox: {
    flex: 1,
    background: "rgba(255,255,255,0.85)",
    borderRadius: 8,
    margin: "6px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  cardImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.5,
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  },
  cardType: {
    background: "rgba(0,0,0,0.35)",
    padding: "2px 6px",
    borderRadius: 4,
  },
  cardRarity: { fontWeight: 800 },
  resetBtn: {
    marginTop: 24,
    padding: "12px 28px",
    background: "linear-gradient(135deg, #f59e0b, #dc2626)",
    color: "white",
    border: "none",
    borderRadius: 999,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(245, 158, 11, 0.5)",
    letterSpacing: 1,
  },
};
