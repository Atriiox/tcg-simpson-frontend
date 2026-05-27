"use client";

import Link from "next/link";
import { IoMdSettings } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useDailyDonuts } from "@/features/shop/hooks/useDailyDonuts";

interface HeaderMobileMenuProps {
  token: string | null;
  onClose: () => void;
  onOpenProfile: () => void;
  getLinkStyles: (path: string) => { mobileLink: string };
}

export default function HeaderMobileMenu({
  token,
  onClose,
  onOpenProfile,
  getLinkStyles,
}: HeaderMobileMenuProps) {
  const pathname = usePathname();

  const { isReady: canClaimDaily, isMounted } = useDailyDonuts();

  return (
    <div className="absolute top-17.5 left-0 w-full bg-white dark:bg-simpson-darklight shadow-xl border-t border-simpson-gray/5 dark:border-white/5 flex flex-col md:hidden z-40 animate-fade-in">
      <nav className="flex flex-col w-full">
        {!token && (
          <Link href="/" onClick={onClose} className={getLinkStyles("/").mobileLink}>
            <span>Accueil</span>
            {pathname === "/" && <span className="text-simpson-orange dark:text-simpson-yellow">●</span>}
          </Link>
        )}

        <Link href="/collection" onClick={onClose} className={getLinkStyles("/collection").mobileLink}>
          <span>Collection</span>
          {pathname === "/collection" && <span className="text-simpson-orange dark:text-simpson-yellow">●</span>}
        </Link>

        {token && (
          <>
            <Link href="/boutique" onClick={onClose} className={getLinkStyles("/boutique").mobileLink}>
              <div className="flex items-center gap-1.5">
                <span>Boutique</span>

                {/* On n'affiche la pastille que si le bonus est disponible et le composant monté */}
                {canClaimDaily && isMounted && (
                  <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>

              {pathname === "/boutique" && <span className="text-simpson-orange dark:text-simpson-yellow">●</span>}
            </Link>


            <Link href="/amis" onClick={onClose} className={getLinkStyles("/amis").mobileLink}>
              <span>Amis</span>
              {pathname === "/amis" && <span className="text-simpson-orange dark:text-simpson-yellow">●</span>}
            </Link>
          </>
        )}

        <Link href="/regles-du-jeu" onClick={onClose} className={getLinkStyles("/regles-du-jeu").mobileLink}>
          <span>Règles du jeu</span>
          {pathname === "/regles-du-jeu" && <span className="text-simpson-orange dark:text-simpson-yellow">●</span>}
        </Link>

        {token && (
          <button
            onClick={() => { onClose(); onOpenProfile(); }}
            className="w-full py-3.5 px-6 text-sm font-bold uppercase border-b border-simpson-gray/5 dark:border-white/5 flex items-center justify-between text-text/80 hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer text-left transition-colors"
          >
            <span>Options</span>
            <IoMdSettings size={18} className="text-simpson-gray" />
          </button>
        )}
      </nav>
    </div>
  );
}