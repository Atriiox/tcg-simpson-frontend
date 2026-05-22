"use client";

import Card from "../../card/components/card";
import { useCollection } from "../hooks/useCollection";

interface CollectionPanelProps {
  showFilter: boolean;
  showRight: boolean;
}

export default function CollectionPanel({ showFilter, showRight }: CollectionPanelProps) {
  const { collection, isLoading, error } = useCollection();

  const cardSize = !showFilter && !showRight ? 180 : !showFilter || !showRight ? 156 : 136;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-medium text-simpson-gray">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-medium text-red-500">{error}</p>
      </div>
    );
  }

  if (collection.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-medium text-simpson-gray">Aucune carte dans votre collection</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-title text-simpson-dark dark:text-simpson-light mb-6 uppercase tracking-wide text-center text-[22px] [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]">
        Ma Collection
      </h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center px-6 w-full">
        {collection.map((card) => (
          <div
            key={card.id}
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:drop-shadow-xl"
          >
            <Card
              size={cardSize}
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
  );
}
