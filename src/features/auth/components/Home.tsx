import React from "react";
import Image from "next/image";

function Home() {
  return (
    <main className="h-(--size-screen-content) relative overflow-hidden flex flex-col items-center">
      <div className="absolute right-16 top-0">
        <Image
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
            src="/welcomeSimpson.webp"
            alt="WelcomeImage"
            height={370}
            width={375}
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
  );
}

export default Home;
