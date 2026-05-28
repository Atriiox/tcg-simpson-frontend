"use client";

import Image from "next/image";
import { useState } from "react";
import { useAvatar } from "../hooks/useAvatar";
import { validAvatars } from "../schemas/profile.schemas";
import Button from "@/components/ui/Button";

interface AvatarPickerProps {
  currentAvatar: string | null;
  onClose: () => void;
}

export default function AvatarPicker({ currentAvatar, onClose }: AvatarPickerProps) {
  const { updateAvatar, isLoading } = useAvatar();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar);

  const handleConfirm = async () => {
    if (!selectedAvatar || selectedAvatar === currentAvatar) {
      onClose();
      return;
    }
    const result = await updateAvatar(selectedAvatar);
    if (result.ok) onClose();
  };

  return (
    <div className="flex flex-col gap-5 p-5 pt-8 font-main text-simpson-dark dark:text-simpson-white w-full max-w-md">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-simpson-orange dark:text-simpson-yellow">Choisir un avatar</h2>
        <p className="text-xs text-simpson-gray">Sélectionne ton personnage Simpson préféré</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {validAvatars.map((avatar) => {
          const isSelected = selectedAvatar === avatar;
          return (
            <button
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer w-16 h-16 mx-auto ${
                isSelected
                  ? "border-simpson-orange dark:border-simpson-yellow scale-105 shadow-lg"
                  : "border-transparent hover:border-simpson-gray/30"
              }`}
            >
              <Image
                src={avatar}
                alt="Avatar"
                width={64}
                height={64}
                className="w-full h-full object-contain p-1"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-simpson-orange/10 dark:bg-simpson-yellow/10 rounded-xl" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-2">
        <Button
          onClick={onClose}
          className="flex-1 py-2 text-xs bg-transparent border border-simpson-gray/20 dark:border-white/10 text-simpson-gray! hover:bg-simpson-gray/5 shadow-none"
        >
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading || !selectedAvatar}
          className="flex-1 py-2 text-xs bg-simpson-orange hover:bg-simpson-orange/90 text-white"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            "Confirmer"
          )}
        </Button>
      </div>
    </div>
  );
}