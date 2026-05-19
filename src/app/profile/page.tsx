"use client";

import { useState } from "react";
import Profile from "../../features/user/components/Profile";

export default function ProfilePage() {
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const mockUserId = "simpson-fan-123";

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
      <button 
        onClick={() => setIsProfileOpen(true)}
        className="px-4 py-2 bg-simpson-lightblue text-white rounded-lg font-medium"
      >
        Ouvrir mon compte
      </button>

      {isProfileOpen && (
        <Profile userId={mockUserId} onClose={() => setIsProfileOpen(false)} />
      )}
    </main>
  );
}