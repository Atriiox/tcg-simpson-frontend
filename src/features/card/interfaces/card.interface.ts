export interface Bonus {
  ATK: number;
  PV: number;
}

export interface Family {
  id: string;
  name: string;
  description: string;
  bonus: Bonus;
}

export interface Affinity {
  id: string;
  name: string;
  description: string;
  bonus: Bonus;
}

export interface Serie {
  id_serie: { id: string; name: string };
  position: number;
}

export interface CardData {
  id: string;
  name: string;
  slug: string;
  type: "Personnage" | "Terrain" | "Objet";
  rarity: string;
  description: string;
  ATK: number;
  PV: number;
  family: Family;
  affinity: Affinity;
  serie: Serie;
}