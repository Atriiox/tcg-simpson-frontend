import React from "react";
import Image from "next/image";
import logo from "../../public/logo.webp";
import Link from "next/link";

function Header() {
  return (
    <header className="flex bg-white shadow-md h-17.5 items-center px-6">
      {/* LOGO */}
      <div className="w-2/12 flex items-center">
        <Image
          className="w-auto h-auto max-h-12.5 object-contain"
          loading="eager"
          src={logo}
          alt="logo"
          width={110}
          height={60}
          priority
        />
      </div>

      {/* MENU DE NAVIGATION */}
      <nav className="w-8/12 flex items-center justify-center gap-10 text-medium font-semibold text-text/80">
        <Link
          href="/"
          className="relative py-2 transition-colors duration-200 hover:text-simpson-orange group"
        >
          Accueil

          <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-simpson-orange transition-all duration-300 ease-out -translate-x-1/2 group-hover:w-full" />
        </Link>

        <Link
          href="/collection"
          className="relative py-2 transition-colors duration-200 hover:text-simpson-orange group"
        >
          Collection
          <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-simpson-orange transition-all duration-300 ease-out -translate-x-1/2 group-hover:w-full" />
        </Link>

        <Link
          href="/regles-du-jeu"
          className="relative py-2 transition-colors duration-200 hover:text-simpson-orange group"
        >
          Règles du jeu
          <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-simpson-orange transition-all duration-300 ease-out -translate-x-1/2 group-hover:w-full" />
        </Link>
      </nav>
      <div className="w-2/12 flex justify-end"></div>
    </header>
  );
}

export default Header;
