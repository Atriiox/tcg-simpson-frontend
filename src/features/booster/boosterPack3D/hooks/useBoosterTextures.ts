/**
 * Charge l'image du booster et genere une normal map procedurale
 * pour simuler les plis du film plastique.
 *
 * Detecte aussi automatiquement la zone du booster dans l'image
 * (ignore les bandes noires autour) pour cadrer la texture sur
 * le mesh 3D.
 *
 * Concepts utilises (voir CONCEPTS.md) :
 * - Textures et coordonnees UV (§9)
 * - Normal maps : encoder du relief dans une image (§10)
 * - Settings de texture : colorSpace, anisotropy, mipmaps (§12)
 */
import { useEffect, useState } from "react";
import * as THREE from "three";
import { DEFAULT_BOOSTER_ASPECT_RATIO } from "../schema/constants";
import type {
  BoosterBounds,
  BoosterTextures,
} from "../schema/booster.schema";

// ============================================================
// Helpers internes
// ============================================================

/**
 * Genere une normal map procedurale dans le canvas fourni.
 *
 * Une normal map encode dans chaque pixel une DIRECTION (la normale
 * a la surface a cet endroit) au lieu d'une couleur. Le shader 3D
 * utilise ensuite ces normales pour calculer l'eclairage comme si
 * la surface etait bossuee, alors que le mesh est plat. C'est
 * l'astuce qui permet de simuler des plis sans ajouter de polygones.
 * Voir CONCEPTS.md §10 pour le pourquoi du comment.
 *
 * Algo :
 *  1. On somme des sinusoides pour obtenir un "height map" (altitude
 *     de chaque pixel, comme une carte topographique).
 *  2. On calcule la NORMALE en chaque pixel via differences centrales :
 *     pente horizontale -> normalX, pente verticale -> normalY,
 *     plus une composante Z pour normaliser le vecteur.
 *  3. On encode chaque normale (x,y,z) dans les canaux (R,G,B) du pixel
 *     via la transformation standard : color = normal * 0.5 + 0.5
 *     (parce que les normales vont de -1 a 1 et qu'on a besoin de 0 a 255).
 */
function generateNormalMap(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext("2d");
  if (!context) return;

  const width = canvas.width;
  const height = canvas.height;
  const imageData = context.createImageData(width, height);
  const pixelData = imageData.data;

  // Etape 1 : height map = somme de plusieurs sinusoides a frequences
  // et amplitudes differentes. Resultat : un terrain pseudo-aleatoire
  // avec des bosses et des plis a plusieurs echelles.
  const heightMap = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sampledHeight =
        Math.sin(x * 0.025 + y * 0.04) * 0.5 +   // grosses ondulations
        Math.sin(x * 0.06 - y * 0.02) * 0.3 +    // ondulations moyennes
        Math.sin(x * 0.13 + y * 0.11) * 0.15 +   // petits plis
        Math.cos(x * 0.018 + y * 0.08) * 0.2;    // variation longue
      heightMap[y * width + x] = sampledHeight;
    }
  }

  // Etape 2 : pour chaque pixel, on regarde l'altitude des 4 voisins
  // (gauche/droite/haut/bas) et on en deduit la pente locale.
  // Plus la pente est forte, plus la normale est inclinee.
  const GRADIENT_SCALE = 2.0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const heightLeft = heightMap[Math.max(0, x - 1) + y * width];
      const heightRight = heightMap[Math.min(width - 1, x + 1) + y * width];
      const heightUp = heightMap[x + Math.max(0, y - 1) * width];
      const heightDown = heightMap[x + Math.min(height - 1, y + 1) * width];

      // Gradient = difference de hauteur entre voisins.
      // Positif = ca monte vers la droite/le bas.
      const gradientX = (heightRight - heightLeft) * GRADIENT_SCALE;
      const gradientY = (heightDown - heightUp) * GRADIENT_SCALE;

      // Normalisation du vecteur (gradientX, gradientY, 1) pour
      // obtenir un vrai vecteur unitaire (longueur = 1).
      const length = Math.sqrt(
        gradientX * gradientX + gradientY * gradientY + 1
      );

      // La normale pointe a l'oppose du gradient (regle physique :
      // si ca monte vers la droite, la normale pointe vers la gauche).
      const normalX = -gradientX / length;
      const normalY = -gradientY / length;
      const normalZ = 1 / length; // toujours positive (face avant)

      // Etape 3 : encodage normale (-1..1) -> couleur (0..255).
      // C'est la formule standard utilisee par TOUTES les normal maps.
      const byteOffset = pixelIndex * 4;
      pixelData[byteOffset + 0] = (normalX * 0.5 + 0.5) * 255; // R
      pixelData[byteOffset + 1] = (normalY * 0.5 + 0.5) * 255; // G
      pixelData[byteOffset + 2] = (normalZ * 0.5 + 0.5) * 255; // B
      pixelData[byteOffset + 3] = 255;                         // A (opaque)
    }
  }

  context.putImageData(imageData, 0, 0);
}

/**
 * Detecte la bounding box du booster dans une image (ignore les
 * bandes noires qui entourent la photo). Echantillonne sur une
 * version reduite (200px de large) pour aller vite.
 *
 * Principe :
 *  - Pour chaque ligne de pixels, on compte combien sont "sombres".
 *  - Si plus de 92% des pixels d'une ligne sont sombres, c'est
 *    probablement une bande noire (donc PAS le booster).
 *  - On avance depuis chaque bord (haut/bas/gauche/droite) vers le
 *    centre tant qu'on est sur des bandes noires.
 *  - Des qu'on tombe sur une ligne avec moins de 92% de pixels
 *    sombres, on s'arrete : c'est le bord du booster.
 *
 * Resultat : coordonnees UV (0..1) des bornes du booster dans
 * l'image, plus le ratio largeur/hauteur du booster lui-meme.
 */
function detectBoosterBounds(imageElement: HTMLImageElement): BoosterBounds {
  const SAMPLE_WIDTH = 200;
  const sampleHeight = Math.round(
    (SAMPLE_WIDTH * imageElement.naturalHeight) / imageElement.naturalWidth
  );

  // On dessine l'image dans un canvas reduit pour pouvoir lire ses pixels.
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = SAMPLE_WIDTH;
  sampleCanvas.height = sampleHeight;
  const context = sampleCanvas.getContext("2d");
  if (!context) {
    // Fallback : si le canvas 2D n'est pas dispo, on utilise toute l'image.
    return {
      uMin: 0,
      uMax: 1,
      vMin: 0,
      vMax: 1,
      aspectRatio: DEFAULT_BOOSTER_ASPECT_RATIO,
    };
  }
  context.drawImage(imageElement, 0, 0, SAMPLE_WIDTH, sampleHeight);
  const pixelData = context.getImageData(0, 0, SAMPLE_WIDTH, sampleHeight)
    .data;

  // Un pixel est considere "sombre" si la moyenne RGB est sous ce seuil.
  // 28/255 = quasiment noir. On laisse une marge pour les artefacts JPG.
  const DARK_PIXEL_LUMINANCE_THRESHOLD = 28;
  // Une ligne est "noire" si plus de 92% de ses pixels sont sombres.
  const ROW_DARK_RATIO_THRESHOLD = 0.92;

  const isPixelDark = (red: number, green: number, blue: number): boolean =>
    (red + green + blue) / 3 < DARK_PIXEL_LUMINANCE_THRESHOLD;

  const rowDarkRatio = (rowIndex: number): number => {
    let darkPixelCount = 0;
    for (let columnIndex = 0; columnIndex < SAMPLE_WIDTH; columnIndex++) {
      // pixelData est plat : [R,G,B,A, R,G,B,A, ...]. 4 octets par pixel.
      const byteOffset = (rowIndex * SAMPLE_WIDTH + columnIndex) * 4;
      if (
        isPixelDark(
          pixelData[byteOffset],
          pixelData[byteOffset + 1],
          pixelData[byteOffset + 2]
        )
      ) {
        darkPixelCount++;
      }
    }
    return darkPixelCount / SAMPLE_WIDTH;
  };

  const columnDarkRatio = (columnIndex: number): number => {
    let darkPixelCount = 0;
    for (let rowIndex = 0; rowIndex < sampleHeight; rowIndex++) {
      const byteOffset = (rowIndex * SAMPLE_WIDTH + columnIndex) * 4;
      if (
        isPixelDark(
          pixelData[byteOffset],
          pixelData[byteOffset + 1],
          pixelData[byteOffset + 2]
        )
      ) {
        darkPixelCount++;
      }
    }
    return darkPixelCount / sampleHeight;
  };

  // On avance depuis chaque bord tant que la ligne/colonne est majoritairement
  // sombre. Quand le ratio tombe sous 92%, on s'arrete : c'est le booster.
  let minRow = 0;
  while (
    minRow < sampleHeight - 1 &&
    rowDarkRatio(minRow) > ROW_DARK_RATIO_THRESHOLD
  ) {
    minRow++;
  }
  let maxRow = sampleHeight - 1;
  while (maxRow > 0 && rowDarkRatio(maxRow) > ROW_DARK_RATIO_THRESHOLD) {
    maxRow--;
  }
  let minColumn = 0;
  while (
    minColumn < SAMPLE_WIDTH - 1 &&
    columnDarkRatio(minColumn) > ROW_DARK_RATIO_THRESHOLD
  ) {
    minColumn++;
  }
  let maxColumn = SAMPLE_WIDTH - 1;
  while (
    maxColumn > 0 &&
    columnDarkRatio(maxColumn) > ROW_DARK_RATIO_THRESHOLD
  ) {
    maxColumn--;
  }

  // Petite marge de securite : la detection est faite sur une image
  // reduite (200px), on prend 2 pixels de marge pour ne pas couper
  // accidentellement le bord du booster.
  const PADDING = 2;
  minColumn = Math.max(0, minColumn - PADDING);
  minRow = Math.max(0, minRow - PADDING);
  maxColumn = Math.min(SAMPLE_WIDTH - 1, maxColumn + PADDING);
  maxRow = Math.min(sampleHeight - 1, maxRow + PADDING);

  // Conversion des indices de pixels en coordonnees UV (0..1).
  const uMin = minColumn / SAMPLE_WIDTH;
  const uMax = (maxColumn + 1) / SAMPLE_WIDTH;
  const topY = minRow / sampleHeight;
  const bottomY = (maxRow + 1) / sampleHeight;

  // On calcule le ratio largeur/hauteur du booster detecte. C'est ce
  // ratio que BoosterMesh utilise pour dimensionner le plane 3D.
  const regionWidth = (uMax - uMin) * imageElement.naturalWidth;
  const regionHeight = (bottomY - topY) * imageElement.naturalHeight;
  const aspectRatio =
    regionWidth > 0 && regionHeight > 0
      ? regionWidth / regionHeight
      : DEFAULT_BOOSTER_ASPECT_RATIO;

  // Note : dans Three.js avec flipY=true (defaut pour les Textures
  // creees a partir d'une Image), V=0 est en BAS de l'image et V=1 en
  // HAUT. Donc on inverse topY/bottomY pour passer en convention V.
  return {
    uMin,
    uMax,
    vMin: 1 - bottomY,
    vMax: 1 - topY,
    aspectRatio,
  };
}

// ============================================================
// Hook public
// ============================================================

export interface UseBoosterTexturesResult {
  textures: BoosterTextures | null;
  /** True si l'image n'a pas charge apres le timeout. */
  hasFailed: boolean;
}

/**
 * Charge l'image du booster, detecte ses bornes, genere une normal
 * map procedurale et expose les textures Three.js.
 *
 * @param imageUrl URL de l'image du booster
 * @param failTimeoutMilliseconds delai avant de considerer l'image en echec
 */
export function useBoosterTextures(
  imageUrl: string,
  failTimeoutMilliseconds = 3000
): UseBoosterTexturesResult {
  const [textures, setTextures] = useState<BoosterTextures | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setTextures(null);
    setHasFailed(false);

    // On utilise Image() vanilla plutot que TextureLoader pour pouvoir
    // detecter les bornes avant de creer la THREE.Texture.
    const imageElement = new Image();
    // CORS : necessaire si l'image vient d'un domaine externe (CDN).
    imageElement.crossOrigin = "anonymous";

    imageElement.onload = (): void => {
      if (isCancelled) return;

      const bounds = detectBoosterBounds(imageElement);

      // Texture COULEUR : l'image directe du booster.
      // Voir CONCEPTS.md §12 pour le detail de chaque setting.
      const colorTexture = new THREE.Texture(imageElement);
      // sRGB : les images PNG/JPG sont stockees en sRGB. Sans cette
      // ligne, Three.js les traite comme du "lineaire" et les couleurs
      // sortent delavees / trop claires.
      colorTexture.colorSpace = THREE.SRGBColorSpace;
      // Anisotropy : qualite du filtrage quand la texture est vue sous
      // un angle incline. 16 = max courant sur GPU desktop. Sans ca,
      // le booster vu de profil serait flou.
      colorTexture.anisotropy = 16;
      // MinFilter = filtre quand la texture est plus petite que sa taille
      // d'origine (booster eloigne). LinearMipmapLinear = utilise les
      // versions pre-reduites (mipmaps) avec interpolation lineaire.
      // C'est le meilleur compromis qualite/perf.
      colorTexture.minFilter = THREE.LinearMipmapLinearFilter;
      // MagFilter = filtre quand la texture est plus grande (zoom).
      // Linear = lissage. Nearest = effet pixel-art.
      colorTexture.magFilter = THREE.LinearFilter;
      // ClampToEdge = si les UVs sortent de [0,1], on prend le pixel du
      // bord. (L'alternative RepeatWrapping tilerait la texture.)
      colorTexture.wrapS = THREE.ClampToEdgeWrapping;
      colorTexture.wrapT = THREE.ClampToEdgeWrapping;
      // needsUpdate : flag obligatoire quand on cree une Texture
      // manuellement (vs TextureLoader qui le fait tout seul).
      colorTexture.needsUpdate = true;

      // Texture NORMALE (pour les plis) genere a la volee.
      // Canvas 512x800 = compromis qualite/perf.
      const normalCanvas = document.createElement("canvas");
      normalCanvas.width = 512;
      normalCanvas.height = 800;
      generateNormalMap(normalCanvas);
      const normalTexture = new THREE.CanvasTexture(normalCanvas);
      // Repeat pour la normale = ok car le pattern de plis est continu
      // (au cas ou les UVs depasseraient legerement).
      normalTexture.wrapS = THREE.RepeatWrapping;
      normalTexture.wrapT = THREE.RepeatWrapping;
      normalTexture.anisotropy = 8;
      normalTexture.needsUpdate = true;

      setTextures({
        colorTexture,
        normalTexture,
        bounds,
        aspectRatio: bounds.aspectRatio,
      });
    };

    imageElement.onerror = (): void => {
      console.error(
        `[BoosterPack3D] Impossible de charger l'image "${imageUrl}".`
      );
      if (!isCancelled) setHasFailed(true);
    };

    // Lance le chargement. onload se declenchera quand l'image est prete.
    imageElement.src = imageUrl;

    // Filet de securite : si l'image n'a toujours pas charge apres le
    // timeout, on considere que c'est foutu et on affiche l'erreur.
    const timeoutId = window.setTimeout(() => {
      if (!isCancelled) {
        setHasFailed((previous) => previous || !imageElement.complete);
      }
    }, failTimeoutMilliseconds);

    // Cleanup : si le composant unmount avant que l'image soit chargee,
    // on annule le traitement (sinon on aurait un warning React).
    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [imageUrl, failTimeoutMilliseconds]);

  return { textures, hasFailed };
}
