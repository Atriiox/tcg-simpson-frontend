"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { env } from "@/config/env";
import { UserBoosterArraySchema } from "../../booster/boosterOpener/schema/booster.schema";

export interface ShopBooster {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  probabilities: {
    rarity: "Common" | "Rare" | "Legendary";
    value: number;
  }[];
}

export interface UseShopBoosterResult {
  boosters: ShopBooster[];
  ownedBoosters: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  buyBooster: (boosterId: string) => Promise<{ ok: boolean; money?: number }>;
  loadOwnedBoostersCounts: () => Promise<void>;
}

export function useShopBooster(): UseShopBoosterResult {
  const [boosters, setBoosters] = useState<ShopBooster[]>([]);
  const [ownedBoosters, setOwnedBoosters] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.user.token);

  const loadOwnedBoostersCounts = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/users/me/boosters`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const rawData = await response.json();
        const userBoosters = UserBoosterArraySchema.parse(rawData);
        const counts: Record<string, number> = {};
        userBoosters.forEach((ub) => {
          counts[ub.booster.id] = ub.number;
        });
        setOwnedBoosters(counts);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error("Erreur inventaire boosters :", err);
      setError("Impossible de synchroniser ton inventaire de boosters.");
    }
  }, [token]);

  useEffect(() => {
    async function fetchShopAndInventory() {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/boosters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setBoosters(data);
        await loadOwnedBoostersCounts();
      } catch {
        setError(
          "Une erreur réseau est survenue. L'administration de la centrale nucléaire refuse de répondre. Code : NETWORK_ERROR",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchShopAndInventory();
  }, [token, loadOwnedBoostersCounts]);

  const buyBooster = useCallback(
    async (boosterId: string): Promise<{ ok: boolean; money?: number }> => {
      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/users/me/boosters/${boosterId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setOwnedBoosters((prev) => ({
            ...prev,
            [boosterId]: (prev[boosterId] || 0) + 1,
          }));
          return { ok: true, money: data.money };
        }
        return { ok: false };
      } catch {
        return { ok: false };
      }
    },
    [token],
  );

  return {
    boosters,
    ownedBoosters,
    isLoading,
    error,
    buyBooster,
    loadOwnedBoostersCounts,
  };
}