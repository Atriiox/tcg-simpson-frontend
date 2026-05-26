import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Filters } from "@/features/collection/hooks/useFilter"

export type CollectionCard = {
  id: string;
  name: string;
  ATK: number;
  PV: number;
  description: string;
  slug: string;
  rarity: string;
  type: string;
  serie: {
    id_serie: {
      id: string;
      name: string;
    };
    position: number;
  };
  family: {
    id: string;
    name: string;
    description: string;
    bonus: {
      ATK: number;
      PV: number;
    };
  };
  affinity: {
    id: string;
    name: string;
    description: string;
    bonus: {
      ATK: number;
      PV: number;
    };
  };
};

type UseCollectionReturn = {
  collection: CollectionCard[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useCollection(filters: Filters= { rarity: [], type: [], serie: [] }, search: string = ""): UseCollectionReturn {
  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // 300ms de délai de frappe

    return () => clearTimeout(handler);
  }, [search]);

  const fetchCollection = async () => {
    if (!token) {
      setError("UNAUTHORIZED");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/users/me/collection`
      const params = new URLSearchParams();

      if (debouncedSearch.trim().length > 0) {
        params.append("q", debouncedSearch.trim());
      }

      if (filters) {
  
      if (filters.rarity && filters.rarity.length > 0) {
  filters.rarity.forEach((rarityText) => {
    let rarityId = "1";

    switch (rarityText) {
      case "Normal":
        rarityId = "1";
        break;
      case "Rare":
        rarityId = "2";
        break;
      case "Légendaire":
        rarityId = "3";
        break;
    }
        
        params.append("rarity", rarityId);
        })}
      
      if (filters.type && filters.type.length > 0) {
  filters.type.forEach((t) => params.append("type", t));
}

if (filters.serie && filters.serie.length > 0) {
  filters.serie.forEach((s) => params.append("serie", s));
}

if (params.toString()) {
    url += `?${params.toString()}`;
      }
    }

      const response = await fetch(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Une erreur est survenue");
        return;
      }

      const data = await response.json();
      setCollection(data);
    } catch {
      setError("NETWORK_ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [token, filters?.rarity, filters?.type, filters?.serie, debouncedSearch]);

  return { collection, isLoading, error, refetch: fetchCollection };
}
