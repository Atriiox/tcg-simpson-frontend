"use client";

import { FaPlusCircle } from "react-icons/fa";

interface ShopHeaderProps {
  onOpenMoneyModal: () => void;
}

export default function ShopHeader({ onOpenMoneyModal }: ShopHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-simpson-gray/10 dark:border-white/10 pb-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-simpson-orange dark:text-simpson-yellow">Boutique</h1>
        <h2 className="text-sm font-medium text-simpson-gray mt-1">Échange tes donuts contre des boosters !</h2>
      </div>
      <button
        onClick={onOpenMoneyModal}
        className="flex items-center gap-2 px-5 py-2.5 bg-simpson-blue hover:bg-simpson-blue/90 text-white rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer h-10"
      >
        <FaPlusCircle size={16} />
        Acheter des donuts
      </button>
    </div>
  );
}
