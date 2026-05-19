import React from 'react';
import Image from 'next/image'
import welcomeImage from '../../../../public/Logo1.webp'
import spiderCochon from '../../../../public/spiderCochon1.webp'
import logo from '../../../../public/Logo1.webp'

function Home() {
  return (
    <div>
<header>
    <Image src={logo} alt ="logo"/>
    <button>Accueil</button>
    <button>Collection</button>
    <button>Règles du jeu</button>

</header>

<main>
<Image src={spiderCochon} alt="SpiderCochon" />
<Image src={welcomeImage} alt="WelcomeImage" />
<button>Se connecter</button>
<button>Pas encore de compte ? S'inscrire</button>
</main>

<footer>
    <button>Cookies</button>
    <button>Données personnelles</button>
    <button>Mentions légales</button>
    <button>About</button>

</footer>

    </div>
  );
}

export default Home;