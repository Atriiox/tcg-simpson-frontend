"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { env } from "@/config/env";
import { LuInfo } from "react-icons/lu";
import { FaPercentage } from "react-icons/fa"; // 🌟 AJOUT : Pour la modal de probabilités
import {
  UserBoosterArraySchema,
  UserBoosters,
} from "@/features/booster/boosterOpener/schema/booster.schema";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal"; // 🌟 AJOUT : Pour afficher les détails

interface BoostersTabProps {
  onOpen: (boosterId: string, name: string, slug: string) => void;
  activeTab: string;
  onRefreshRef?: React.RefObject<(() => void) | null>;
}

// Styles des raretés identiques à la boutique
const rarityStyles: Record<
  string,
  { label: string; textClass: string; bgClass: string }
> = {
  Common: {
    label: "Commune",
    textClass: "text-slate-500 dark:text-slate-400",
    bgClass: "bg-slate-100 dark:bg-slate-800",
  },
  Rare: {
    label: "Rare",
    textClass: "text-sky-500 dark:text-sky-400",
    bgClass: "bg-sky-100 dark:bg-sky-900/40",
  },
  Legendary: {
    label: "Légendaire",
    textClass: "text-amber-500 dark:text-simpson-yellow",
    bgClass: "bg-amber-100 dark:bg-amber-900/40",
  },
};

export default function BoostersTab({
  onOpen,
  activeTab,
  onRefreshRef,
}: BoostersTabProps) {
  const [userBoosters, setUserBoosters] = useState<UserBoosters>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detailBooster, setDetailBooster] = useState<any | null>(null); // 🌟 AJOUT : État pour le booster sélectionné
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

  return (
    <>
      {hasBoosters ? (
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
                {/* 🌟 FIX : Toujours actif, ouvre la modal locale directement au clic */}
                <button
                  onClick={() => setDetailBooster(userBooster.booster)}
                  className="absolute top-2.5 left-2.5 text-simpson-gray/70 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer transition-colors duration-200 outline-none p-1 hover:bg-simpson-gray/10 dark:hover:bg-white/5 rounded-lg z-10"
                >
                  <LuInfo size={18} />
                </button>

                <span className="absolute top-3 right-3 bg-simpson-orange dark:bg-simpson-yellow text-white dark:text-simpson-dark font-bold text-[11px] px-2 py-0.5 rounded-lg shadow-xs">
                  x{userBooster.number}
                </span>

                <div className="w-28 h-40 relative mt-4 transition-transform duration-300 group-hover:scale-105">
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
      )}

      {/* 🌟 MODAL DES PROBABILITÉS INTÉGRÉE (Même design que le Shop) */}
      <Modal isOpen={!!detailBooster} onClose={() => setDetailBooster(null)}>
        <div className="flex flex-col gap-5 p-5 pt-8 font-main text-simpson-dark dark:text-simpson-white w-72 sm:w-80 max-w-full">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-simpson-orange dark:text-simpson-yellow leading-tight">
              {detailBooster?.name}
            </h2>
            <p className="text-xs text-simpson-gray">
              Contient {detailBooster?.quantity || 5} carte
              {(detailBooster?.quantity || 5) > 1 ? "s" : ""} • Taux d'obtention
            </p>
          </div>

          <div className="bg-simpson-gray/5 dark:bg-black/20 rounded-xl p-4 border border-simpson-gray/10 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-simpson-gray/10 dark:border-white/10 text-simpson-gray">
              <span>Rareté</span>
              <span className="flex items-center gap-1">
                <FaPercentage /> Probabilité
              </span>
            </div>

            {detailBooster?.probabilities &&
            detailBooster.probabilities.length > 0 ? (
              detailBooster.probabilities.map((prob: any, index: number) => {
                const style = rarityStyles[prob.rarity] || {
                  label: prob.rarity,
                  textClass: "text-simpson-dark dark:text-white",
                  bgClass: "bg-simpson-gray/10",
                };
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs font-bold gap-6"
                  >
                    <span className={style.textClass}>{style.label}</span>
                    <span
                      className={`${style.bgClass} px-2 py-0.5 rounded-md shrink-0`}
                    >
                      {prob.value.toFixed(1)}%
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-xs text-simpson-gray py-2">
                Aucune donnée de probabilité disponible.
              </p>
            )}
          </div>

          <div className="text-[11px] text-simpson-gray/80 text-center leading-relaxed px-1">
            Chaque booster contient un ensemble de cartes distribuées
            aléatoirement selon les taux indiqués ci-dessus.
          </div>

          <Button
            onClick={() => setDetailBooster(null)}
            className="w-full py-2 text-xs font-bold rounded-xl bg-simpson-dark dark:bg-white dark:text-simpson-dark"
          >
            Fermer
          </Button>
        </div>
      </Modal>
    </>
  );
}
