import React from "react";
import Link from "next/link"

function Footer() {

  return (
    <footer className="bg-black text-white flex justify-center gap-10 h-7.5">
    <Link href="/mentionsLegales">Mentions Légales</Link>
    <Link href="/donneesPerso">Données personnelles</Link>
    <Link href="/about">A propos</Link>

    </footer>
  );
}

export default Footer;