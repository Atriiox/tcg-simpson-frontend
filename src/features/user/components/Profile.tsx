"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes"; // 👈 Import de next-themes
import { useProfile } from "../hooks/useProfile";

interface ProfileProps {
  userId: string;
}

export default function Profile({ userId }: ProfileProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 absolute top-4 right-4" />;
  }

  return (
    <div className="bg-white dark:bg-simpson-darklight p-6 rounded-2xl border-2 border-simpson-dark shadow-[4px_4px_0px_0px_rgba(38,43,51,1)] max-w-sm relative">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-4 right-4 p-2 rounded-xl border-2 border-simpson-dark bg-amber-400 dark:bg-slate-700 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-[2px_2px_0px_0px_rgba(38,43,51,1)]"
        aria-label="Changer de thème"
      >
        {theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 text-amber-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M17.78 6.22l1.58-1.58M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 text-simpson-dark"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
        )}
      </button>

      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full border-2 border-simpson-dark overflow-hidden bg-simpson-gray">
          <img
            src="/homerMoney1.webp"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center">
          <h2 className="text-title text-simpson-dark dark:text-white">Name</h2>
        </div>
      </div>
    </div>
  );
}
