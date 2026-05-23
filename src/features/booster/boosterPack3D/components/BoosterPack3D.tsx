/**
 * BoosterPack3D
 * ============================================================
 * Composant generique d'un booster TCG en 3D.
 *
 * Le composant gere uniquement le visuel et l'interaction
 * (drag pour dechirer). Il ne fait AUCUN fetch et ne sait pas
 * ce qu'il y a dans le booster : c'est au composant parent de
 * reagir au callback `onOpen` pour fetcher / afficher ses cartes.
 *
 * USAGE :
 *   const boosterRef = useRef<BoosterPack3DHandle>(null);
 *
 *   <BoosterPack3D
 *     ref={boosterRef}
 *     imageUrl="/booster.png"
 *     onOpen={() => {
 *       // fetch tes cartes, affiche ton UI...
 *     }}
 *   />
 *
 *   // Pour remettre le booster a zero :
 *   boosterRef.current?.reset();
 * ============================================================
 */
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";

import { useBoosterDrag } from "../hooks/useBoosterDrag";
import { useBoosterTextures } from "../hooks/useBoosterTextures";
import { useParallaxTilt } from "../hooks/useParallaxTilt";

import { BoosterScene } from "./BoosterScene";

export interface BoosterPack3DHandle {
  /** Remet le booster en etat ferme (annule la dechirure). */
  reset: () => void;
}

export interface BoosterPack3DProps {
  /** URL de l'image du booster. Defaut : /booster.png */
  imageUrl?: string;
  /** Largeur du conteneur (CSS). Defaut : 520px */
  containerWidth?: number | string;
  /** Hauteur du conteneur (CSS). Defaut : 720px */
  containerHeight?: number | string;
  /** Seuil de dechirure (0..100) qui declenche `onOpen`. Defaut : 90 */
  openThresholdPercent?: number;
  /** Callback appele quand le seuil de dechirure est atteint. */
  onOpen?: () => void;
  /** Element a afficher pendant le chargement de l'image. */
  loadingFallback?: ReactNode;
  /** Element a afficher quand l'image n'a pas pu etre chargee. */
  errorFallback?: ReactNode;
  /** Hint affiche sous le booster (overridable). */
  hintLabel?: ReactNode;
}

const DEFAULT_LOADING_FALLBACK = (
  <div
    aria-label="Chargement"
    className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin"
  />
);

export const BoosterPack3D = forwardRef<
  BoosterPack3DHandle,
  BoosterPack3DProps
>(function BoosterPack3D(
  {
    imageUrl = "/booster.png",
    containerWidth = 520,
    containerHeight = 720,
    openThresholdPercent = 90,
    onOpen,
    loadingFallback = DEFAULT_LOADING_FALLBACK,
    errorFallback,
    hintLabel,
  },
  ref
): React.JSX.Element {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const { textures, hasFailed: hasImageFailed } = useBoosterTextures(imageUrl);

  const handleOpen = useCallback((): void => {
    setHasBeenOpened(true);
    onOpen?.();
  }, [onOpen]);

  const {
    containerRef,
    tearProgress,
    isDragging,
    handlePointerDown,
    reset: resetDrag,
  } = useBoosterDrag({
    openThresholdPercent,
    onOpen: handleOpen,
    isDisabled: hasBeenOpened,
  });

  const { tilt, handlePointerMove, handlePointerLeave } = useParallaxTilt({
    containerRef,
    isDisabled: isDragging || hasBeenOpened,
  });

  // API exposee au parent via ref.
  useImperativeHandle(
    ref,
    () => ({
      reset: (): void => {
        setHasBeenOpened(false);
        resetDrag();
      },
    }),
    [resetDrag]
  );

  const isOpening = tearProgress > 3 || hasBeenOpened;

  const defaultHint =
    tearProgress < 3
      ? "Clique sur le booster et glisse de gauche a droite"
      : tearProgress < openThresholdPercent
        ? "Continue a tirer..."
        : "";

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ width: containerWidth, height: containerHeight }}
    >
      {/* Canvas R3F en arriere-plan */}
      <div className="absolute inset-0 z-1">
        <BoosterScene
          tearProgress={tearProgress}
          isOpening={isOpening}
          tilt={tilt}
          textures={textures}
        />
      </div>

      {/* Overlay transparent qui capture les pointer events */}
      <div
        className="absolute inset-0 z-2 cursor-grab"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      />

      {/* Etat : chargement de la texture */}
      {!textures && !hasImageFailed && (
        <div className="absolute inset-0 z-3 flex items-center justify-center pointer-events-none">
          {loadingFallback}
        </div>
      )}

      {/* Etat : image introuvable */}
      {!textures && hasImageFailed && (
        <div className="absolute inset-0 z-3 flex items-center justify-center pointer-events-none">
          {errorFallback ?? (
            <div className="text-rose-100 bg-rose-900/90 px-5 py-4 rounded-[10px] max-w-110 text-sm leading-snug">
              <p className="m-0 font-bold">
                Aucune image trouvee a <code>{imageUrl}</code>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hint en bas du booster (overridable) */}
      {textures && (
        <p className="absolute -bottom-9 inset-x-0 text-center text-slate-300 text-sm italic m-0 z-4">
          {hintLabel ?? defaultHint}
        </p>
      )}
    </div>
  );
});

export default BoosterPack3D;
