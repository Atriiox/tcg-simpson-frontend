import { useState } from "react";

export type Filters = { 
  rarity: string[];
  type: string[];
  serie: string[];
 };

export const useFilter = (initialFilters: Filters = { 
  rarity: [],
  type: [],
  serie: [],
 }) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleSelect = (group: string, value: string) => {
    // Nettoyage de la clé pour correspondre à l'objet Filters
    const groupLower = group.toLowerCase();
    let key: keyof Filters;

    // 2. Mapping strict et robuste (évite les bugs de remplacement d'accents/lettres)
    if (group === "Raretés") {
      key = "rarity";
    } else if (group === "Types") {
      key = "type";
    } else if (group === "Séries") {
      key = "serie";
    } else {
      return; // Groupe inconnu, on ne fait rien
    }
    
    setFilters((prev) => {
      const currentValues = prev[key];
      
      // MODIFICATION LOMBAIRE : Si la valeur existe, on la filtre (on la retire), sinon on l'ajoute
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [key]: newValues,
      };
    });
  };

const resetFilters = () => setFilters(initialFilters);

  return { filters, handleSelect, resetFilters };
};