"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../public/logo.webp";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Modal from "@/components/ui/Modal";
import ProfileForm from "../features/profile/components/ProfileForm";
import { IoMdSettings } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { token, pseudo, money } = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = () => setIsProfileOpen(false);

  const logoHref = mounted && token ? "/collection" : "/";

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
      mobileLink: `w-full py-3.5 px-6 text-sm font-bold uppercase border-b border-simpson-gray/5 dark:border-white/5 flex items-center justify-between transition-colors ${
        isActive
          ? "text-simpson-orange dark:text-simpson-yellow bg-simpson-gray/5 dark:bg-white/5"
          : "text-text/80 hover:text-simpson-orange dark:hover:text-simpson-yellow"
      }`,
    };
  };

  return (
    <>
      <header className="relative z-40 bg-white dark:bg-simpson-darklight shadow-md h-17.5 flex items-center px-1 md:px-6 select-none">
        
        {/* 📱 INTERFACE MOBILE (< md) */}
        {/* 🎯 Utilisation d'une grille adaptative pour redonner de l'espace aux extrémités */}
        <div className="grid grid-cols-[1fr_auto_1fr] w-full h-full items-center md:hidden">
          {/* GAUCHE : Menu Burger */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-text/80 hover:text-simpson-orange dark:hover:text-simpson-yellow hover:bg-simpson-gray/10 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer outline-none"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* CENTRE : Logo (Reste parfaitement centré) */}
          <div className="flex items-center justify-center px-2">
            <Link
              href={logoHref}
              onClick={() => setIsMenuOpen(false)}
              className="cursor-pointer inline-block transition-transform duration-200 active:scale-95"
            >
              <Image
                className="w-auto h-auto max-h-12 object-contain"
                loading="eager"
                src={logo}
                alt="logo"
                width={105}
                height={52}
                priority
              />
            </Link>
          </div>

          {/* DROITE : Espace Profil */}
          <div className="flex items-center justify-end gap-1">
            {mounted && token && (
              <>
                <div className="flex flex-col items-end justify-center">
                  <span className="font-semibold text-sm text-text whitespace-nowrap">
                    {pseudo || "Pseudo"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-simpson-orange dark:text-simpson-yellow">
                      {money?.toLocaleString() || 0}
                    </span>
                    <Image
                      src="/donuts1.webp"
                      alt="Donut Icon"
                      width={20}
                      height={20}
                      className="w-4.5 h-4.5 object-contain select-none"
                      priority
                    />
                  </div>
                </div>
                <div className="w-11 h-11 rounded-full overflow-hidden p-0.5 shrink-0">
                  <Image
                    src="/defaultAvatar.webp"
                    alt="Avatar"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover rounded-full scale-x-[-1]"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 💻 INTERFACE DESKTOP (>= md) */}
        <div className="hidden md:flex w-full items-center h-full">
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
              <>
                <Link
                  href="/boutique"
                  className={getLinkStyles("/boutique").link}
                >
                  Boutique
                  <span className={getLinkStyles("/boutique").underline} />
                </Link>

                <Link href="/amis" className={getLinkStyles("/amis").link}>
                  Amis
                  <span className={getLinkStyles("/amis").underline} />
                </Link>
              </>
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
        </div>
      </header>

      {/* 🍔 MENU DÉROULANT MOBILE */}
      {isMenuOpen && (
        <div className="absolute top-17.5 left-0 w-full bg-white dark:bg-simpson-darklight shadow-xl border-t border-simpson-gray/5 dark:border-white/5 flex flex-col md:hidden z-40 animate-fade-in">
          <nav className="flex flex-col w-full">
            {mounted && !token && (
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={getLinkStyles("/").mobileLink}
              >
                <span>Accueil</span>
                {pathname === "/" && (
                  <span className="text-simpson-orange dark:text-simpson-yellow">
                    ●
                  </span>
                )}
              </Link>
            )}

            <Link
              href="/collection"
              onClick={() => setIsMenuOpen(false)}
              className={getLinkStyles("/collection").mobileLink}
            >
              <span>Collection</span>
              {pathname === "/collection" && (
                <span className="text-simpson-orange dark:text-simpson-yellow">
                  ●
                </span>
              )}
            </Link>

            {mounted && token && (
              <>
                <Link
                  href="/boutique"
                  onClick={() => setIsMenuOpen(false)}
                  className={getLinkStyles("/boutique").mobileLink}
                >
                  <span>Boutique</span>
                  {pathname === "/boutique" && (
                    <span className="text-simpson-orange dark:text-simpson-yellow">
                      ●
                    </span>
                  )}
                </Link>

                <Link
                  href="/amis"
                  onClick={() => setIsMenuOpen(false)}
                  className={getLinkStyles("/amis").mobileLink}
                >
                  <span>Amis</span>
                  {pathname === "/amis" && (
                    <span className="text-simpson-orange dark:text-simpson-yellow">
                      ●
                    </span>
                  )}
                </Link>
              </>
            )}

            <Link
              href="/regles-du-jeu"
              onClick={() => setIsMenuOpen(false)}
              className={getLinkStyles("/regles-du-jeu").mobileLink}
            >
              <span>Règles du jeu</span>
              {pathname === "/regles-du-jeu" && (
                <span className="text-simpson-orange dark:text-simpson-yellow">
                  ●
                </span>
              )}
            </Link>

            {/* 🎯 ENGRENAGE DÉPLACÉ EN ONGLET LIEN MOBILE "OPTIONS" */}
            {mounted && token && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsProfileOpen(true);
                }}
                className="w-full py-3.5 px-6 text-sm font-bold uppercase border-b border-simpson-gray/5 dark:border-white/5 flex items-center justify-between text-text/80 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer text-left transition-colors"
              >
                <span>Options</span>
                <IoMdSettings size={18} className="text-simpson-gray" />
              </button>
            )}
          </nav>
        </div>
      )}

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