"use client";

import { useState } from "react";
import Profile from "../../features/profile/components/Profile";

export default function ProfilePage() {
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const handleClose = () => {
    setIsProfileOpen(false);
  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
      <button
        onClick={() => setIsProfileOpen(true)}
        className="px-4 py-2 bg-simpson-lightblue text-white rounded-lg font-medium"
      >
        Ouvrir mon compte
      </button>

      <Profile isOpen={isProfileOpen} onClose={handleClose} userId="123" />
    </main>
  );
}
