"use client";

import Image from "next/image";

interface ProfileHeaderProps {
  pseudo: string | null;
  email: string | null;
  money: number | null;
  avatar: string | null;
  isLoading: boolean;
}

export default function ProfileHeader({ pseudo, email, money, avatar, isLoading }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-5 pb-2">
      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
        <Image
          src={avatar || "/defaultAvatar.webp"}
          alt="Avatar"
          width={72}
          height={72}
          className="w-full h-full object-contain rounded-full"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xl font-black tracking-tight truncate">
          {isLoading && !pseudo ? "Chargement..." : pseudo || "Joueur"}
        </span>
        <div className="flex items-center gap-2 mt-1.5 bg-black/5 dark:bg-white/8 px-3 py-1 rounded-full w-fit">
          <span className="text-sm font-black text-simpson-orange dark:text-simpson-yellow">
            {isLoading && !money ? "..." : money?.toLocaleString() || 0}
          </span>
          <Image src="/donuts1.webp" alt="Donut" width={20} height={20} className="object-contain w-5 h-5 shrink-0" />
        </div>
      </div>
    </div>
  );
}
