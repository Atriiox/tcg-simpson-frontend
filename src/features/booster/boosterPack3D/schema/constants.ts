/**
 * Constantes geometriques du booster 3D.
 *
 * Ce module est generique : il n'a aucune connaissance du contenu
 * du booster ni du type de cartes qu'il represente.
 */

/** Largeur du booster dans la scene 3D (en unites world). */
export const PACK_WIDTH = 2.0;

/**
 * Position verticale de la ligne de dechirure, exprimee en
 * coordonnees-booster (0 = haut, 1 = bas).
 *
 * Avec 0.12, on dechire les 12 % du haut du booster.
 */
export const TEAR_LINE_POSITION = 0.12;

/**
 * Ratio largeur / hauteur par defaut, applique si la detection
 * automatique des bornes de l'image echoue.
 */
export const DEFAULT_BOOSTER_ASPECT_RATIO = 1949 / 2600;
