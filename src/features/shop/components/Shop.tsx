"use client";

import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useMoney } from "../hooks/useMoney";
import { useDailyMoney } from "../hooks/useDailyMoney";
import { useShopBooster, ShopBooster } from "../hooks/useShopBooster";
import { useReward } from "@/components/RewardContext";
import DailyBanner from "./DailyBanner";
import BoosterList from "./BoosterList";
import BoosterDetailModal from "./BoosterDetailModal";
import MoneyModal from "./MoneyModal";

interface DonutPack {
  id: string;
  amount: number;
  price: string;
  popular: boolean;
}

export default function Shop() {
  const { money: userDonuts, buyDonuts, updateReduxMoney } = useMoney();
  const { boosters, ownedBoosters, isLoading: boostersLoading, error: boostersError, buyBooster } = useShopBooster();
  const { triggerReward } = useReward();

  const { isReady: dailyReady, formattedTime, isClaiming: isClaimingDaily, claimDailyDonuts } = useDailyMoney(() => {
    triggerReward(100);
  });

  const [isMounted, setIsMounted] = useState(false);
  const [isMoneyModalOpen, setIsMoneyModalOpen] = useState(false);
  const [detailBooster, setDetailBooster] = useState<ShopBooster | null>(null);
  const [buyingBoosterId, setBuyingBoosterId] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const handleBuyBooster = async (booster: ShopBooster) => {
    if (userDonuts < booster.price || buyingBoosterId) return;
    setBuyingBoosterId(booster.id);
    try {
      const result = await buyBooster(booster.id);
      if (result.ok && result.money !== undefined) {
        updateReduxMoney(result.money);
        triggerReward(-booster.price);
      }
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
    } finally {
      setBuyingBoosterId(null);
    }
  };

  const handlePurchaseDonuts = async (pack: DonutPack) => {
    if (isPurchasing) return;
    setIsPurchasing(true);
    try {
      const result = await buyDonuts(pack.id);
      if (result.ok) {
        triggerReward(pack.amount);
        setIsMoneyModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur d'achat :", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (boostersLoading) {
    return (
      <div className="w-full flex-1 p-6 md:p-10 font-main select-none overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-simpson-gray/10 dark:border-white/10">
            <div className="space-y-2">
              <div className="h-7 w-32 bg-simpson-gray/20 dark:bg-white/5 rounded-lg" />
              <div className="h-4 w-56 bg-simpson-gray/20 dark:bg-white/5 rounded-lg" />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="h-11 w-40 bg-simpson-gray/20 dark:bg-white/5 rounded-xl" />
              <div className="h-11 w-44 bg-simpson-gray/20 dark:bg-white/5 rounded-xl" />
            </div>
          </div>

          {/* Boosters grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center max-w-5xl mx-auto w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center p-4 w-full max-w-72.5 bg-white/40 dark:bg-simpson-darklight/40 rounded-2xl border border-white/10 h-90" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (boostersError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent p-6 h-full min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 bg-white/40 dark:bg-simpson-darklight/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-red-500/20 dark:border-red-500/10 shadow-lg text-center max-w-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </div>
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-bold tracking-wide uppercase">Erreur de connexion</p>
          <p className="text-[11px] sm:text-xs text-simpson-gray dark:text-simpson-white/60 font-medium leading-relaxed">{boostersError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 p-6 md:p-10 font-main text-simpson-dark dark:text-simpson-white select-none overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* HEADER COMPACT (Titre + Actions quotidiens/achats alignés) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-simpson-gray/10 dark:border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-simpson-orange dark:text-simpson-yellow">Boutique</h1>
            <h2 className="text-xs font-medium text-simpson-gray mt-0.5">Échange tes donuts contre des boosters !</h2>
          </div>
              <DailyBanner
              isReady={dailyReady}
              isMounted={isMounted}
              isClaiming={isClaimingDaily}
              formattedTime={formattedTime}
              onClaim={claimDailyDonuts}
            />
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
        
            <button
              onClick={() => setIsMoneyModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 h-11 bg-simpson-blue hover:bg-simpson-blue/90 text-white rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer w-full sm:w-auto"
            >
              <FaPlusCircle size={14} />
              Acheter des donuts
            </button>
          </div>
        </div>

        {/* LISTE DES BOOSTERS (Le gap global est géré ici dans BoosterList ou via ses parents) */}
        <BoosterList
          boosters={boosters}
          ownedBoosters={ownedBoosters}
          userDonuts={userDonuts}
          buyingBoosterId={buyingBoosterId}
          isMounted={isMounted}
          onBuy={handleBuyBooster}
          onDetail={setDetailBooster}
        />
      </div>

      <BoosterDetailModal booster={detailBooster} onClose={() => setDetailBooster(null)} />
      <MoneyModal isOpen={isMoneyModalOpen} isPurchasing={isPurchasing} onClose={() => setIsMoneyModalOpen(false)} onPurchase={handlePurchaseDonuts} />
    </div>
  );
}