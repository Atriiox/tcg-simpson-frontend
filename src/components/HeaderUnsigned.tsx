import React from "react";
import Image from "next/image";
import logo from "../../public/logo.webp";
import Link from "next/link";

function HeaderUnsigned() {
  return (
    <header className="flex bg-white shadow-lg h-17.5 items-center">
      <div className="w-2/12">
        <Image src={logo} alt="logo" width={110} height={60} />
      </div>
      <div className="w-8/12 flex items-center justify-center gap-10 text-subtitle">
        <Link href="/">Accueil</Link>
        <Link href="/collection">Collection</Link>
        <Link href="/gameRules">Règles du jeu</Link>
      </div>
      <div className="w-2/12">

      </div>
    </header>
  );
}

export default HeaderUnsigned;
