import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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

export function useCollection(): UseCollectionReturn {
  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.user.token);

  const fetchCollection = async () => {
    if (!token) {
      setError("UNAUTHORIZED");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/collection`,
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
  }, [token]);

  return { collection, isLoading, error, refetch: fetchCollection };
}
