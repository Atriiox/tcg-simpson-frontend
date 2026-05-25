import { useState } from "react";

export type Filters = { rarity: string; type: string; serie: string };

export const useFilter = (initialFilters: Filters = { rarity: "", type: "", serie: "" }) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleSelect = (group: string, value: string) => {
    // Nettoyage de la clé pour correspondre à l'objet Filters
    const key = group.toLowerCase().replace("é", "e").replace("s", "") as keyof Filters;
    
    // Si on reclique sur la même valeur, on désélectionne (toggle)
    setFilters(prev => ({ 
      ...prev, 
      [key]: prev[key] === value ? "" : value 
    }));
  };

  const resetFilters = () => setFilters({ rarity: "", type: "", serie: "" });

  return { filters, handleSelect, resetFilters };
};