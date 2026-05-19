import React from "react";
import HeaderUnsigned from "../../../components/HeaderUnsigned";
import Footer from "../../../components/Footer";
import Image from "next/image";
import welcomeImage from "../../../../public/Logo1.webp";
import spiderCochon from "../../../../public/spiderCochon1.webp";

function Home() {
  return (
    <div>
      <HeaderUnsigned />

      <main>
        <Image src={spiderCochon} alt="SpiderCochon" />
        <Image src={welcomeImage} alt="WelcomeImage" />
        <button>Se connecter</button>
        <button>Pas encore de compte ? S'inscrire</button>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
