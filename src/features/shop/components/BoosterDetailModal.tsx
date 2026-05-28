"use client";

import { FaPercentage } from "react-icons/fa";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { ShopBooster } from "../hooks/useShopBooster";

const rarityStyles: Record<string, { label: string; textClass: string; bgClass: string }> = {
  Common: { label: "Commune", textClass: "text-slate-500 dark:text-slate-400", bgClass: "bg-slate-100 dark:bg-slate-800" },
  Rare: { label: "Rare", textClass: "text-sky-500 dark:text-sky-400", bgClass: "bg-sky-100 dark:bg-sky-900/40" },
  Legendary: { label: "Légendaire", textClass: "text-amber-500 dark:text-simpson-yellow", bgClass: "bg-amber-100 dark:bg-amber-900/40" },
};

interface BoosterDetailModalProps {
  booster: ShopBooster | null;
  onClose: () => void;
}

export default function BoosterDetailModal({ booster, onClose }: BoosterDetailModalProps) {
  return (
    <Modal isOpen={!!booster} onClose={onClose}>
      <div className="flex flex-col gap-5 p-5 pt-8 font-main text-simpson-dark dark:text-simpson-white w-72 sm:w-80 max-w-full">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-simpson-orange dark:text-simpson-yellow leading-tight">{booster?.name}</h2>
          <p className="text-xs text-simpson-gray">
            Contient {booster?.quantity || 5} carte{(booster?.quantity || 5) > 1 ? "s" : ""} • Taux d'obtention
          </p>
        </div>

        <div className="bg-simpson-gray/5 dark:bg-black/20 rounded-xl p-4 border border-simpson-gray/10 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-simpson-gray/10 dark:border-white/10 text-simpson-gray">
            <span>Rareté</span>
            <span className="flex items-center gap-1"><FaPercentage /> Probabilité</span>
          </div>
          {booster?.probabilities && booster.probabilities.length > 0 ? (
            booster.probabilities.map((prob, index) => {
              const style = rarityStyles[prob.rarity] || { label: prob.rarity, textClass: "text-simpson-dark dark:text-white", bgClass: "bg-simpson-gray/10" };
              return (
                <div key={index} className="flex items-center justify-between text-xs font-bold gap-6">
                  <span className={style.textClass}>{style.label}</span>
                  <span className={`${style.bgClass} px-2 py-0.5 rounded-md shrink-0`}>{prob.value.toFixed(1)}%</span>
                </div>
              );
            })
          ) : (
            <p className="text-center text-xs text-simpson-gray py-2">Aucune donnée de probabilité disponible.</p>
          )}
        </div>

        <div className="text-[11px] text-simpson-gray/80 text-center leading-relaxed px-1">
          Chaque booster contient un ensemble de cartes distribuées aléatoirement selon les taux indiqués ci-dessus.
        </div>

        <Button onClick={onClose} className="w-full py-2 text-xs font-bold rounded-xl bg-simpson-dark dark:bg-white dark:text-simpson-dark">
          Fermer
        </Button>
      </div>
    </Modal>
  );
}
