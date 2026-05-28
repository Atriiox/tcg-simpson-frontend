"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Modal from "@/components/ui/Modal";
import ProfileForm from "../features/profile/components/Profile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useHeaderMoney } from "./header/useHeaderMoney";
import HeaderMobile from "./header/HeaderMobile";
import HeaderDesktop from "./header/HeaderDesktop";
import HeaderMobileMenu from "./header/HeaderMobileMenu";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { token, pseudo, money, avatar } = useSelector((state: RootState) => state.user);
  const { displayedMoney } = useHeaderMoney(money, mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        {mounted && (
          <>
            <HeaderMobile
              logoHref={logoHref}
              token={token}
              pseudo={pseudo}
              displayedMoney={displayedMoney}
              avatar={avatar}
              isMenuOpen={isMenuOpen}
              onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            />
            <HeaderDesktop
              logoHref={logoHref}
              token={token}
              pseudo={pseudo}
              displayedMoney={displayedMoney}
              avatar={avatar}
              onOpenProfile={() => setIsProfileOpen(true)}
              getLinkStyles={getLinkStyles}
            />
          </>
        )}
      </header>

      {isMenuOpen && mounted && (
        <HeaderMobileMenu
          token={token}
          onClose={() => setIsMenuOpen(false)}
          onOpenProfile={() => setIsProfileOpen(true)}
          getLinkStyles={getLinkStyles}
        />
      )}

      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
        <ProfileForm
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </Modal>
    </>
  );
}

export default Header;