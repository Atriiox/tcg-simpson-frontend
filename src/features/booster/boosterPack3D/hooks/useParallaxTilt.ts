/**
 * Calcule un leger tilt 3D selon la position de la souris dans
 * le conteneur. Utilise par ParallaxGroup pour faire bouger le
 * booster sur le hover.
 */
import {
  useCallback,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import type { Tilt } from "../schema/booster.schema";

export interface UseParallaxTiltOptions {
  /** Si true, on ignore tout mouvement (drag en cours, etc.). */
  isDisabled?: boolean;
  /** Reference du conteneur dont on lit la bounding box. */
  containerRef: RefObject<HTMLElement | null>;
  /** Amplitude du pitch (rotation autour de l'axe X). Defaut 0.25. */
  pitchAmplitude?: number;
  /** Amplitude du yaw (rotation autour de l'axe Y). Defaut 0.30. */
  yawAmplitude?: number;
}

export interface UseParallaxTiltResult {
  tilt: Tilt;
  handlePointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  handlePointerLeave: () => void;
}

export function useParallaxTilt({
  isDisabled = false,
  containerRef,
  pitchAmplitude = 0.25,
  yawAmplitude = 0.3,
}: UseParallaxTiltOptions): UseParallaxTiltResult {
  const [tilt, setTilt] = useState<Tilt>({ rotateX: 0, rotateY: 0 });

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>): void => {
      if (isDisabled) return;
      const containerElement = containerRef.current;
      if (!containerElement) return;

      const boundingRect = containerElement.getBoundingClientRect();
      const centerX = boundingRect.left + boundingRect.width / 2;
      const centerY = boundingRect.top + boundingRect.height / 2;
      const normalizedX = (event.clientX - centerX) / (boundingRect.width / 2);
      const normalizedY = (event.clientY - centerY) / (boundingRect.height / 2);

      setTilt({
        rotateX: -normalizedY * pitchAmplitude,
        rotateY: normalizedX * yawAmplitude,
      });
    },
    [isDisabled, containerRef, pitchAmplitude, yawAmplitude]
  );

  const handlePointerLeave = useCallback((): void => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return { tilt, handlePointerMove, handlePointerLeave };
}
