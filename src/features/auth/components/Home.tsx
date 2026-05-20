"use client"

import Image from "next/image";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {useState} from "react";
import RegisterForm from "./RegisterForm";
import ConnectForm from "./ConnectForm";

type ModalMode = 'connect' | 'register' | null;

function Home() {

  const [modal, setModal] = useState<ModalMode>(null);


  return (
    <>
    <main className="h-(--size-screen-content) relative overflow-hidden flex flex-col items-center">
      <div className="absolute right-16 top-0">
        <Image
          className="w-auto h-auto"
          src="/spiderCochon.webp"
          width={110}
          height={79}
          alt="SpiderCochon"
          loading="eager"
        />
      </div>
      <div className="w-fit h-fit flex flex-col items-center justify-center">
        <div className="">
          <Image
            className="w-auto h-auto"
            src="/welcomeSimpson.webp"
            alt="WelcomeImage"
            height={370}
            width={375}
            loading="eager"
          />
        </div>
        <div className="flex flex-col gap-7">
          <Button onClick={() => setModal('connect')}>Se connecter</Button>
          <button className="cursor-pointer border-b" onClick={() => setModal('register')}
>
            Pas encore de compte ? S'inscrire
          </button>
        </div>
      </div>
    </main>
     <Modal isOpen={modal !== null} onClose={() => setModal(null)}>
        {modal === 'register' && (
          <RegisterForm onSwitch={() => setModal('connect')} />
        )}

        {modal === 'connect' && (
          <ConnectForm onSwitch={() => setModal('register')} />
        )}

      </Modal>
      </>
  );
}

export default Home;
