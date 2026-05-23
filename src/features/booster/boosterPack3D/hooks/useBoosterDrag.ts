/**
 * Gere le geste de dechirure du booster.
 *
 * On ecoute pointermove/up sur `window` pendant tout le drag :
 * c'est crucial pour ne JAMAIS perdre le geste si le pointeur
 * sort du booster (typique des qu'on glisse vite).
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

export interface UseBoosterDragOptions {
  /** Seuil (en pourcentage 0..100) qui declenche l'ouverture. */
  openThresholdPercent?: number;
  /** Callback appele quand le seuil est atteint. */
  onOpen: () => void;
  /** Desactive le drag (booster deja ouvert, loading, etc.). */
  isDisabled?: boolean;
}

export interface UseBoosterDragResult {
  /** Reference a placer sur le conteneur (pour calculer le delta). */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Progression de la dechirure (0..100). */
  tearProgress: number;
  /** True pendant le geste. */
  isDragging: boolean;
  /** Handler a brancher sur le `onPointerDown` de l'overlay. */
  handlePointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  /** Force la remise a zero (au reset du booster). */
  reset: () => void;
}

export function useBoosterDrag({
  openThresholdPercent = 90,
  onOpen,
  isDisabled = false,
}: UseBoosterDragOptions): UseBoosterDragResult {
  const [tearProgress, setTearProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerStartXRef = useRef(0);
  const hasOpenedRef = useRef(false);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>): void => {
      if (isDisabled || hasOpenedRef.current) return;
      event.preventDefault();
      pointerStartXRef.current = event.clientX;
      setIsDragging(true);
    },
    [isDisabled]
  );

  const reset = useCallback((): void => {
    setTearProgress(0);
    setIsDragging(false);
    hasOpenedRef.current = false;
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent): void => {
      const container = containerRef.current;
      if (!container) return;

      const boundingRect = container.getBoundingClientRect();
      const deltaX = event.clientX - pointerStartXRef.current;
      const progressPercent = Math.max(
        0,
        Math.min(100, (deltaX / boundingRect.width) * 100)
      );
      setTearProgress(progressPercent);

      if (
        progressPercent >= openThresholdPercent &&
        !hasOpenedRef.current
      ) {
        hasOpenedRef.current = true;
        setIsDragging(false);
        onOpen();
      }
    };

    const handlePointerUp = (): void => {
      setIsDragging(false);
      // Annulation si pas assez loin
      setTearProgress((currentProgress) =>
        currentProgress >= openThresholdPercent ? currentProgress : 0
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDragging, openThresholdPercent, onOpen]);

  return {
    containerRef,
    tearProgress,
    isDragging,
    handlePointerDown,
    reset,
  };
}
