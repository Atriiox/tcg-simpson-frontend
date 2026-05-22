"use client";

import Link from "next/link";

export default function MentionsLegales() {
  return (
    /* 🎯 Remplacement de <main> par une <div> avec overflow-y-auto pour activer le scroll interne */
    <div className="flex-1 w-full h-full overflow-y-auto p-6 sm:p-12 font-main select-none">
      
      {/* Container principal centré et limité en largeur */}
      <div className="max-w-3xl mx-auto bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-8 sm:p-10 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl mb-6">
        
        {/* Titre principal */}
        <div className="text-center mb-10">
          <h1 className="text-title text-simpson-dark dark:text-simpson-white uppercase tracking-widest text-3xl font-black">
            Mentions Légales
          </h1>
          <div className="w-16 h-1 bg-simpson-orange dark:bg-simpson-yellow mx-auto mt-3 rounded-full" />
        </div>

        {/* Corps des mentions légales */}
        <div className="space-y-8 text-simpson-gray dark:text-simpson-white/80 text-sm sm:text-base leading-relaxed">
          
          {/* SECTION 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              1. Édition du site
            </h2>
            <p>
              En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs de l'application l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
            </p>
            <p className="pl-4 border-l-2 border-simpson-orange/30 dark:border-simpson-yellow/30 italic">
              <strong>Propriétaire / Éditeur :</strong> [Ton Nom / Nom de ton Équipe]<br />
              <strong>Contact :</strong> [Ton Adresse Email] <br />
              <strong>Statut :</strong> Projet de démonstration de fin d'études / Projet personnel.
            </p>
          </section>

          {/* SECTION 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              2. Hébergement
            </h2>
            <p>
              Le site est hébergé par la société <strong>[Nom de l'hébergeur, ex: Vercel Inc.]</strong>, dont le siège social est situé au : [Adresse de l'hébergeur].
            </p>
          </section>

          {/* SECTION 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              3. Propriété intellectuelle et contrefaçons
            </h2>
            <p>
              [Ton Nom / Nom de ton Équipe] est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur les éléments accessibles sur le site (textes, graphismes, logos, icônes).
            </p>
            <div className="bg-simpson-light/40 dark:bg-simpson-dark/30 p-4 rounded-xl border border-simpson-gray/5 text-[13px]">
              <strong>Note importante (Fair Use / Projet Fan) :</strong> Ce site est un projet à but non lucratif et à usage purement pédagogique. Les visuels, univers et personnages de la licence <em>« Les Simpson »</em> appartiennent exclusivement à la <strong>20th Century Studios / The Walt Disney Company</strong>. Aucun usage commercial n'est fait de ces ressources.
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              4. Gestion des données personnelles & Cookies
            </h2>
            <p>
              Conformément aux dispositions de la loi 78-17 du 6 janvier 1978 modifiée, l’utilisateur dispose d’un droit d’accès, de modification et de suppression des informations collectées. 
            </p>
            <p>
              Ce projet utilise des cookies techniques ou des jetons (Tokens) strictement nécessaires pour assurer le maintien de votre session d'authentification et l'état de votre inventaire de cartes/boutique. Aucune donnée n'est revendue à des tiers.
            </p>
          </section>

          {/* SECTION 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              5. Droit applicable
            </h2>
            <p>
              Tout litige en relation avec l’utilisation du site est soumis au droit français ou européen. En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents.
            </p>
          </section>

        </div>

        {/* Pied de page de la note légale (Bouton retour) */}
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