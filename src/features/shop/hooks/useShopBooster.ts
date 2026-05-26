import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { env } from "@/config/env";

export interface ShopBooster {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
}

export interface UseShopBoosterResult {
  boosters: ShopBooster[];
  isLoading: boolean;
  error: string | null;
  buyBooster: (boosterId: string) => Promise<boolean>;
}

export function useShopBooster(): UseShopBoosterResult {
  const [boosters, setBoosters] = useState<ShopBooster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    async function fetchBoosters() {
      try {
        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/boosters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erreur lors du chargement des boosters");
        const data = await response.json();
        setBoosters(data);
      } catch {
        setError("Impossible de charger les boosters");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBoosters();
  }, [token]);

  const buyBooster = useCallback(async (boosterId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/users/me/boosters/${boosterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }, [token]);

  return { boosters, isLoading, error, buyBooster };
}