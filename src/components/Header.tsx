"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../public/logo.webp";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 🎯 Import du hook pour détecter la page active
import Modal from "@/components/ui/Modal";
import ProfileForm from "../features/profile/components/ProfileForm";
import { IoMdSettings } from "react-icons/io";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // 🎯 Évite les bugs d'hydratation Redux / SSR
  const pathname = usePathname(); // 🎯 Récupère l'URL courante (ex: "/boutique")

  const { token, pseudo, money } = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => setIsProfileOpen(false);

  // 🎯 Détermination dynamique du lien du logo (Fallback sur "/" pendant le SSR)
  const logoHref = mounted && token ? "/collection" : "/";

  // 🎯 Fonction utilitaire pour appliquer les classes actives/inactives
  const getLinkStyles = (path: string) => {
    const isActive = pathname === path;
    return {
      link: `relative py-2 transition-colors duration-200 group ${
        isActive
          ? "text-simpson-orange dark:text-simpson-yellow font-bold"
          : "hover:text-simpson-orange hover:dark:text-simpson-yellow text-text/80"
      }`,
      underline: `absolute bottom-0 left-1/2 h-0.5 bg-simpson-orange dark:bg-simpson-yellow transition-all duration-300 ease-out -translate-x-1/2 ${
        isActive ? "w-full" : "w-0 group-hover:w-full"
      }`,
    };
  };

  return (
    <>
      <header className="relative z-40 flex bg-white dark:bg-simpson-darklight shadow-md h-17.5 items-center px-6">
        {/* LOGO */}
        <div className="w-2/12 flex items-center">
          <Link
            href={logoHref}
            className="cursor-pointer inline-block transition-transform duration-200 active:scale-95"
          >
            <Image
              className="w-auto h-auto max-h-12.5 object-contain"
              loading="eager"
              src={logo}
              alt="logo"
              width={110}
              height={60}
              priority
            />
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="w-8/12 flex items-center justify-center gap-10 text-medium font-semibold">
          {mounted && !token && (
            <Link href="/" className={getLinkStyles("/").link}>
              Accueil
              <span className={getLinkStyles("/").underline} />
            </Link>
          )}

          <Link
            href="/collection"
            className={getLinkStyles("/collection").link}
          >
            Collection
            <span className={getLinkStyles("/collection").underline} />
          </Link>

          {mounted && token && (
            <Link href="/boutique" className={getLinkStyles("/boutique").link}>
              Boutique
              <span className={getLinkStyles("/boutique").underline} />
            </Link>
          )}

          <Link
            href="/regles-du-jeu"
            className={getLinkStyles("/regles-du-jeu").link}
          >
            Règles du jeu
            <span className={getLinkStyles("/regles-du-jeu").underline} />
          </Link>
        </nav>

        {/* ESPACE UTILISATEUR / ACTIONS */}
        <div className="w-2/12 flex justify-end items-center gap-4 min-h-16">
          {mounted && token && (
            <>
              <div className="flex flex-col items-end justify-center">
                <span className="font-semibold">{pseudo || "Pseudo"}</span>
                <div className="flex items-center gap-2">
                  <span className="text-medium font-semibold text-simpson-orange dark:text-simpson-yellow">
                    {money?.toLocaleString() || 0}
                  </span>
                  <Image
                    src="/donuts1.webp"
                    alt="Donut Icon"
                    width={128}
                    height={128}
                    className="w-5 h-5 object-contain image-render-auto select-none"
                    priority
                  />
                </div>
              </div>
              <div className="min-w-16 h-16 rounded-full overflow-hidden p-1">
                <Image
                  src="/defaultAvatar.webp"
                  alt="Avatar"
                  width={70}
                  height={70}
                  className="w-full h-full object-cover rounded-full scale-x-[-1]"
                />
              </div>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="text-text/60 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer transition-colors duration-200 outline-none"
              >
                <IoMdSettings size={22} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* MODAL PROFIL */}
      <Modal isOpen={isProfileOpen} onClose={handleClose}>
        <ProfileForm
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </Modal>
    </>
  );
}

export default Header;
