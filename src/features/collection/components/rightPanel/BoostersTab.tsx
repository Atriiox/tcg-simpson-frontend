"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { env } from "@/config/env";
import {
  UserBoosterArraySchema,
  UserBoosters,
} from "../../../booster/boosterOpener/schema/booster.schema";
import Button from "@/components/ui/Button";

interface BoostersTabProps {
  onOpen: (boosterId: string, name: string, slug: string) => void;
  activeTab: string;
  onRefreshRef?: React.RefObject<(() => void) | null>; // 🌟 AJOUT : Ref pour exposer le refresh
}

export default function BoostersTab({
  onOpen,
  activeTab,
  onRefreshRef,
}: BoostersTabProps) {
  const [userBoosters, setUserBoosters] = useState<UserBoosters>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const loadBoosters = async () => {
    if (!token) return;
    setIsLoading(true);
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
        setUserBoosters(UserBoosterArraySchema.parse(rawData));
      }
    } catch (err) {
      console.error("Erreur chargement boosters panel droit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🌟 AJOUT : On attache la fonction à la ref partagée
  useEffect(() => {
    if (onRefreshRef) {
      onRefreshRef.current = loadBoosters;
    }
    return () => {
      if (onRefreshRef) onRefreshRef.current = null;
    };
  }, [onRefreshRef, token]);

  useEffect(() => {
    if (activeTab === "boosters") {
      loadBoosters();
    }
  }, [activeTab, token]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-simpson-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeBoosters = userBoosters.filter((b) => b.number > 0);
  const hasBoosters = activeBoosters.length > 0;

  return hasBoosters ? (
    <div className="w-full flex flex-col gap-6">
      {activeBoosters.map((userBooster) => {
        const boosterSlug = userBooster.booster.slug;
        const imageSrc = boosterSlug?.startsWith("/")
          ? boosterSlug
          : `/${boosterSlug}`;

        return (
          <div
            key={userBooster.booster.id}
            className="bg-white dark:bg-simpson-darklight border border-simpson-gray/10 p-4 rounded-2xl shadow-xs flex flex-col items-center gap-4 w-full group relative"
          >
            <span className="absolute top-3 right-3 bg-simpson-orange dark:bg-simpson-yellow text-white dark:text-simpson-dark font-bold text-[11px] px-2 py-0.5 rounded-lg shadow-xs">
              x{userBooster.number}
            </span>
            <div className="w-28 h-40 relative mt-2 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={imageSrc || "/booster1.webp"}
                alt={userBooster.booster.name}
                fill
                sizes="112px"
                priority
                className="object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
              />
            </div>
            <div className="w-full text-center space-y-3">
              <h3 className="font-bold text-simpson-dark dark:text-white text-xs">
                {userBooster.booster.name}
              </h3>
              <button
                onClick={() =>
                  onOpen(
                    userBooster.booster.id,
                    userBooster.booster.name,
                    userBooster.booster.slug,
                  )
                }
                className="w-full h-9 bg-simpson-orange hover:bg-simpson-orange/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                OUVRIR
              </button>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center text-center mt-8 px-2 gap-4">
      <p className="text-xs text-simpson-gray font-medium">
        Aucun booster disponible
      </p>
      <Button onClick={() => router.push("/boutique")} className="text-xs">
        Acheter des boosters
      </Button>
    </div>
  );
}
