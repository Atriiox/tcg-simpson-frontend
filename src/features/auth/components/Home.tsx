"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import RegisterForm from "./RegisterForm";
import ConnectForm from "./ConnectForm";

type ModalMode = "connect" | "register" | null;

function Home() {
  const [modal, setModal] = useState<ModalMode>(null);

  return (
    <>
      {/* 1. Remplacement de flex-col par justify-center pour centrer verticalement le contenu principal */}
      <div className="min-h-(--size-screen-content) h-full w-full relative overflow-hidden flex items-center justify-center">
        <div className="absolute right-16 top-0 flex items-center justify-center">
          <Image
            className="w-auto h-auto"
            src="/spiderCochon.webp"
            width={110}
            height={79}
            alt="SpiderCochon"
            loading="eager"
          />
        </div>

        {/* 2. Optimisation du conteneur central : il prend toute la hauteur disponible (sans taille fixe) */}
        <div className="w-full max-w-md h-full flex flex-col items-center justify-center p-6 gap-6">

          {/* 3. L'image grandit de manière flexible grâce à flex-1 et max-h-[50vh] pour ne pas écraser les boutons */}
          <div className="flex-1 w-full max-h-[50vh] flex items-center justify-center">
            <Image
              className="w-full h-full object-contain" // 💡 object-contain évite que l'image soit rognée/déformée
              src="/welcomeSimpson.webp"
              alt="WelcomeImage"
              height={375}
              width={370}
              loading="eager"
            />
          </div>

          {/* 4. Bloc boutons ajusté */}
          <div className="flex flex-col gap-4 w-full max-w-xs items-center shrink-0">
            <Button onClick={() => setModal('connect')} className="w-full">Se connecter</Button>
            <button
              className="cursor-pointer border-b border-text/60 text-sm pb-0.5 hover:text-simpson-orange dark:hover:text-simpson-jaune transition-colors duration-200"
              onClick={() => setModal("register")}
            >
              Pas encore de compte ? S'inscrire
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={modal !== null} onClose={() => setModal(null)}>
        {modal === "register" && (
          <RegisterForm onSwitch={() => setModal("connect")} />
        )}

        {modal === 'connect' && (
          <ConnectForm onSwitch={() => setModal('register')} />
        )}
      </Modal>
    </>
  );
}

export default Home;