"use client";

import Link from "next/link";

export default function ReglesDuJeu() {
  return (
    <div className="w-full flex-1 p-6 md:p-10 font-main text-simpson-dark dark:text-simpson-white select-none overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* En-tête standardisé - Style identique à Boutique et Amis */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-simpson-gray/10 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-simpson-orange dark:text-simpson-yellow">
              Règles du jeu
            </h1>
            <p className="text-sm font-medium text-simpson-gray mt-1">
              Découvre le fonctionnement du TCG Simpson
            </p>
          </div>
        </div>

        {/* Contenu principal calé sur le catalogue (max-w-5xl) */}
        <div className="max-w-5xl mx-auto w-full pt-4">
          <div className="bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-white/40 dark:border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl space-y-8">
            
            <div className="space-y-8 text-simpson-gray dark:text-simpson-white/80 text-sm sm:text-base leading-relaxed">
              
              {/* SECTION 1 */}
              <section className="space-y-2">
                <h2 className="text-base font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-simpson-orange dark:text-simpson-yellow">1.</span> Le But du Jeu
                </h2>
                <p className="text-xs sm:text-sm text-simpson-gray dark:text-simpson-white/60">
                  Bienvenue dans le jeu de cartes ultime de Springfield ! Le but est de collectionner tous les personnages de la série et de construire tes propres decks personnalisés pour concevoir les meilleures combinaisons de cartes.
                </p>
              </section>

              {/* SECTION 2 */}
              <section className="space-y-2">
                <h2 className="text-base font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-simpson-orange dark:text-simpson-yellow">2.</span> Obtenir des Cartes (La Boutique)
                </h2>
                <p className="text-xs sm:text-sm text-simpson-gray dark:text-simpson-white/60">
                  Pour agrandir ta collection, tu dois échanger tes précieux **Donuts** contre des Boosters dans la boutique. Chaque booster possède sa propre configuration : un nombre précis de cartes à l'intérieur ainsi que des taux d'obtention spécifiques pour chaque niveau de rareté.
                </p>
              </section>

              {/* SECTION 3 */}
              <section className="space-y-2">
                <h2 className="text-base font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-simpson-orange dark:text-simpson-yellow">3.</span> Rareté des Cartes
                </h2>
                <p className="text-xs sm:text-sm text-simpson-gray dark:text-simpson-white/60 mb-3">
                  Chaque personnage possède un niveau de rareté reconnaissable à son style et à ses statistiques :
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-simpson-gray/5 dark:bg-white/5 p-4 rounded-xl border border-simpson-gray/10 dark:border-white/5 text-center flex flex-col justify-center">
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-xs">Commune</span>
                    <p className="text-[11px] mt-1 text-simpson-gray/70 dark:text-simpson-white/50">Les citoyens basiques de Springfield.</p>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-center flex flex-col justify-center">
                    <span className="font-bold text-blue-500 uppercase tracking-wide text-xs">Rare</span>
                    <p className="text-[11px] mt-1 text-simpson-gray/70 dark:text-simpson-white/50">Des personnages récurrents importants.</p>
                  </div>
                  <div className="bg-simpson-orange/10 dark:bg-simpson-yellow/10 p-4 rounded-xl border border-simpson-orange/20 dark:border-simpson-yellow/20 text-center flex flex-col justify-center">
                    <span className="font-bold text-simpson-orange dark:text-simpson-yellow uppercase tracking-wide text-xs">Légendaire</span>
                    <p className="text-[11px] mt-1 text-simpson-gray/70 dark:text-simpson-white/50">La famille Simpson et les hologrammes 3D.</p>
                  </div>
                </div>
              </section>

              {/* SECTION 4 */}
              <section className="space-y-2">
                <h2 className="text-base font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-simpson-orange dark:text-simpson-yellow">4.</span> Économie (Donuts & Doublons)
                </h2>
                <p className="text-xs sm:text-sm text-simpson-gray dark:text-simpson-white/60">
                  Les Donuts constituent la monnaie principale du jeu. Tu en obtiens automatiquement en te connectant quotidiennement sur l'application. Si tu tires des cartes que tu possèdes déjà en double, tu as la possibilité de les revendre directement depuis ton écran de collection pour récupérer des Donuts et acheter de nouveaux boosters.
                </p>
              </section>

              {/* SECTION 5 */}
              <section className="space-y-2">
                <h2 className="text-base font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-simpson-orange dark:text-simpson-yellow">5.</span> Évolutions Futures
                </h2>
                <p className="text-xs sm:text-sm text-simpson-gray dark:text-simpson-white/60">
                  Restez à l'affût ! De futures mises à jour intégreront un système de **Duels en ligne (PvP)** où les statistiques d'attaque et de défense de vos cartes de collection seront cruciales pour remporter la victoire.
                </p>
              </section>

            </div>

            {/* Bouton de retour */}
            <div className="mt-8 pt-4 border-t border-simpson-gray/10 dark:border-white/5 flex justify-end">
              <Link
                href="/collection"
                className="px-5 py-2.5 bg-simpson-blue hover:bg-simpson-blue/90 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer h-10"
              >
                Retour au jeu
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}