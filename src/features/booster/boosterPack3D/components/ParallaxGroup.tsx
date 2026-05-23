/**
 * Wrapper qui applique un leger tilt 3D au groupe enfant en
 * suivant la position de la souris (lissage exponentiel).
 */
import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Tilt } from "../schema/booster.schema";

const SMOOTHING_FACTOR = 0.08;

export interface ParallaxGroupProps {
  tilt: Tilt;
  /** Si true, on revient a zero (animation d'ouverture). */
  isOpening: boolean;
  children: ReactNode;
}

export function ParallaxGroup({
  tilt,
  isOpening,
  children,
}: ParallaxGroupProps): React.JSX.Element {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const targetRotation = isOpening ? { rotateX: 0, rotateY: 0 } : tilt;
    group.rotation.x +=
      (targetRotation.rotateX - group.rotation.x) * SMOOTHING_FACTOR;
    group.rotation.y +=
      (targetRotation.rotateY - group.rotation.y) * SMOOTHING_FACTOR;
  });

  return <group ref={groupRef}>{children}</group>;
}
