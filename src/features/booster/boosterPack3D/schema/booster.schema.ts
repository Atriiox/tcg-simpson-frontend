/**
 * Types lies au mesh 3D et aux interactions du booster.
 *
 * Les coordonnees U/V suivent la convention Three.js avec
 * flipY=true : V augmente vers le haut de l'image.
 */
import * as THREE from "three";
import { z } from "zod";

/**
 * Zone du booster detectee dans l'image source.
 *
 * - uMin / uMax : bornes horizontales en coordonnees texture (0..1)
 * - vMin / vMax : bornes verticales en coordonnees texture (0..1)
 * - aspectRatio : largeur / hauteur de la zone detectee
 */
export const BoosterBoundsSchema = z.object({
  uMin: z.number(),
  uMax: z.number(),
  vMin: z.number(),
  vMax: z.number(),
  aspectRatio: z.number(),
});
export type BoosterBounds = z.infer<typeof BoosterBoundsSchema>;

/** Textures et bornes chargees par useBoosterTextures. */
export interface BoosterTextures {
  colorTexture: THREE.Texture;
  normalTexture: THREE.CanvasTexture;
  bounds: BoosterBounds;
  /** Largeur / hauteur du booster (raccourci vers bounds.aspectRatio). */
  aspectRatio: number;
}

/**
 * Inclinaison de parallaxe en radians.
 *
 * - rotateX : rotation autour de l'axe X (pitch, regard haut/bas)
 * - rotateY : rotation autour de l'axe Y (yaw, regard gauche/droite)
 */
export interface Tilt {
  rotateX: number;
  rotateY: number;
}
