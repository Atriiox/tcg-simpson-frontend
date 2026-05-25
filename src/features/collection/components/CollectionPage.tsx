"use client";

import { useFilter } from "@/features/collection/hooks/useFilter";
import FilterPanel from "./filterPanel";
import CollectionPanel from "./CollectionPanel";

export default function CollectionPage() {
  // Le hook est placé ici pour centraliser l'état des filtres

  const { filters, handleSelect, resetFilters } = useFilter({
    rarity: [],
    type: [],
    serie: [],
  });

  return (
    <div className="flex">
      {/* Panneau de filtres */}
      <FilterPanel 
        filters={filters} 
        handleSelect={handleSelect} 
        resetFilters={resetFilters} 
      />

      {/* Affichage des cartes */}
      <CollectionPanel 
        filters={filters} // On passe les filtres ici
        isCreatingDeck={false}
        selectedCardIds={[]}
        toggleCardSelection={() => {}}
        maxCardsReached={false}
      />
    </div>
  );
}