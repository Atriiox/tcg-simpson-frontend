"use client";

import Image from "next/image";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import Modal from "@/components/ui/Modal";
import AvatarPicker from "./AvatarPicker";

interface ProfileHeaderProps {
  pseudo: string | null;
  email: string | null;
  money: number | null;
  avatar: string | null;
  isLoading: boolean;
}

export default function ProfileHeader({ pseudo, money, avatar, isLoading }: ProfileHeaderProps) {
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-5 pb-2">
        <button
          onClick={() => setIsAvatarPickerOpen(true)}
          className="relative w-16 h-16 rounded-full shrink-0 group cursor-pointer"
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            <Image
              src={avatar || "/defaultAvatar.webp"}
              alt="Avatar"
              width={72}
              height={72}
              className="w-full h-full object-contain rounded-full transition-opacity group-hover:opacity-70"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-simpson-orange dark:bg-simpson-yellow rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-simpson-darklight">
            <FaPencilAlt className="w-2.5 h-2.5 text-white dark:text-simpson-dark" />
          </div>
        </button>

        <div className="flex flex-col min-w-0">
          <span className="text-xl font-black tracking-tight truncate">
            {isLoading && !pseudo ? "Chargement..." : pseudo || "Joueur"}
          </span>
          <div className="flex items-center gap-2 mt-1.5 bg-black/5 dark:bg-white/8 px-3 py-1 rounded-full w-fit">
            <span className="text-sm font-black text-simpson-orange dark:text-simpson-yellow">
              {isLoading && !money ? "..." : money?.toLocaleString() || 0}
            </span>
            <Image
              src="/donuts1.webp"
              alt="Donut"
              width={20}
              height={20}
              className="object-contain w-5 h-5 shrink-0"
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isAvatarPickerOpen} onClose={() => setIsAvatarPickerOpen(false)}>
        <AvatarPicker
          currentAvatar={avatar}
          onClose={() => setIsAvatarPickerOpen(false)}
        />
      </Modal>
    </>
  );
}