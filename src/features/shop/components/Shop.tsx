"use client";

import { useState } from "react";
import Image from "next/image";
import { LuInfo } from "react-icons/lu"; // 🎯 Import de l'icône de détails
import Booster from "../../booster/components/BoosterDisplay";

export default function Shop() {
  // Simulations d'états (À brancher sur ton backend/Redux plus tard)
  const [userDonuts, setUserDonuts] = useState<number>(180);
  const [ownedBoosters, setOwnedBoosters] = useState<number>(0);
  const [isBuying, setIsBuying] = useState<boolean>(false);

  const BOOSTER_PRICE = 50;
  const canAfford = userDonuts >= BOOSTER_PRICE;

  const handleBuyBooster = async () => {
    if (!canAfford) return;

    setIsBuying(true);

    try {
      // 🚀 ICI : Ton appel API vers ton backend Node/Express
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setUserDonuts((prev) => prev - BOOSTER_PRICE);
      setOwnedBoosters((prev) => prev + 1);
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
    } finally {
      setIsBuying(false);
    }
  };

  const handleOpenDetails = () => {
    alert("Affichage des probabilités et détails du Booster Série 1 !");
  };

  return (
    <div className="flex-1 h-full p-6 bg-transparent flex flex-col font-main select-none">
      {/* 📌 HEADER TOTALEMENT ÉPURÉ & CENTRÉ */}
      <div className="flex items-center justify-center pb-2 shrink-0">
        <h1 className="text-title text-simpson-dark dark:text-simpson-white uppercase tracking-widest text-center">
          Boutique
        </h1>
      </div>

      {/* 🔮 ZONE CENTRALE FOCUS */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 max-w-4xl mx-auto w-full px-4 group">
        {/* COLONNE GAUCHE : LE BOOSTER 3D (PIÈCE MAÎTRESSE) */}
        <div className="flex justify-center transform transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:-rotate-1 filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] shrink-0">
          <Booster
            imageUrl="/booster1.webp"
            className="w-60 h-85 sm:w-70 sm:h-100"
          />
        </div>

   {/* COLONNE DROITE : LA CARD ULTRA-MODERNE ET ÉPURÉE 🎯 */}
<div className="relative flex flex-col justify-between bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-6 rounded-xl border border-white/40 dark:border-white/10 shadow-xl max-w-sm w-full min-h-[350px] transition-all duration-300 hover:shadow-2xl">
  
  {/* 📌 BARRE D'ENTÊTE DE LA CARD (Possédé à gauche, Infos à droite) */}
  <div className="flex items-center justify-between w-full mb-2">
    {/* Info Possédé style micro-badge chic */}
    <div className="text-[12px] font-bold uppercase tracking-widest text-simpson-gray dark:text-simpson-white/40 bg-simpson-gray/10 dark:bg-white/5 px-2.5 py-1 rounded-md">
      Possédé : <span className="text-simpson-dark dark:text-simpson-white">{ownedBoosters}</span>
    </div>

    {/* Bouton Détails (Plus discret, s'illumine au survol) */}
    <button
      onClick={handleOpenDetails}
      title="Voir les détails du booster"
      className="text-simpson-gray/70 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer transition-colors duration-200 outline-none p-1.5 hover:bg-simpson-gray/10 dark:hover:bg-white/5 rounded-xl"
    >
      <LuInfo size={20} />
    </button>
  </div>

  {/* 📌 CONTENU TEXTE (Aéré et centré) */}
  <div className="space-y-3 text-center md:text-left flex-1 flex flex-col justify-center">
    <div>
      <h3 className="text-title text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
        Booster Série 1
      </h3>
      <p className="text-body text-simpson-gray dark:text-simpson-white/60 tracking-wide leading-relaxed mt-1">
        Collectionne les cartes exclusives de tes personnages favoris.
      </p>
    </div>

    {/* Ligne d'info épurée (Plus d'encadré, juste une puce néon) */}
    <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
 
      <span className="text-body font-medium text-simpson-dark dark:text-simpson-white">
        Contient <span className="font-bold text-simpson-orange dark:text-simpson-yellow">5 cartes</span> aléatoires
      </span>
    </div>
  </div>

  {/* 📌 ZONE D'ACHAT ULTRA-MODERNE (Alignement horizontal pur) */}
  <div className="flex items-center gap-4 mt-6 pt-4 border-t border-simpson-gray/10 dark:border-white/5">
    
    {/* Prix minimalist à gauche */}
    <div className="flex flex-col items-start shrink-0">
      <span className="text-[10px] font-bold text-simpson-gray uppercase tracking-widest block mb-0.5">
        Prix
      </span>
      <div className="flex items-center gap-1 font-black text-2xl text-simpson-dark dark:text-simpson-white">
        <span>{BOOSTER_PRICE}</span>
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

    {/* Bouton d'action principal à droite */}
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
          <span className="text-body tracking-normal lowercase">...</span>
        </>
      ) : !canAfford ? (
        <span className="text-body font-bold tracking-normal">Insuffisant</span>
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
