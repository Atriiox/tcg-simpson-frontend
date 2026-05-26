"use client";

import { useState, useEffect } from "react"; // 🎯 Ajout de useEffect
import Image from "next/image";
import { useMoney } from "../hooks/useMoney";
import { LuInfo } from "react-icons/lu";
import { FaPlusCircle, FaCheckCircle } from "react-icons/fa";
import Booster from "../../booster/components/BoosterDisplay";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface BoosterData {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  description: string;
  contentInfo: string;
  highlightText: string;
}

interface DonutPack {
  amount: number;
  price: string;
  popular: boolean;
}

const BOOSTERS_LIST: BoosterData[] = [
  {
    id: "serie-1",
    title: "Booster Série 1",
    imageUrl: "/booster1.webp",
    price: 50,
    description:
      "Collectionne les cartes exclusives de tes personnages favoris.",
    contentInfo: "Contient ",
    highlightText: "5 cartes aléatoires",
  },
  {
    id: "legendaire",
    title: "Pack Légendaire",
    imageUrl: "/booster2.webp",
    price: 500,
    description:
      "La rareté absolue. Idéal pour compléter les chefs-d'œuvre de ta collection.",
    contentInfo: "Contient ",
    highlightText: "1 carte Légendaire",
  },
];

const donutPacks: DonutPack[] = [
  { amount: 50, price: "1,99 €", popular: false },
  { amount: 100, price: "3,49 €", popular: false },
  { amount: 200, price: "5,99 €", popular: true },
  { amount: 500, price: "12,99 €", popular: false },
  { amount: 1000, price: "19,99 €", popular: false },
];

export default function Shop() {
  const { money: userDonuts, updateMoney } = useMoney();

  // 🎯 État pour bloquer l'affichage dynamique asynchrone pendant le SSR
  const [isMounted, setIsMounted] = useState(false);

  const [isDonutModalOpen, setIsDonutModalOpen] = useState(false);
  const [buyingBoosterId, setBuyingBoosterId] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const [addedDonutsAmount, setAddedDonutsAmount] = useState<number>(0);

  const [ownedBoosters, setOwnedBoosters] = useState<Record<string, number>>({
    "serie-1": 0,
    legendaire: 0,
  });

  // 🎯 Déclenché dès que le composant est monté côté navigateur
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBuyBooster = async (booster: BoosterData) => {
    if (userDonuts < booster.price || buyingBoosterId) return;

    setBuyingBoosterId(booster.id);
    const newBalance = userDonuts - booster.price;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const result = await updateMoney(newBalance);

      if (result.ok) {
        setOwnedBoosters((prev) => ({
          ...prev,
          [booster.id]: prev[booster.id] + 1,
        }));
      }
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
    } finally {
      setBuyingBoosterId(null);
    }
  };

  const handlePurchaseDonuts = async (amount: number) => {
    if (purchaseStatus !== "idle") return;

    setAddedDonutsAmount(amount);
    setPurchaseStatus("loading");
    const newBalance = userDonuts + amount;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = await updateMoney(newBalance);

      if (result.ok) {
        setPurchaseStatus("success");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        setPurchaseStatus("idle");
      }
    } catch (error) {
      console.error("Erreur d'achat :", error);
      setPurchaseStatus("idle");
    } finally {
      setPurchaseStatus("idle");
      setIsDonutModalOpen(false);
    }
  };

  const handleOpenDetails = (title: string) => {
    alert(`Probabilités et détails du : ${title}`);
  };

  return (
    <div className="w-full flex-1 p-6 md:p-10 font-main text-simpson-dark dark:text-simpson-white select-none overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-simpson-gray/10 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-simpson-orange dark:text-simpson-yellow">
              Boutique
            </h1>
            <p className="text-sm font-medium text-simpson-gray mt-1">
              Échange tes donuts contre des boosters !
            </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 justify-items-center max-w-5xl mx-auto w-full pt-4">
          {BOOSTERS_LIST.map((booster) => {
            // 🎯 Sécurité : Si pas encore monté, on s'aligne sur le SSR (false)
            const canAfford = isMounted ? userDonuts >= booster.price : false;
            const isBuying = buyingBoosterId === booster.id;

            return (
              <div
                key={booster.id}
                className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full max-w-md bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-6 rounded-xl border border-white/40 dark:border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl group"
              >
                <div className="flex justify-center transform transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:-rotate-1 filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_20px_rgba(0,0,0,0.35)] shrink-0">
                  <Booster
                    imageUrl={booster.imageUrl}
                    className="w-44 h-62 sm:w-48 sm:h-68"
                  />
                </div>

                <div className="flex flex-col justify-between flex-1 w-full min-h-60">
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="text-xs font-semibold text-simpson-gray dark:text-simpson-white/40 bg-simpson-gray/10 dark:bg-white/5 px-2.5 py-1 rounded-md">
                      Possédé :{" "}
                      <span className="text-simpson-dark dark:text-simpson-white font-bold">
                        {ownedBoosters[booster.id]}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenDetails(booster.title)}
                      className="text-simpson-gray/70 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer transition-colors duration-200 outline-none p-1.5 hover:bg-simpson-gray/10 dark:hover:bg-white/5 rounded-xl"
                    >
                      <LuInfo size={20} />
                    </button>
                  </div>

                  <div className="space-y-2 text-left flex-1 flex flex-col justify-center">
                    <div>
                      <h3 className="text-lg font-bold text-simpson-dark dark:text-simpson-white">
                        {booster.title}
                      </h3>
                      <p className="text-xs text-simpson-gray dark:text-simpson-white/60 tracking-wide leading-relaxed mt-1">
                        {booster.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-start gap-2 pt-0.5">
                      <span className="text-xs font-medium text-simpson-dark dark:text-simpson-white">
                        {booster.contentInfo}
                        <span className="font-bold text-simpson-orange dark:text-simpson-yellow">
                          {booster.highlightText}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-simpson-gray/10 dark:border-white/5">
                    <div className="flex flex-col items-start shrink-0">
                      <span className="text-[10px] font-medium text-simpson-gray block mb-0.5 uppercase tracking-wider">
                        Prix
                      </span>
                      <div className="flex items-center gap-1 font-black text-xl text-simpson-dark dark:text-simpson-white">
                        {/* 🎯 On n'affiche le prix réel que lorsque le client est monté */}
                        <span>{isMounted ? booster.price : "--"}</span>
                        <Image
                          src="/donuts1.webp"
                          alt="Donut Icon"
                          width={18}
                          height={18}
                          className="w-4.5 h-4.5 object-contain"
                          priority
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyBooster(booster)}
                      disabled={!canAfford || isBuying || !!buyingBoosterId}
                      className={`flex-1 h-11 text-xs font-bold rounded-xl shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer
                        ${
                          !canAfford
                            ? "bg-simpson-gray/10 text-simpson-gray/40 dark:bg-white/5 dark:text-simpson-gray/60 cursor-not-allowed"
                            : "bg-simpson-orange hover:bg-simpson-orange/90 text-simpson-white shadow-md"
                        } ${isBuying || (buyingBoosterId && buyingBoosterId !== booster.id) ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      {/* 🎯 Rendu sécurisé pour éviter le désaccord SSR / Client */}
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
      </div>

      <Modal
        isOpen={isDonutModalOpen}
        onClose={() => purchaseStatus === "idle" && setIsDonutModalOpen(false)}
      >
        <div className="relative flex flex-col gap-6 p-5 max-w-2xl w-full mx-auto font-main overflow-hidden rounded-2xl">
          {purchaseStatus === "loading" && (
            <div className="absolute inset-0 bg-white/90 dark:bg-simpson-darklight/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 animate-fade-in">
              <div className="w-10 h-10 border-4 border-simpson-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-simpson-dark dark:text-simpson-white tracking-wide">
                Achat en cours...
              </p>
            </div>
          )}

          {purchaseStatus === "success" && (
            <div className="absolute inset-0 bg-emerald-500 z-50 flex flex-col items-center justify-center gap-3 text-white animate-fade-in">
              <FaCheckCircle
                className="text-white scale-110 drop-shadow-md animate-bounce"
                size={48}
              />
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black tracking-wide">
                  Achat réussi !
                </h3>
                <p className="text-base font-bold bg-white/20 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
                  +{addedDonutsAmount} Donuts
                </p>
              </div>
            </div>
          )}

          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-simpson-dark dark:text-simpson-white">
              Réserve de donuts
            </h2>
            <p className="text-sm text-simpson-gray">
              Choisis un lot pour obtenir des donuts et débloquer de nouveaux
              boosters.
            </p>
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
                  <Image
                    src="/donuts1.webp"
                    alt="Donut"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-base font-bold text-simpson-dark dark:text-simpson-white">
                    x{pack.amount}
                  </h3>
                  <p className="text-xs text-simpson-gray">Donuts</p>
                </div>

                <Button
                  onClick={() => handlePurchaseDonuts(pack.amount)}
                  className={`w-full py-1.5 text-xs font-bold rounded-lg transition-all ${
                    pack.popular
                      ? "bg-simpson-orange dark:bg-simpson-yellow"
                      : "bg-simpson-dark dark:bg-white dark:text-simpson-dark"
                  }`}
                >
                  {pack.price}
                </Button>
              </div>
            ))}

            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-simpson-gray/20 text-center gap-1 min-h-35">
              <p className="text-[11px] font-bold text-simpson-gray">
                Besoin de plus ?
              </p>
              <p className="text-xs font-medium text-simpson-dark dark:text-simpson-white">
                Mairie de Springfield
              </p>
            </div>
          </div>

          <p className="text-[11px] text-center text-simpson-gray/70 leading-relaxed px-2">
            Les donuts sont une monnaie virtuelle utilisable uniquement dans le
            jeu. En procédant à l'achat, tu acceptes les conditions générales de
            vente.
          </p>
        </div>
      </Modal>
    </div>
  );
}
