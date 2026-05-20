"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal"; // 💡 Ajuste le chemin selon ton architecture
import ProfileForm from "../../features/profile/components/ProfileForm";

export default function ProfilePage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleClose = () => setIsProfileOpen(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
      <button
        onClick={() => setIsProfileOpen(true)}
        className="px-4 py-2 bg-simpson-lightblue text-white rounded-lg font-medium cursor-pointer hover:opacity-90 transition-opacity"
      >
        Ouvrir mon compte
      </button>

      {/* 🎯 Utilisation de la Modal UI réutilisable qui gère les transitions Headless UI */}
      <Modal isOpen={isProfileOpen} onClose={handleClose}>
        <ProfileForm isOpen={isProfileOpen} />
      </Modal>
    </main>
  );
}