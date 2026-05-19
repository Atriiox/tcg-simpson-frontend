import React from "react";
import Image from "next/image";
import logo from "../../public/Logo1.webp";
import Link from "next/link"


function HeaderUnsigned() {
  return (
    <header className="flex gap-150 bg-white shadow-lg h-17.5 items-center">
      <Image src={logo} alt="logo" />
      <div className="flex gap-10 text-subtitle">
        <Link href="/">Accueil</Link>
        <Link href="/collection">Collection</Link>
        <Link href="/gameRules">Règles du jeu</Link>
      </div>
    </header>
  );
}

export default HeaderUnsigned;
