"use client";

import { useState } from "react";
import Image from "next/image";
import { LuInfo } from "react-icons/lu";
import Booster from "../../booster/components/BoosterDisplay";

// 📌 Structures des données pour tes boosters
interface BoosterData {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  description: string;
  contentInfo: string;
  highlightText: string;
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

export default function Shop() {
  const [activeTab, setActiveTab] = useState<string>("serie-1");
  const [userDonuts, setUserDonuts] = useState<number>(180);

  // Suivi des stocks possédés par booster (id: quantité)
  const [ownedBoosters, setOwnedBoosters] = useState<Record<string, number>>({
    "serie-1": 0,
    legendaire: 0,
  });
  const [isBuying, setIsBuying] = useState<boolean>(false);

  // Récupération du booster sélectionné
  const currentBooster =
    BOOSTERS_LIST.find((b) => b.id === activeTab) || BOOSTERS_LIST[0];
  const canAfford = userDonuts >= currentBooster.price;

  const handleBuyBooster = async () => {
    if (!canAfford) return;

    setIsBuying(true);

    try {
      // 🚀 ICI : Ton appel API vers ton backend Node/Express
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setUserDonuts((prev) => prev - currentBooster.price);
      setOwnedBoosters((prev) => ({
        ...prev,
        [currentBooster.id]: prev[currentBooster.id] + 1,
      }));
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
    } finally {
      setIsBuying(false);
    }
  };

  const handleOpenDetails = () => {
    alert(`Probabilités et détails du : ${currentBooster.title}`);
  };

  return (
    <div className="flex-1 h-full p-6 bg-transparent flex flex-col font-main select-none">
      {/* 📌 HEADER TOTALEMENT ÉPURÉ & CENTRÉ */}
      <div className="flex flex-col items-center justify-center pb-6 shrink-0 gap-3">
        <h1 className="text-title text-simpson-dark dark:text-simpson-white uppercase tracking-widest text-center">
          Boutique
        </h1>

        {/* 🎯 SÉLECTEUR DE BOOSTER STYLE "GAMING CHIC" */}
        <div className="flex bg-simpson-gray/10 dark:bg-white/5 p-1 rounded-xl border border-simpson-gray/5 dark:border-white/5">
          {BOOSTERS_LIST.map((booster) => (
            <button
              key={booster.id}
              onClick={() => !isBuying && setActiveTab(booster.id)}
              disabled={isBuying}
              className={`px-4 py-1.5 text-medium uppercase tracking-wider rounded-lg transition-all duration-200 font-bold cursor-pointer text-xs
                ${
                  activeTab === booster.id
                    ? "bg-white dark:bg-simpson-darklight text-simpson-orange dark:text-simpson-yellow shadow-sm"
                    : "text-simpson-gray hover:text-simpson-dark dark:hover:text-simpson-white"
                } ${isBuying ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {booster.title}
            </button>
          ))}
        </div>
      </div>

      {/* 🔮 ZONE CENTRALE FOCUS */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 max-w-4xl mx-auto w-full px-4 group">
        {/* COLONNE GAUCHE : LE BOOSTER 3D DYNAMIQUE */}
        <div className="flex justify-center transform transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:-rotate-1 filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] shrink-0">
          {/* Key forcée sur l'image pour recharger proprement le Canvas 3D lors du switch */}
          <Booster
            key={currentBooster.imageUrl}
            imageUrl={currentBooster.imageUrl}
            className="w-60 h-85 sm:w-70 sm:h-100"
          />
        </div>

        {/* COLONNE DROITE : LA CARD ULTRA-MODERNE ET ÉPURÉE */}
        <div className="relative flex flex-col justify-between bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-6 rounded-xl border border-white/40 dark:border-white/10 shadow-xl max-w-sm w-full min-h-[350px] transition-all duration-300 hover:shadow-2xl">
          {/* 📌 BARRE D'ENTÊTE DE LA CARD */}
          <div className="flex items-center justify-between w-full mb-2">
            {/* Info Quantité possédée dynamique */}
            <div className="text-[12px] font-bold uppercase tracking-widest text-simpson-gray dark:text-simpson-white/40 bg-simpson-gray/10 dark:bg-white/5 px-2.5 py-1 rounded-md">
              Possédé :{" "}
              <span className="text-simpson-dark dark:text-simpson-white">
                {ownedBoosters[currentBooster.id]}
              </span>
            </div>

            {/* Bouton Détails */}
            <button
              onClick={handleOpenDetails}
              title="Voir les détails du booster"
              className="text-simpson-gray/70 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer transition-colors duration-200 outline-none p-1.5 hover:bg-simpson-gray/10 dark:hover:bg-white/5 rounded-xl"
            >
              <LuInfo size={20} />
            </button>
          </div>

          {/* 📌 CONTENU TEXTE DYNAMIQUE */}
          <div className="space-y-3 text-center md:text-left flex-1 flex flex-col justify-center">
            <div>
              <h3 className="text-title text-simpson-dark dark:text-simpson-white uppercase tracking-wider transition-all">
                {currentBooster.title}
              </h3>
              <p className="text-body text-simpson-gray dark:text-simpson-white/60 tracking-wide leading-relaxed mt-1 min-h-[48px]">
                {currentBooster.description}
              </p>
            </div>

            {/* Ligne d'info avec mise en valeur */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
              <span className="text-body font-medium text-simpson-dark dark:text-simpson-white">
                {currentBooster.contentInfo}
                <span className="font-bold text-simpson-orange dark:text-simpson-yellow">
                  {currentBooster.highlightText}
                </span>
              </span>
            </div>
          </div>

          {/* 📌 ZONE D'ACHAT DYNAMIQUE */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-simpson-gray/10 dark:border-white/5">
            {/* Prix */}
            <div className="flex flex-col items-start shrink-0">
              <span className="text-[10px] font-bold text-simpson-gray uppercase tracking-widest block mb-0.5">
                Prix
              </span>
              <div className="flex items-center gap-1 font-black text-2xl text-simpson-dark dark:text-simpson-white">
                <span>{currentBooster.price}</span>
                <Image
                  src="/donuts1.webp"
                  alt="Donut Icon"
                  width={128}
                  height={128}
                  className="w-5 h-5 object-contain image-render-auto select-none"
                  priority
                />
              </div>
            </div>

            {/* Bouton d'action principal */}
            <button
              onClick={handleBuyBooster}
              disabled={!canAfford || isBuying}
              className={`flex-1 h-13 text-medium font-bold uppercase tracking-widest rounded-2xl shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer
                ${
                  !canAfford
                    ? "bg-simpson-gray/10 text-simpson-gray/40 dark:bg-white/5 dark:text-simpson-gray/60 cursor-not-allowed shadow-none"
                    : "bg-simpson-orange hover:bg-simpson-orange/90 text-simpson-white hover:shadow-lg hover:shadow-simpson-orange/20"
                }
              `}
            >
              {isBuying ? (
                <>
                  <div className="w-4 h-4 border-2 border-simpson-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-body tracking-normal lowercase">
                    ...
                  </span>
                </>
              ) : !canAfford ? (
                <span className="text-body font-bold tracking-normal">
                  Insuffisant
                </span>
              ) : (
                <span>Acheter</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
