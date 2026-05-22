"use client";

import { useState } from "react";
import FilterPanel from "./FilterPanel";
import RightPanel from "./RightPanel";
import CollectionPanel from "./CollectionPanel";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

export default function Main() {
  const [showFilter, setShowFilter] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <div 
      className="grid h-full w-full overflow-hidden relative bg-simpson-white dark:bg-simpson-dark"
      style={{
        gridTemplateColumns: `${showFilter ? "240px" : "0px"} minmax(0, 1fr) ${showRight ? "220px" : "0px"}`,
        transition: "grid-template-columns 300ms ease-in-out"
      }}
    >
      {/* ========================================================= */}
      {/* 1. PANNEAU GAUCHE : FILTRES (FIGÉ) */}
      {/* ========================================================= */}
      {/* h-full et overflow-hidden empêchent ce bloc de grandir ou de scroller la page entière */}
      <div className="relative z-10 border-r border-simpson-gray/10 dark:border-simpson-darklight/40 h-full overflow-hidden shadow-xl dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)] bg-simpson-white dark:bg-simpson-dark">
        {/* Si le contenu des filtres est plus grand que l'écran, il scrolle UNIQUEMENT sur lui-même */}
        <div className="w-60 h-full overflow-y-auto custom-scrollbar">
          <FilterPanel />
        </div>
      </div>

      {/* 🔘 TOGGLE FILTRES */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="absolute top-1/2 -translate-y-1/2 z-40 w-6 h-12 flex items-center justify-center bg-white dark:bg-simpson-darklight border border-simpson-gray/20 dark:border-simpson-dark text-simpson-gray hover:text-white hover:bg-simpson-orange dark:hover:bg-simpson-yellow dark:hover:text-simpson-dark rounded-r-xl shadow-md transition-all duration-200 cursor-pointer"
        style={{
          left: showFilter ? "240px" : "0px",
          transition: "left 300ms ease-in-out"
        }}
        aria-label={showFilter ? "Masquer les filtres" : "Afficher les filtres"}
      >
        {showFilter ? <FaAngleLeft size={14} /> : <FaAngleRight size={14} />}
      </button>


      {/* ========================================================= */}
      {/* 2. ZONE CENTRALE : GRILLE DE COLLECTION (SCROLL UNIQUE) */}
      {/* ========================================================= */}
      {/* Ce composant gère son propre overflow-y-auto, c'est le seul poumon de scroll de l'écran */}
      <CollectionPanel />


      {/* ========================================================= */}
      {/* 3. PANNEAU DROITE : DECKS / BOOSTERS (FIGÉ) */}
      {/* ========================================================= */}
      {/* Même logique d'étanchéité que le panneau gauche */}
      <div className="relative z-10 border-l border-simpson-gray/10 dark:border-simpson-darklight/40 h-full overflow-hidden shadow-[-10px_0_20px_rgba(0,0,0,0.04)] dark:shadow-[-4px_0_24px_rgba(0,0,0,0.4)] bg-simpson-white dark:bg-simpson-dark">
        {/* Si les decks dépassent, le scroll reste confiné à cette colonne de 220px */}
        <div className="w-55 h-full overflow-y-auto custom-scrollbar">
          <RightPanel />
        </div>
      </div>

      {/* 🔘 TOGGLE DROITE */}
      <button
        onClick={() => setShowRight(!showRight)}
        className="absolute top-1/2 -translate-y-1/2 z-40 w-6 h-12 flex items-center justify-center bg-white dark:bg-simpson-darklight border border-simpson-gray/20 dark:border-simpson-dark text-simpson-gray hover:text-white hover:bg-simpson-orange dark:hover:bg-simpson-yellow dark:hover:text-simpson-dark rounded-l-xl shadow-md transition-all duration-200 cursor-pointer"
        style={{
          right: showRight ? "220px" : "0px",
          transition: "right 300ms ease-in-out"
        }}
        aria-label={showRight ? "Masquer le panneau" : "Afficher le panneau"}
      >
        {showRight ? <FaAngleRight size={14} /> : <FaAngleLeft size={14} />}
      </button>
    </div>
  );
}