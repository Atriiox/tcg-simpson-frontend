"use client";

import Link from "next/link";

export default function ReglesDuJeu() {
  return (
    /* 🎯 Parfaitement adapté à ton layout : scroll interne fluide */
    <div className="flex-1 w-full h-full overflow-y-auto p-6 sm:p-12 font-main select-none">
      
      {/* Container principal style Glassmorphism */}
      <div className="max-w-3xl mx-auto bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-8 sm:p-10 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl mb-6">
        
        {/* Titre principal */}
        <div className="text-center mb-10">
          <h1 className="text-title text-simpson-dark dark:text-simpson-white uppercase tracking-widest text-3xl font-black">
            Règles du jeu
          </h1>
          <div className="w-16 h-1 bg-simpson-orange dark:bg-simpson-yellow mx-auto mt-3 rounded-full" />
        </div>

        {/* Règles du TCG */}
        <div className="space-y-8 text-simpson-gray dark:text-simpson-white/80 text-sm sm:text-base leading-relaxed">
          
          {/* SECTION 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-simpson-orange dark:text-simpson-yellow">1.</span> Le But du Jeu
            </h2>
            <p>
              Bienvenue dans le jeu de cartes ultime de Springfield ! Le but est de collectionne les personnages de la série, de construire le deck le plus puissant et de cumuler un maximum de points de collection pour dominer le classement des joueurs.
            </p>
          </section>

          {/* SECTION 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-simpson-orange dark:text-simpson-yellow">2.</span> Obtenir des Cartes (La Boutique)
            </h2>
            <p>
              Pour agrandir votre collection, vous devez échanger vos précieux **Donuts** contre des Boosters dans la boutique :
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Booster Série 1 :</strong> Contient 5 cartes de rareté aléatoire.</li>
              <li><strong>Pack Légendaire :</strong> Plus cher, mais garantit l'obtention d'une carte de rareté <span className="text-simpson-orange dark:text-simpson-yellow font-bold">Légendaire</span> pour booster instantanément votre score.</li>
            </ul>
          </section>

          {/* SECTION 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-simpson-orange dark:text-simpson-yellow">3.</span> Rareté des Cartes & Rendu
            </h2>
            <p>
              Chaque personnage possède un niveau de rareté reconnaissable à son style et à ses statistiques :
            </p>
            
            {/* Grille ajustée à 3 colonnes de raretés directes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-simpson-gray/5 dark:bg-white/5 p-3 rounded-xl border border-simpson-gray/10 text-center flex flex-col justify-center">
                <span className="font-bold text-slate-500 uppercase tracking-wide text-sm">Commune</span>
                <p className="text-xs mt-1 text-simpson-gray/70 dark:text-simpson-white/60">Les citoyens basiques de Springfield.</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-center flex flex-col justify-center">
                <span className="font-bold text-blue-500 uppercase tracking-wide text-sm">Rare</span>
                <p className="text-xs mt-1 text-simpson-gray/70 dark:text-simpson-white/60">Des personnages récurrents importants.</p>
              </div>
              <div className="bg-simpson-orange/10 dark:bg-simpson-yellow/10 p-3 rounded-xl border border-simpson-orange/20 dark:border-simpson-yellow/20 text-center flex flex-col justify-center">
                <span className="font-bold text-simpson-orange dark:text-simpson-yellow uppercase tracking-wide text-sm">Légendaire</span>
                <p className="text-xs mt-1 text-simpson-gray/70 dark:text-simpson-white/60">La famille Simpson et les cartes holographiques 3D.</p>
              </div>
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-simpson-orange dark:text-simpson-yellow">4.</span> Économie du Jeu
            </h2>
            <p>
              Les Donuts constituent la monnaie principale de Springfield. Vous en gagnez en vous connectant quotidiennement, en validant des quêtes ou en revendant vos cartes en double depuis votre écran de collection.
            </p>
          </section>

          {/* SECTION 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-simpson-orange dark:text-simpson-yellow">5.</span> Évolutions Futures
            </h2>
            <p>
              Restez à l'affût ! De futures mises à jour intégreront un système de **Duels en ligne (PvP)** où les statistiques d'attaque et de défense de vos cartes de collection seront cruciales pour remporter des tournois et gagner encore plus de Donuts.
            </p>
          </section>

        </div>

        {/* Bouton de retour */}
        <div className="mt-10 pt-6 border-t border-simpson-gray/10 dark:border-white/5 flex justify-center">
          <Link
            href="/collection"
            className="px-6 py-2.5 bg-simpson-orange hover:bg-simpson-orange/90 text-simpson-white text-sm uppercase tracking-widest font-bold rounded-xl shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
          >
            Retour au jeu
          </Link>
        </div>

      </div>
    </div>
  );
}