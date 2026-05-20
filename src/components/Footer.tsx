import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-black text-white flex justify-center gap-10 h-7.5">
      <Link href="/mentions-legales">Mentions Légales</Link>
      <Link href="/donnees-personnelles">Données personnelles</Link>
      <Link href="/a-propos">A propos</Link>
    </footer>
  );
}

export default Footer;
