"use client";

import { createContext, useContext, useState, useCallback } from "react";
import Image from "next/image";

interface RewardContextType {
  triggerReward: (amount: number) => void;
}

const RewardContext = createContext<RewardContextType>({ triggerReward: () => {} });

export function RewardProvider({ children }: { children: React.ReactNode }) {
  const [reward, setReward] = useState<{ amount: number; id: number } | null>(null);

  const triggerReward = useCallback((amount: number) => {
    setReward({ amount, id: Date.now() });
    setTimeout(() => setReward(null), 2500);
  }, []);

  return (
    <RewardContext.Provider value={{ triggerReward }}>
      {children}
 {reward && (
  <div
    key={reward.id}
    className="fixed top-24 left-1/2 -translate-x-1/2 z-999 pointer-events-none animate-float-to-header flex items-center gap-3"
  >
    <span className="text-6xl font-black text-simpson-orange drop-shadow-lg">
      +{reward.amount}
    </span>
    <Image
      src="/donuts1.webp"
      alt="Donut"
      width={64}
      height={64}
      className="w-16 h-16 object-contain"
    />
  </div>
)}
    </RewardContext.Provider>
  );
}

export const useReward = () => useContext(RewardContext);