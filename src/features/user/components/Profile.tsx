"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaUser, FaEnvelope, FaLock, FaTimes } from "react-icons/fa";
import Image from "next/image";

interface ProfileProps {
  userId: string;
  onClose: () => void;
}

export default function Profile({ userId, onClose }: ProfileProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 🎯 États pour le Pseudo
  const [confirmedUsername, setConfirmedUsername] = useState("HomerFan99");
  const [tempUsername, setTempUsername] = useState("HomerFan99");
  const isEditingUsername = tempUsername !== confirmedUsername;

  // 🎯 États pour le Mot de passe
  const [password, setPassword] = useState("supersecretpassword");
  const [oldPassword, setOldPassword] = useState("supersecretpassword");
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  // Actions Pseudo
  const handleSaveUsername = () => {
    if (tempUsername.trim() !== "") {
      setConfirmedUsername(tempUsername.trim());
    } else {
      setTempUsername(confirmedUsername);
    }
  };

  const handleCancelUsername = () => {
    setTempUsername(confirmedUsername);
  };

  // Actions Mot de passe
  const handleStartEditPassword = () => {
    setOldPassword(password);
    setPassword("");
    setIsEditingPassword(true);
  };

  const handleSavePassword = () => {
    if (password.trim() === "") {
      setPassword(oldPassword);
    }
    setIsEditingPassword(false);
  };

  const handleCancelPassword = () => {
    setPassword(oldPassword);
    setIsEditingPassword(false);
  };

  return (
    /* 🎯 BACKDROP */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-simpson-dark/40 backdrop-blur-sm animate-fade-in">
      {/* CONTAINER MODALE */}
      <div className="relative w-full max-w-md bg-background text-text p-8 rounded-2xl shadow-xl transition-all duration-300 flex flex-col gap-4 text-left border border-simpson-gray dark:border-simpson-dark">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text/40 hover:text-text transition-colors rounded-full hover:bg-simpson-light dark:hover:bg-simpson-darklight cursor-pointer"
          aria-label="Fermer la modale"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* HEADER : AVATAR & SOLDE */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-full border border-simpson-gray dark:border-simpson-dark overflow-hidden bg-simpson-light p-1">
            <img
              src="/homerMoney1.webp"
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-title font-bold">{confirmedUsername}</h2>
            <div className="flex items-center gap-2">
              <span className="text-medium font-semibold text-simpson-dark dark:text-simpson-yellow">
                1,250
              </span>
              <Image
                src="/donuts.webp"
                alt="Donut Icon"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* INPUT 1 : PSEUDO */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-body font-medium">Nom d'utilisateur</label>
            {isEditingUsername && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelUsername}
                  className="text-xs font-semibold text-text/50 hover:underline cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveUsername}
                  className="text-xs font-semibold text-simpson-lightblue hover:underline cursor-pointer"
                >
                  Valider
                </button>
              </div>
            )}
          </div>

          <div className="h-12 border border-simpson-gray dark:border-simpson-dark focus-within:border-simpson-lightblue focus-within:dark:border-simpson-lightblue rounded-xl flex items-center px-4 gap-3 transition-all bg-white dark:bg-simpson-darklight">
            <FaUser className="w-4 h-4 text-text/40 shrink-0" />
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveUsername()}
              className="w-full h-full border-none outline-none text-body text-text bg-transparent font-medium focus:ring-0 focus:bg-transparent"
              placeholder="Choisis un pseudo"
            />
          </div>
        </div>

        {/* INPUT 2 : EMAIL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-body font-medium">Email</label>
          <div className="h-12 border border-simpson-gray dark:border-simpson-dark rounded-xl flex items-center px-4 gap-3 bg-white/60 dark:bg-simpson-darklight/60 opacity-60 cursor-not-allowed select-none">
            <FaEnvelope className="w-4 h-4 text-text/30 shrink-0" />
            <input
              type="text"
              value="homer.simpson@springfield.com"
              readOnly
              className="w-full h-full border-none outline-none text-body text-text/70 bg-transparent font-medium cursor-not-allowed"
            />
          </div>
        </div>

        {/* INPUT 3 : MOT DE PASSE */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-body font-medium">Mot de passe</label>
            {isEditingPassword ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelPassword}
                  className="text-xs font-semibold text-text/50 hover:underline cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSavePassword}
                  className="text-xs font-semibold text-simpson-lightblue hover:underline cursor-pointer"
                >
                  Valider
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartEditPassword}
                className="text-body font-semibold text-simpson-lightblue hover:underline cursor-pointer"
              >
                Modifier
              </button>
            )}
          </div>
          <div className="h-12 border border-simpson-gray dark:border-simpson-dark focus-within:border-simpson-lightblue focus-within:dark:border-simpson-lightblue rounded-xl flex items-center px-4 gap-3 transition-all bg-white dark:bg-simpson-darklight">
            <FaLock className="w-4 h-4 text-text/40 shrink-0" />
            <input
              type={isEditingPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSavePassword()}
              readOnly={!isEditingPassword}
              className={`w-full h-full border-none outline-none text-body bg-transparent focus:ring-0 focus:bg-transparent ${
                isEditingPassword
                  ? "text-text font-medium"
                  : "text-text/50 tracking-widest font-mono"
              }`}
              placeholder={isEditingPassword ? "Nouveau mot de passe" : ""}
            />
          </div>
        </div>


        <div className="flex justify-between items-center mt-4 pt-4 border-t border-simpson-dark dark:border-simpson-gray">
          <span className="text-body font-medium">Theme dark :</span>

          <div className="flex items-center justify-center">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="group relative w-14 h-7 rounded-full p-0.5 transition-all duration-300 outline-none cursor-pointer bg-[#252532] border border-[#32303e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
              aria-label="Changer de thème"
            >
              {/* Conteneur Flex pour garantir un centrage vertical parfait de tous les éléments */}
              <div className="relative w-full h-full flex items-center justify-between px-1">
                {/* Le bouton poussoir mécanique ultra-compact */}
                <div
                  className={`w-5 h-5 rounded-full bg-linear-to-b from-[#3b3a4e] to-[#272733] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 z-10 ${
                    isDark ? "translate-x-6" : "translate-x-0"
                  }`}
                />

                {/* L'indicateur LED parfaitement aligné au centre vertical */}
                <div
                  className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                    isDark
                      ? "border-[#60d480] bg-[#60d480]/20 shadow-[0_0_5px_#60d480] -translate-x-6"
                      : "border-[#ef565f] bg-[#ef565f]/20 shadow-[0_0_5px_#ef565f] translate-x-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
