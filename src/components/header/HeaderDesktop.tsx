"use client";

import Image from "next/image";
import Link from "next/link";
import { IoMdSettings } from "react-icons/io";
import logo from "../../../public/logo.webp";

interface HeaderDesktopProps {
  logoHref: string;
  token: string | null;
  pseudo: string | null;
  displayedMoney: number;
  onOpenProfile: () => void;
  getLinkStyles: (path: string) => { link: string; underline: string };
}

export default function HeaderDesktop({
  logoHref,
  token,
  pseudo,
  displayedMoney,
  onOpenProfile,
  getLinkStyles,
}: HeaderDesktopProps) {
  return (
    <div className="hidden md:flex w-full items-center h-full">
      <div className="w-2/12 flex items-center">
        <Link href={logoHref} className="cursor-pointer inline-block transition-transform duration-200 active:scale-95">
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

      <nav className="w-8/12 flex items-center justify-center gap-10 text-medium font-semibold">
        {!token && (
          <Link href="/" className={getLinkStyles("/").link}>
            Accueil
            <span className={getLinkStyles("/").underline} />
          </Link>
        )}

        <Link href="/collection" className={getLinkStyles("/collection").link}>
          Collection
          <span className={getLinkStyles("/collection").underline} />
        </Link>

        {token && (
          <>
            <Link href="/boutique" className={getLinkStyles("/boutique").link}>
              Boutique
              <span className={getLinkStyles("/boutique").underline} />
            </Link>
            <Link href="/amis" className={getLinkStyles("/amis").link}>
              Amis
              <span className={getLinkStyles("/amis").underline} />
            </Link>
          </>
        )}

        <Link href="/regles-du-jeu" className={getLinkStyles("/regles-du-jeu").link}>
          Règles du jeu
          <span className={getLinkStyles("/regles-du-jeu").underline} />
        </Link>
      </nav>

      <div className="w-2/12 flex justify-end items-center gap-4 min-h-16">
        {token && (
          <>
            <div className="flex flex-col items-end justify-center">
              <span className="font-semibold">{pseudo || "Pseudo"}</span>
              <div className="flex items-center gap-2">
                <span className="text-medium font-semibold text-simpson-orange dark:text-simpson-yellow">
                  {displayedMoney.toLocaleString()}
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
              onClick={onOpenProfile}
              className="text-text/60 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer transition-colors duration-200 outline-none"
            >
              <IoMdSettings size={22} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}