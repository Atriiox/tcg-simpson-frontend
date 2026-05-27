"use client";

import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../../public/logo.webp";

interface HeaderMobileProps {
  logoHref: string;
  token: string | null;
  pseudo: string | null;
  avatar: string | null;
  displayedMoney: number;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export default function HeaderMobile({
  logoHref,
  token,
  pseudo,
  avatar,
  displayedMoney,
  isMenuOpen,
  onToggleMenu,
}: HeaderMobileProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] w-full h-full items-center md:hidden">
      <div className="flex items-center justify-start">
        <button
          onClick={onToggleMenu}
          className="p-2 text-text/80 hover:text-simpson-orange dark:hover:text-simpson-yellow hover:bg-simpson-gray/10 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex items-center justify-center px-2">
        <Link
          href={logoHref}
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

      <div className="flex items-center justify-end gap-1">
        {token && (
          <>
            <div className="flex flex-col items-end justify-center">
              <span className="font-semibold text-sm text-text whitespace-nowrap">
                {pseudo || "Pseudo"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-simpson-orange dark:text-simpson-yellow">
                  {displayedMoney.toLocaleString()}
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
                src={avatar || "/defaultAvatar.webp"}
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
  );
}