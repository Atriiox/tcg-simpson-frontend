import React from "react";
import HeaderUnsigned from "../../../components/HeaderUnsigned";
import Footer from "../../../components/Footer";
import Image from "next/image";
import welcomeImage from "../../../../public/simsponAccueil1.webp";
import spiderCochon from "../../../../public/spiderCochon1.webp";

function Home() {
  return (
    <div className="place-content-between">
      <HeaderUnsigned />

      <main>
        <div className="flex justify-end">
        <Image src={spiderCochon} alt="SpiderCochon" />
        </div>
        <div className=" flex flex-col items-center">
        <Image src={welcomeImage} alt="WelcomeImage" height={573} width={539} />
        <button>Se connecter</button>
        <button>Pas encore de compte ? S'inscrire</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
