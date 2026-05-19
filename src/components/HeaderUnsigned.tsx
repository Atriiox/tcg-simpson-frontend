import React from 'react';
import Image from 'next/image'
import logo from '../../public/Logo1.webp'


function HeaderUnsigned() {
    return (
        <header className="flex gap-150 bg-white shadow-lg">
    <Image src={logo} alt ="logo"/>
    <div className="flex gap-10 text-title">
    <button>Accueil</button>
    <button>Collection</button>
    <button>Règles du jeu</button>
    </div>

</header>
    )
}

export default HeaderUnsigned;