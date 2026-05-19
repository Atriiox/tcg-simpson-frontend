import React from 'react';
import Image from 'next/image'
import logo from '../../public/Logo1.webp'


function HeaderUnsigned() {
    return (
        <header>
    <Image src={logo} alt ="logo"/>
    <button>Accueil</button>
    <button>Collection</button>
    <button>Règles du jeu</button>

</header>
    )
}

export default HeaderUnsigned;