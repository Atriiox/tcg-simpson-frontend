/**
 * Scene R3F complete : Canvas + lights + HDRI + parallax + mesh.
 *
 * Pour les concepts 3D utilises ici (camera, lumieres, HDRI, tone
 * mapping), voir CONCEPTS.md sections 3 a 7.
 */
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import type { BoosterTextures, Tilt } from "../schema/booster.schema";
import { BoosterMesh } from "./BoosterMesh";
import { ParallaxGroup } from "./ParallaxGroup";

export interface BoosterSceneProps {
  tearProgress: number;
  isOpening: boolean;
  tilt: Tilt;
  textures: BoosterTextures | null;
}

export function BoosterScene({
  tearProgress,
  isOpening,
  tilt,
  textures,
}: BoosterSceneProps): React.JSX.Element {
  return (
    <Canvas
      // dpr = "device pixel ratio". Sur ecran retina, on rend en 2x
      // pour ne pas etre flou. On laisse R3F choisir entre 1 et 2
      // selon l'appareil (perf vs qualite).
      dpr={[1, 2]}
      // Camera placee a z=6.5 (recule devant le booster centre en 0,0,0).
      // fov=30 = champ de vision etroit (effet telephoto), peu de
      // deformation de perspective, rendu "photo produit".
      camera={{ position: [0, 0, 6.5], fov: 30 }}
      className="w-full h-full"
      gl={{
        // Lissage des bords (sinon escaliers de pixels sur les diagonales).
        antialias: true,
        // Tone mapping : compresse les hautes lumieres pour qu'elles ne
        // soient pas cramees a blanc. ACES Filmic est le standard cinema.
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={({ gl: renderer }) => {
        // Sur mobile, sans touchAction:none, le navigateur scrolle la
        // page quand on glisse le doigt sur le canvas.
        renderer.domElement.style.touchAction = "none";
      }}
    >
      {/* HDRI : image panoramique 360° qui sert d'environnement pour
          les reflets. Sans ca, les surfaces metalliques/brillantes
          sont noires (elles n'ont rien a refleter). Preset "city" =
          ambiance urbaine, lumiere de fenetres. Voir CONCEPTS.md §6. */}
      <Environment preset="city" />

      {/* 4 lumieres avec roles distincts (voir CONCEPTS.md §5) : */}

      {/* Lumiere globale uniforme, evite que les ombres soient noir pur. */}
      <ambientLight intensity={0.45} />

      {/* "Key light" = lumiere principale (le soleil). Donne le relief. */}
      <directionalLight position={[4, 6, 5]} intensity={0.9} />

      {/* "Rim lights" colorees qui detachent le booster du fond.
          Technique de cinema photographique : une couleur froide d'un
          cote, une couleur chaude de l'autre. */}
      <pointLight position={[-4, -2, 3]} intensity={0.4} color="#9b6bff" />
      <pointLight position={[4, -1, 2]} intensity={0.35} color="#ff7a3d" />

      {/* ParallaxGroup applique le tilt souris a tous ses enfants.
          BoosterMesh est le mesh 3D du booster (top + bottom). */}
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
