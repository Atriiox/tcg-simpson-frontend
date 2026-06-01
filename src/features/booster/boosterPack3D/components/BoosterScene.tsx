/**
 * Scene R3F complete : Canvas + lights + HDRI + parallax + mesh.
 */
import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
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

function RendererDisposer() {
  const { gl } = useThree();
  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl]);
  return null;
}

export function BoosterScene({
  tearProgress,
  isOpening,
  tilt,
  textures,
}: BoosterSceneProps): React.JSX.Element {
  return (
    <Canvas
      key="booster-canvas"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.5], fov: 30 }}
      className="w-full h-full"
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl: renderer }) => {
        renderer.domElement.style.touchAction = "none";
      }}
    >
      <RendererDisposer />

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