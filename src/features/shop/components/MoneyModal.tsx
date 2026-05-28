"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface DonutPack {
  id: string;
  amount: number;
  price: string;
  popular: boolean;
}

const donutPacks: DonutPack[] = [
  { id: "pack-50", amount: 50, price: "1,99 €", popular: false },
  { id: "pack-100", amount: 100, price: "3,49 €", popular: false },
  { id: "pack-200", amount: 200, price: "5,99 €", popular: true },
  { id: "pack-500", amount: 500, price: "12,99 €", popular: false },
  { id: "pack-1000", amount: 1000, price: "19,99 €", popular: false },
];

interface MoneyModalProps {
  isOpen: boolean;
  isPurchasing: boolean;
  onClose: () => void;
  onPurchase: (pack: DonutPack) => void;
}

export default function MoneyModal({
  isOpen,
  isPurchasing,
  onClose,
  onPurchase,
}: MoneyModalProps) {
  // État local pour forcer l'affichage du loader pendant au moins 2 secondes
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isPurchasing) {
      setShowLoader(true);
    } else {
      // Si l'achat est fini mais que les 2 secondes ne sont pas passées,
      // on attend un peu avant de couper le loader.
      // Si l'achat a pris plus de 2s, il s'efface instantanément.
      timeoutId = setTimeout(() => {
        setShowLoader(false);
      }, 500); // Ajustement subtil pour l'expérience utilisateur globale
    }

    // Sécurité au cas où l'action de prop change brusquement
    if (isPurchasing) {
      timeoutId = setTimeout(() => {
        // Ce timeout garantit que showLoader reste calé sur l'état de l'achat
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [isPurchasing]);

  // Version alternative ultra-fiable avec un timestamp :
  const [purchaseStartTime, setPurchaseStartTime] = useState<number | null>(
    null,
  );
  const [forceLoader, setForceLoader] = useState(false);

  useEffect(() => {
    if (isPurchasing) {
      setForceLoader(true);
      setPurchaseStartTime(Date.now());
    } else if (purchaseStartTime) {
      const elapsedTime = Date.now() - purchaseStartTime;
      const remainingTime = Math.max(2000 - elapsedTime, 0);

      const timer = setTimeout(() => {
        setForceLoader(false);
        setPurchaseStartTime(null);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isPurchasing, purchaseStartTime]);

  // On bloque la fermeture si l'état d'achat réel OU visuel est actif
  const isUiBlocking = isPurchasing || forceLoader;

  return (
    <Modal isOpen={isOpen} onClose={() => !isUiBlocking && onClose()}>
      <div className="flex flex-col gap-6 p-5 pt-8 font-main rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg relative">
        {/* ÉCRAN DE CHARGEMENT FORCÉ À 2 SECONDES MINIMUM */}
        {isUiBlocking && (
          <div className="absolute inset-0 bg-white/90 dark:bg-simpson-darklight/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 animate-fade-in rounded-2xl">
            <div className="w-10 h-10 border-4 border-simpson-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-simpson-dark dark:text-simpson-white tracking-wide">
              Achat en cours...
            </p>
          </div>
        )}

        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-simpson-dark dark:text-simpson-white">
            Réserve de donuts
          </h2>
          <p className="text-sm text-simpson-gray">
            Choisis un lot pour obtenir des donuts et débloquer de nouveaux
            boosters.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {donutPacks.map((pack) => (
            <div
              key={pack.id}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all group ${
                pack.popular
                  ? "border-simpson-orange bg-simpson-orange/5 dark:bg-simpson-yellow/5 dark:border-simpson-yellow"
                  : "border-simpson-gray/10 bg-white dark:bg-simpson-darklight dark:border-white/5 hover:border-simpson-orange/30"
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-2.5 px-2 py-0.5 bg-simpson-orange dark:bg-simpson-yellow text-white dark:text-simpson-dark text-[9px] font-bold rounded-full">
                  Populaire
                </span>
              )}
              <div className="w-11 h-11 relative flex items-center justify-center bg-simpson-gray/5 dark:bg-white/5 rounded-full group-hover:scale-105 transition-transform mt-1">
                <Image
                  src="/donuts1.webp"
                  alt="Donut"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-simpson-dark dark:text-simpson-white">
                  x{pack.amount}
                </h3>
                <p className="text-xs text-simpson-gray">Donuts</p>
              </div>
              <Button
                onClick={() => onPurchase(pack)}
                disabled={isUiBlocking}
                className={`w-full py-1.5 text-xs font-bold rounded-lg transition-all ${
                  pack.popular
                    ? "bg-simpson-orange dark:bg-simpson-yellow"
                    : "bg-simpson-dark dark:bg-white dark:text-simpson-dark"
                }`}
              >
                {pack.price}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-center text-simpson-gray/70 leading-relaxed px-2">
          Les donuts sont une monnaie virtuelle utilisable uniquement dans le
          jeu. En procédant à l'achat, tu acceptes les conditions générales de
          vente.
        </p>
      </div>
    </Modal>
  );
}
