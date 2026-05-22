"use client";

import { useState } from "react";
import Card from "../../card/components/card";
import { useCollection } from "../hooks/useCollection";
import { FiGrid } from "react-icons/fi";

type CardsPerRow = 4 | 6 | 8;

export default function CollectionPanel() {
  const { collection, isLoading, error } = useCollection();
  const [cardsPerRow, setCardsPerRow] = useState<CardsPerRow>(6);

  const gridColsConfig = {
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    8: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8",
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <div className="text-center space-y-2 animate-pulse">
          <div className="w-8 h-8 border-4 border-simpson-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-medium text-simpson-gray">Récupération de l'inventaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent p-6">
        <p className="text-medium text-simpson-orange font-semibold bg-simpson-orange/5 px-4 py-2 rounded-xl border border-simpson-orange/10">
          {error}
        </p>
      </div>
    );
  }

  if (collection.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <p className="text-medium text-simpson-gray font-medium">Aucune carte dans votre collection</p>
      </div>
    );
  }

  const uniqueCollection = collection.filter(
    (card, index, self) => self.findIndex((c) => c.id === card.id) === index
  );

  return (
    /* 🎯 LE CONTENEUR GLOBAL DE LA ZONE CENTRALE :
       - h-full fige la hauteur totale.
       - overflow-hidden empêche le bloc entier (y compris le titre) de scroller.
    */
    <div className="flex-1 h-full overflow-hidden p-6 bg-transparent flex flex-col">
      
      {/* 📌 HEADER DE LA COLLECTION (Désormais 100% fixe en haut) */}
      {/* shrink-0 est crucial pour empêcher Flexbox de le compresser au profit de la grille */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-simpson-gray/5 pb-4 shrink-0">
        <h1 className="text-subtitle font-black text-simpson-dark dark:text-simpson-white uppercase tracking-wider text-center sm:text-left">
          Ma Collection <span className="text-body font-bold text-simpson-gray ml-2">({collection.length})</span>
        </h1>

        {/* CONTRÔLES D'AFFICHAGE */}
        <div className="flex items-center gap-2 bg-white dark:bg-simpson-darklight p-1 rounded-xl border border-simpson-gray/10 dark:border-transparent select-none">
          <div className="flex items-center gap-1 px-2 text-xs font-bold uppercase tracking-wider text-simpson-gray hidden md:flex">
            <FiGrid size={14} className="mr-1" />Affichage
          </div>
          {([4, 6, 8] as CardsPerRow[]).map((num) => (
            <button
              key={num}
              onClick={() => setCardsPerRow(num)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black transition-all cursor-pointer
                ${cardsPerRow === num
                  ? "bg-simpson-orange dark:bg-simpson-yellow text-white dark:text-simpson-dark shadow-sm scale-105"
                  : "text-simpson-gray hover:text-simpson-dark dark:hover:text-simpson-white"
                }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      
      {/* 🔮 UNIQUE ZONE DE SCROLL DU MILIEU :
         - flex-1 prend tout l'espace disponible restant sous le header.
         - overflow-y-auto et overflow-x-hidden confinent le scroll vertical uniquement ici.
         - custom-scrollbar applique tes styles si tu en as dans globals.css.
      */}
      <div className="flex-1 pt-6 overflow-y-auto overflow-x-hidden custom-scrollbar w-full">
        <div className={`grid ${gridColsConfig[cardsPerRow]} gap-6 w-full justify-items-center content-start pb-10`}>
          {uniqueCollection.map((card) => (
            <div
              key={card.id}
              className="w-full min-w-[120px] max-w-[150px] transition-all duration-300 hover:-translate-y-1.5 hover:drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)] dark:hover:drop-shadow-[0_10px_15px_rgba(255,255,255,0.1)]"
            >
              <Card
                name={card.name}
                slug={card.slug}
                type={card.type as "Personnage" | "Terrain" | "Objet"}
                rarity={card.rarity}
                ATK={card.ATK}
                PV={card.PV}
                family={card.family.name}
                affinity={card.affinity.name}
                serie={{
                  name_serie: card.serie.id_serie.name,
                  position: card.serie.position,
                }}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}