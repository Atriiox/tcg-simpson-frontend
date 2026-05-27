"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMoney } from "../hooks/useMoney";
import { LuInfo } from "react-icons/lu";
import { FaPlusCircle, FaPercentage } from "react-icons/fa";
import Booster from "../../booster/components/BoosterDisplay";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useShopBooster, ShopBooster } from "../hooks/useShopBooster";
import { useReward } from "@/components/RewardContext";

interface DonutPack {
  amount: number;
  price: string;
  popular: boolean;
}

const rarityStyles: Record<string, { label: string; textClass: string; bgClass: string }> = {
  Common: {
    label: "Commun",
    textClass: "text-slate-500 dark:text-slate-400",
    bgClass: "bg-slate-100 dark:bg-slate-800",
  },
  Rare: {
    label: "Rare",
    textClass: "text-sky-500 dark:text-sky-400",
    bgClass: "bg-sky-100 dark:bg-sky-900/40",
  },
  Legendary: {
    label: "Légendaire",
    textClass: "text-amber-500 dark:text-simpson-yellow",
    bgClass: "bg-amber-100 dark:bg-amber-900/40",
  },
};

const donutPacks: DonutPack[] = [
  { amount: 50, price: "1,99 €", popular: false },
  { amount: 100, price: "3,49 €", popular: false },
  { amount: 200, price: "5,99 €", popular: true },
  { amount: 500, price: "12,99 €", popular: false },
  { amount: 1000, price: "19,99 €", popular: false },
];

export default function Shop() {
  const { money: userDonuts, updateMoney } = useMoney();
  const { boosters, ownedBoosters, isLoading: boostersLoading, error: boostersError, buyBooster } = useShopBooster();
  const { triggerReward } = useReward();

  const [isMounted, setIsMounted] = useState(false);
  const [isDonutModalOpen, setIsDonutModalOpen] = useState(false);
  const [detailBooster, setDetailBooster] = useState<ShopBooster | null>(null);
  const [buyingBoosterId, setBuyingBoosterId] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBuyBooster = async (booster: ShopBooster) => {
    if (userDonuts < booster.price || buyingBoosterId) return;
    setBuyingBoosterId(booster.id);

    try {
      const success = await buyBooster(booster.id);
      if (success) {
        const newDonutBalance = userDonuts - booster.price;
        await updateMoney(newDonutBalance);
        triggerReward(-booster.price);
      }
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
    } finally {
      setBuyingBoosterId(null);
    }
  };

  const handlePurchaseDonuts = async (amount: number) => {
    if (isPurchasing) return;
    setIsPurchasing(true);

    try {
      // Simulation du traitement serveur
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await updateMoney(userDonuts + amount);

      if (result.ok) {
        triggerReward(amount);
        setIsDonutModalOpen(false); // Fermeture immédiate
      }
    } catch (error) {
      console.error("Erreur d'achat :", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleOpenDetails = (booster: ShopBooster) => {
    setDetailBooster(booster);
  };

  if (boostersLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent h-full min-h-[50vh]">
        <div className="text-center space-y-2 animate-pulse">
          <div className="w-8 h-8 border-4 border-simpson-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-medium text-simpson-gray font-medium">
            Ouverture des rideaux du Kwik-E-Mart...
          </p>
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
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-simpson-gray/10 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-simpson-orange dark:text-simpson-yellow">Boutique</h1>
            <h2 className="text-sm font-medium text-simpson-gray mt-1">Échange tes donuts contre des boosters !</h2>
          </div>
          <div>
            <button
              onClick={() => setIsDonutModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-simpson-blue hover:bg-simpson-blue/90 text-white rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer h-10"
            >
              <FaPlusCircle size={16} />
              Acheter des donuts
            </button>
          </div>
        </div>

        {boosters.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 justify-items-center max-w-5xl mx-auto w-full pt-4">
            {boosters.map((booster) => {
              const canAfford = isMounted ? userDonuts >= booster.price : false;
              const isBuying = buyingBoosterId === booster.id;

              return (
                <div
                  key={booster.id}
                  className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full max-w-md bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-6 rounded-xl border border-white/40 dark:border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl group"
                >
                  <div className="flex justify-center transform transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:-rotate-1 filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_20px_rgba(0,0,0,0.35)] shrink-0">
                    <Booster imageUrl={`/${booster.slug}`} className="w-44 h-62 sm:w-48 sm:h-68" />
                  </div>

                  <div className="flex flex-col justify-between flex-1 w-full min-h-60">
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="text-xs font-semibold text-simpson-gray dark:text-simpson-white/40 bg-simpson-gray/10 dark:bg-white/5 px-2.5 py-1 rounded-md">
                        Possédé :{" "}
                        <span className="text-simpson-dark dark:text-simpson-white font-bold">
                          {ownedBoosters[booster.id] || 0}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenDetails(booster)}
                        className="text-simpson-gray/70 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer transition-colors duration-200 outline-none p-1.5 hover:bg-simpson-gray/10 dark:hover:bg-white/5 rounded-xl"
                      >
                        <LuInfo size={20} />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-simpson-dark dark:text-simpson-white">{booster.name}</h3>
                      <p className="text-xs font-medium text-simpson-gray mt-0.5">
                        Contient {booster.quantity || 5} carte{(booster.quantity || 5) > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-simpson-gray/10 dark:border-white/5">
                      <div className="flex flex-col items-start shrink-0">
                        <span className="text-[10px] font-medium text-simpson-gray block mb-0.5 uppercase tracking-wider">Prix</span>
                        <div className="flex items-center gap-1 font-black text-xl text-simpson-dark dark:text-simpson-white">
                          <span>{isMounted ? booster.price : "--"}</span>
                          <Image src="/donuts1.webp" alt="Donut Icon" width={18} height={18} className="w-4.5 h-4.5 object-contain" priority />
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyBooster(booster)}
                        disabled={!canAfford || isBuying || !!buyingBoosterId}
                        className={`flex-1 h-11 text-xs font-bold rounded-xl shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer
                          ${!canAfford
                            ? "bg-simpson-gray/10 text-simpson-gray/40 dark:bg-white/5 dark:text-simpson-gray/60 cursor-not-allowed"
                            : "bg-simpson-orange hover:bg-simpson-orange/90 text-simpson-white shadow-md"
                          } ${isBuying || (buyingBoosterId && buyingBoosterId !== booster.id) ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                      >
                        {!isMounted ? (
                          <div className="w-4 h-4 border-2 border-simpson-gray/40 border-t-transparent rounded-full animate-spin" />
                        ) : isBuying ? (
                          <div className="w-4 h-4 border-2 border-simpson-white border-t-transparent rounded-full animate-spin" />
                        ) : !canAfford ? (
                          <span>Insuffisant</span>
                        ) : (
                          <span>Acheter</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/40 dark:bg-simpson-darklight/40 backdrop-blur-md rounded-2xl border border-simpson-gray/10 dark:border-white/5 w-full max-w-5xl mx-auto">
            <p className="text-xs sm:text-sm font-medium text-simpson-gray">Aucun booster n'est disponible en rayon actuellement.</p>
          </div>
        )}
      </div>

      {/* MODAL PROBABILITÉS */}
      <Modal isOpen={!!detailBooster} onClose={() => setDetailBooster(null)}>
        <div className="flex flex-col gap-5 p-5 pt-8 font-main text-simpson-dark dark:text-simpson-white w-72 sm:w-80 max-w-full">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-simpson-orange dark:text-simpson-yellow leading-tight">{detailBooster?.name}</h2>
            <p className="text-xs text-simpson-gray">
              Contient {detailBooster?.quantity || 5} carte{(detailBooster?.quantity || 5) > 1 ? "s" : ""} • Taux d'obtention
            </p>
          </div>

          <div className="bg-simpson-gray/5 dark:bg-black/20 rounded-xl p-4 border border-simpson-gray/10 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-simpson-gray/10 dark:border-white/10 text-simpson-gray">
              <span>Rareté</span>
              <span className="flex items-center gap-1"><FaPercentage /> Probabilité</span>
            </div>

            {detailBooster?.probabilities && detailBooster.probabilities.length > 0 ? (
              detailBooster.probabilities.map((prob, index) => {
                const style = rarityStyles[prob.rarity] || {
                  label: prob.rarity,
                  textClass: "text-simpson-dark dark:text-white",
                  bgClass: "bg-simpson-gray/10",
                };
                return (
                  <div key={index} className="flex items-center justify-between text-xs font-bold gap-6">
                    <span className={style.textClass}>{style.label}</span>
                    <span className={`${style.bgClass} px-2 py-0.5 rounded-md shrink-0`}>{prob.value.toFixed(1)}%</span>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-xs text-simpson-gray py-2">Aucune donnée de probabilité disponible.</p>
            )}
          </div>

          <div className="text-[11px] text-simpson-gray/80 text-center leading-relaxed px-1">
            Chaque booster contient un ensemble de cartes distribuées aléatoirement selon les taux indiqués ci-dessus.
          </div>

          <Button onClick={() => setDetailBooster(null)} className="w-full py-2 text-xs font-bold rounded-xl bg-simpson-dark dark:bg-white dark:text-simpson-dark">
            Fermer
          </Button>
        </div>
      </Modal>

      {/* MODAL DONUTS */}
      <Modal isOpen={isDonutModalOpen} onClose={() => !isPurchasing && setIsDonutModalOpen(false)}>
        <div className="flex flex-col gap-6 p-5 pt-8 font-main rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg">
          {isPurchasing && (
            <div className="absolute inset-0 bg-white/90 dark:bg-simpson-darklight/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 animate-fade-in rounded-2xl">
              <div className="w-10 h-10 border-4 border-simpson-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-simpson-dark dark:text-simpson-white tracking-wide">Achat en cours...</p>
            </div>
          )}

          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-simpson-dark dark:text-simpson-white">Réserve de donuts</h2>
            <p className="text-sm text-simpson-gray">Choisis un lot pour obtenir des donuts et débloquer de nouveaux boosters.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {donutPacks.map((pack) => (
              <div
                key={pack.amount}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all group ${
                  pack.popular
                    ? "border-simpson-orange bg-simpson-orange/5 dark:bg-simpson-yellow/5 dark:border-simpson-yellow"
                    : "border-simpson-gray/10 bg-white dark:bg-simpson-darklight dark:border-white/5 hover:border-simpson-orange/30"
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-2.5 px-2 py-0.5 bg-simpson-orange dark:bg-simpson-yellow text-white dark:text-simpson-dark text-[9px] font-bold rounded-full">
                    Populaire
                  </span>
                )}

                <div className="w-11 h-11 relative flex items-center justify-center bg-simpson-gray/5 dark:bg-white/5 rounded-full group-hover:scale-105 transition-transform mt-1">
                  <Image src="/donuts1.webp" alt="Donut" width={28} height={28} className="object-contain" />
                </div>

                <div className="text-center">
                  <h3 className="text-base font-bold text-simpson-dark dark:text-simpson-white">x{pack.amount}</h3>
                  <p className="text-xs text-simpson-gray">Donuts</p>
                </div>

                <Button
                  onClick={() => handlePurchaseDonuts(pack.amount)}
                  className={`w-full py-1.5 text-xs font-bold rounded-lg transition-all ${
                    pack.popular ? "bg-simpson-orange dark:bg-simpson-yellow" : "bg-simpson-dark dark:bg-white dark:text-simpson-dark"
                  }`}
                >
                  {pack.price}
                </Button>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-center text-simpson-gray/70 leading-relaxed px-2">
            Les donuts sont une monnaie virtuelle utilisable uniquement dans le jeu. En procédant à l'achat, tu acceptes les conditions générales de vente.
          </p>
        </div>
      </Modal>
    </div>
  );
}