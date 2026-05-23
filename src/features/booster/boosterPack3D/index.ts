/**
 * Point d'entree du module BoosterPack3D.
 *
 * Usage cote consommateur :
 *   import { BoosterPack3D } from "@/features/BoosterPack3D";
 */

// Composant racine + types lies
export { BoosterPack3D } from "./components/BoosterPack3D";
export { default } from "./components/BoosterPack3D";
export type {
  BoosterPack3DProps,
  BoosterPack3DHandle,
} from "./components/BoosterPack3D";

// Types exposes pour les consommateurs avances
export type {
  BoosterBounds,
  BoosterTextures,
  Tilt,
} from "./schema/booster.schema";

// Hooks exposes au cas ou un parent voudrait composer differemment
export {
  useBoosterTextures,
  type UseBoosterTexturesResult,
} from "./hooks/useBoosterTextures";
export {
  useBoosterDrag,
  type UseBoosterDragOptions,
  type UseBoosterDragResult,
} from "./hooks/useBoosterDrag";
export {
  useParallaxTilt,
  type UseParallaxTiltOptions,
  type UseParallaxTiltResult,
} from "./hooks/useParallaxTilt";
