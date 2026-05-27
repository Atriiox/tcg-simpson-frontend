/**
 * Mesh 3D du booster : un plane coupe en deux (top + bottom)
 * autour de la ligne de dechirure. La moitie haute pivote autour
 * de cette ligne quand on tire.
 *
 * Concepts utilises (voir CONCEPTS.md) :
 * - Mesh = geometry + material (§8)
 * - Coordonnees UV : on remappe les UVs pour cadrer la texture (§9)
 * - meshPhysicalMaterial avec clearcoat pour le brillant plastique (§11)
 * - <group> comme pivot pour la rotation autour de la ligne (§13)
 * - useFrame pour animer la rotation a chaque frame (§14)
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  DEFAULT_BOOSTER_ASPECT_RATIO,
  PACK_WIDTH,
  TEAR_LINE_POSITION,
} from "../schema/constants";
import type {
  BoosterBounds,
  BoosterTextures,
} from "../schema/booster.schema";

/**
 * Construit une geometrie plane dont les UVs ne pointent QUE sur une
 * portion verticale de la texture.
 *
 * En clair : un PlaneGeometry standard, par defaut, affiche toute la
 * texture entre ses 4 coins (UVs (0,0) a (1,1)). On veut au lieu de ca :
 * - cadrer horizontalement sur la zone du booster dans l'image
 *   (via bounds.uMin / uMax)
 * - cadrer verticalement sur UNE PORTION de cette zone, definie en
 *   "coordonnees-booster" via boosterVStart et boosterVEnd
 *
 * Exemple : pour la moitie basse du booster (88% du bas), on passe
 * boosterVStart=0, boosterVEnd=0.88. Le plane affichera UNIQUEMENT
 * les 88% du bas de la zone-booster de l'image.
 *
 * Voir CONCEPTS.md §9 (UVs) si ca semble obscur.
 */
function buildPartialUVPlane(
  planeWidth: number,
  planeHeight: number,
  boosterVStart: number,
  boosterVEnd: number,
  bounds: BoosterBounds
): THREE.PlaneGeometry {
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 1, 1);
  // L'attribut "uv" contient 2 floats par sommet (U, V).
  // Un PlaneGeometry simple a 4 sommets, donc 8 floats.
  const uvArray = geometry.attributes.uv.array as Float32Array;
  const { uMin, uMax, vMin, vMax } = bounds;

  for (let vertexOffset = 0; vertexOffset < uvArray.length; vertexOffset += 2) {
    const planeU = uvArray[vertexOffset];     // 0 (gauche) ou 1 (droite)
    const planeV = uvArray[vertexOffset + 1]; // 0 (bas) ou 1 (haut)

    // U : on remappe 0..1 du plane vers uMin..uMax de la texture.
    // Resultat : meme si on a 0 ou 1 sur le plane, on pointe
    // exactement sur les bords gauche/droit du booster dans l'image.
    uvArray[vertexOffset] = uMin + planeU * (uMax - uMin);

    // V : double remappage.
    // 1) plane V (0..1) -> coord-booster (boosterVStart..boosterVEnd)
    const boosterV = boosterVStart + planeV * (boosterVEnd - boosterVStart);
    // 2) coord-booster (0..1) -> coord-texture (vMin..vMax)
    uvArray[vertexOffset + 1] = vMin + boosterV * (vMax - vMin);
  }

  // Important : sans ce flag, Three.js ne renvoie pas les nouveaux UVs au GPU.
  geometry.attributes.uv.needsUpdate = true;
  return geometry;
}

export interface BoosterMeshProps {
  /** Progression de la dechirure (0..100). */
  tearProgress: number;
  /** True quand l'animation d'ouverture est lancee. */
  isOpening: boolean;
  /** Textures chargees par useBoosterTextures. */
  textures: BoosterTextures | null;
}

export function BoosterMesh({
  tearProgress,
  isOpening,
  textures,
}: BoosterMeshProps): React.JSX.Element | null {
  const bounds = textures?.bounds;
  const aspectRatio = textures?.aspectRatio ?? DEFAULT_BOOSTER_ASPECT_RATIO;

  // Hauteur du pack en unites 3D, deduite du ratio et de la largeur fixe.
  const packHeight = PACK_WIDTH / aspectRatio;
  // On coupe le booster horizontalement a TEAR_LINE_POSITION (12% du haut).
  const topHeight = packHeight * TEAR_LINE_POSITION;
  const bottomHeight = packHeight * (1 - TEAR_LINE_POSITION);

  // Refs vers les objets Three.js. useFrame les modifie a chaque frame
  // sans passer par React (voir CONCEPTS.md §14).
  const topPivotRef = useRef<THREE.Group>(null);
  const bottomMeshRef = useRef<THREE.Mesh>(null);

  // useMemo : on ne recree la geometrie que si les bounds ou la hauteur
  // changent. Sinon on garderait la meme reference et React ne ferait
  // rien de toute facon.
  const topGeometry = useMemo(
    () =>
      bounds
        ? buildPartialUVPlane(
            PACK_WIDTH,
            topHeight,
            1 - TEAR_LINE_POSITION, // commence aux 88% du booster
            1, // jusqu'en haut
            bounds
          )
        : null,
    [topHeight, bounds]
  );

  const bottomGeometry = useMemo(
    () =>
      bounds
        ? buildPartialUVPlane(
            PACK_WIDTH,
            bottomHeight,
            0, // commence en bas
            1 - TEAR_LINE_POSITION, // jusqu'a la ligne de dechirure
            bounds
          )
        : null,
    [bottomHeight, bounds]
  );

  // useFrame : execute le callback ~60 fois par seconde. C'est ici qu'on
  // anime tout. ATTENTION : on modifie les refs directement, JAMAIS de
  // setState (qui declencherait un re-render React 60x/sec).
const elapsedRef = useRef(0);

useFrame((state, delta) => {
  elapsedRef.current += delta;
  const elapsedTime = elapsedRef.current;

    // Leger flottement en idle : on fait osciller la position Y avec
    // un sinus tres lent et tres petit. Sans ca, le booster a l'air "mort".
    if (bottomMeshRef.current && !isOpening) {
      const bobOffset = Math.sin(elapsedTime * 1.2) * 0.025;
      bottomMeshRef.current.position.y =
        -packHeight / 2 + bottomHeight / 2 + bobOffset;

      if (topPivotRef.current) {
        topPivotRef.current.position.y =
          bottomHeight - packHeight / 2 + bobOffset;
      }
    }

    // Animation de dechirure : on convertit le pourcentage de drag en
    // angle de rotation (0% -> 0°, 100% -> 90°). En plus de la rotation,
    // on souleve le top vers la camera (Z+) et vers le haut (Y+) pour
    // donner l'impression d'arrachage.
    if (topPivotRef.current) {
      const progressRatio = Math.min(1, Math.max(0, tearProgress / 100));
      const tearAngleRadians = progressRatio * (Math.PI / 2); // 0 -> 90°
      const liftAlongZ = progressRatio * 0.6;  // recule vers la camera
      const liftAlongY = progressRatio * 0.25; // remonte un peu

      // Rotation negative autour de X = "se rabat vers le spectateur".
      // Voir CONCEPTS.md §13 pour comprendre pourquoi un groupe ici.
      topPivotRef.current.rotation.x = -tearAngleRadians;
      topPivotRef.current.position.z = liftAlongZ;
      topPivotRef.current.position.y =
        bottomHeight -
        packHeight / 2 +
        liftAlongY +
        (isOpening ? 0 : Math.sin(elapsedTime * 1.2) * 0.025);
    }
  });

  if (!textures || !topGeometry || !bottomGeometry) return null;

  // Materiau physique avec clearcoat = couche de vernis transparente
  // qui simule le film plastique brillant. Voir CONCEPTS.md §11.
  const materialProps = {
    // Texture couleur = la photo du booster.
    map: textures.colorTexture,
    // Normal map = simule les plis du plastique sans ajouter de geometrie.
    // Voir CONCEPTS.md §10.
    normalMap: textures.normalTexture,
    // Attenuation de l'effet de plis (sinon ils seraient caricaturaux).
    normalScale: new THREE.Vector2(0.22, 0.22),
    // 0=plastique, 1=metal. On reste bas car la photo est deja eclairee.
    metalness: 0.15,
    // 0=miroir, 1=mat. 0.45 = legerement brillant.
    roughness: 0.45,
    // Clearcoat = "vernis transparent" par-dessus. 0=aucun, 1=plein.
    clearcoat: 0.7,
    // Brillant du vernis. 0=miroir, 1=mat.
    clearcoatRoughness: 0.12,
    // Force des reflets HDRI. 1=physique, 0.7=un peu attenue.
    envMapIntensity: 0.7,
    // FrontSide = on rend SEULEMENT la face avant du plane. Sinon le dos
    // afficherait la texture en miroir quand le top pivote.
    side: THREE.FrontSide,
    transparent: true,
  };

  return (
    <group>
      {/* MOITIE BASSE : statique, posee au bas du booster.
          Position Y calculee pour que le centre du mesh soit a la bonne
          hauteur dans le repere de la scene. */}
      <mesh
        ref={bottomMeshRef}
        geometry={bottomGeometry}
        position={[0, -packHeight / 2 + bottomHeight / 2, 0]}
      >
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      {/* MOITIE HAUTE : enveloppee dans un <group> qui sert de PIVOT.

          Le groupe est positionne EXACTEMENT sur la ligne de dechirure.
          Le mesh a l'interieur est decale vers le haut de topHeight/2
          pour que sa base coincide avec l'origine du groupe.

          Resultat : quand on fait tourner le groupe sur X, le mesh
          pivote AUTOUR DE SA BASE (= la ligne de dechirure), pas
          autour de son centre. Voir CONCEPTS.md §13. */}
      <group
        ref={topPivotRef}
        position={[0, bottomHeight - packHeight / 2, 0]}
      >
        <mesh geometry={topGeometry} position={[0, topHeight / 2, 0]}>
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>
    </group>
  );
}
