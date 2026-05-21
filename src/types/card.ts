export interface Bonus {
  ATK: number;
  PV: number;
}

export interface Family {
  _id: string;
  name: string;
  desc: string;
  bonus: Bonus;
}

export interface Affinity {
  _id: string;
  name: string;
  desc: string;
  bonus: Bonus;
}

export interface Serie {
  _id: string;
  name: string;
}

export interface Card {
  _id: string;
  name: string;
  slug: string;
  type: "Personnage" | "Objet" | "Terrain";
  rarity: string;
  ATK: number;
  PV: number;
  family: Family;
  affinity: Affinity;
  serie: {
    id_serie: Serie;
    position: number;
  };
}
