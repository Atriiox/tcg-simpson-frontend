import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-black text-white text-body text-xs flex justify-center gap-10 h-7.5">
      <Link
        className="flex items-center justify-center text-white/70 hover:text-white hover:underline transition-colors duration-200"
        href="/mentions-legales"
      >
        Mentions Légales
      </Link>
      <Link
        className="flex items-center justify-center text-white/70 hover:text-white hover:underline transition-colors duration-200"
        href="/donnees-personnelles"
      >
        Données personnelles
      </Link>
      <Link
        className="flex items-center justify-center text-white/70 hover:text-white hover:underline transition-colors duration-200"
        href="/a-propos"
      >
        A propos
      </Link>
    </footer>
  );
}

export default Footer;
