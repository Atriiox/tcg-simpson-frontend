import React from "react";
import HeaderUnsigned from "../../../components/HeaderUnsigned";
import Footer from "../../../components/Footer";
import Image from "next/image";

function Home() {
  return (
    <div>
      <HeaderUnsigned />

      <main className="h-(--size-screen-content)">
        <div className="flex justify-end">
          <Image
            src="/spiderCochon.webp"
            width={110}
            height={90}
            alt="SpiderCochon"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="">
            <Image
              src="/simsponAccueil1.webp"
              alt="WelcomeImage"
              height={573}
              width={539}
            />
          </div>

          <div className="flex flex-col gap-7">
            <button className="bg-simpson-orange rounded-md text-white px-5 h-10 cursor-pointer text-medium">
              Se connecter
            </button>
            <button className="cursor-pointer border-b">
              Pas encore de compte ? S'inscrire
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
