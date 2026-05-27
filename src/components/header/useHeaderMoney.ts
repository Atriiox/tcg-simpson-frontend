import { useState, useEffect, useRef } from "react";

export function useHeaderMoney(money: number | undefined | null, mounted: boolean) {
  const [displayedMoney, setDisplayedMoney] = useState(0);
  const prevMoneyRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mounted) return;
    if (money === undefined || money === null) return;

    prevMoneyRef.current = 0;

    const end = money;
    if (end === 0) {
      setDisplayedMoney(0);
      return;
    }

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(end * eased);
      setDisplayedMoney(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevMoneyRef.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (prevMoneyRef.current === null) return;
    if (money === undefined || money === null) return;

    const start = prevMoneyRef.current;
    const end = money;

    if (start === end) return;

    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayedMoney(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevMoneyRef.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [money]);

  return { displayedMoney };
}