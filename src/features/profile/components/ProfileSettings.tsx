"use client";

import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/reducers/user";
import { RootState } from "@/store/store";

interface ProfileSettingsProps {
  onLogout: () => void;
}

export default function ProfileSettings({ onLogout }: ProfileSettingsProps) {
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.user.isDarkMode);

  return (
    <div className="flex flex-col gap-4">
      {/* THÈME */}
      <div className="flex justify-between items-center pt-2 px-0.5">
        <span className="text-xs font-bold text-black dark:text-white">Thème sombre</span>
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="group relative w-12 h-7 rounded-full p-0.5 transition-all duration-300 outline-none cursor-pointer bg-[#252532] border border-[#32303e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
          aria-label="Changer de thème"
        >
          <div className={`relative w-full h-full flex items-center justify-between ${isDark ? "pl-0 pr-1.5" : "pl-0.5 pr-1"}`}>
            <div className={`w-5 h-5 rounded-full bg-linear-to-b from-[#3b3a4e] to-[#272733] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 z-10 ${isDark ? "translate-x-5" : "translate-x-0"}`} />
            <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${isDark ? "border-simpson-lightblue bg-simpson-lightblue/20 shadow-[0_0_5px] shadow-simpson-lightblue -translate-x-5" : "border-simpson-orange bg-simpson-orange/20 shadow-[0_0_5px] shadow-simpson-orange translate-x-0"}`} />
          </div>
        </button>
      </div>

      {/* DÉCONNEXION */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full h-11 mt-4 flex items-center justify-center gap-2 text-red-500/90 hover:text-red-500 font-bold rounded-xl bg-red-500/4 hover:bg-red-500/8 border border-red-500/10 transition-all cursor-pointer text-xs tracking-wider"
      >
        <FaSignOutAlt className="w-3.5 h-3.5" />
        Se déconnecter
      </button>
    </div>
  );
}
