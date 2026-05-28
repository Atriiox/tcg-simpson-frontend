"use client";

import BoosterCard from "./BoosterCard";
import { ShopBooster } from "../hooks/useShopBooster";

interface BoosterListProps {
  boosters: ShopBooster[];
  ownedBoosters: Record<string, number>;
  userDonuts: number;
  buyingBoosterId: string | null;
  isMounted: boolean;
  onBuy: (booster: ShopBooster) => void;
  onDetail: (booster: ShopBooster) => void;
}

export default function BoosterList({ boosters, ownedBoosters, userDonuts, buyingBoosterId, isMounted, onBuy, onDetail }: BoosterListProps) {
  if (boosters.length === 0) {
    return (
      <div className="text-center py-16 bg-white/40 dark:bg-simpson-darklight/40 backdrop-blur-md rounded-2xl border border-simpson-gray/10 dark:border-white/5 w-full max-w-5xl mx-auto">
        <p className="text-xs sm:text-sm font-medium text-simpson-gray">Aucun booster n'est disponible en rayon actuellement.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 justify-items-center max-w-5xl mx-auto w-full pt-4">
      {boosters.map((booster) => (
        <BoosterCard
          key={booster.id}
          booster={booster}
          owned={ownedBoosters[booster.id] || 0}
          canAfford={isMounted ? userDonuts >= booster.price : false}
          isBuying={buyingBoosterId === booster.id}
          isAnyBuying={!!buyingBoosterId}
          isMounted={isMounted}
          onBuy={onBuy}
          onDetail={onDetail}
        />
      ))}
    </div>
  );
}
