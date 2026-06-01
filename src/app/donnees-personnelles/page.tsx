"use client";

import Link from "next/link";

export default function DonneesPersonnelles() {
  return (
    /* 🎯 Parfaitement adapté à ton layout : scroll interne fluide */
    <div className="flex-1 w-full h-full overflow-y-auto p-6 sm:p-12 font-main select-none">
      {/* Container principal style Glassmorphism */}
      <div className="max-w-3xl mx-auto bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-8 sm:p-10 rounded-xl border border-white/40 dark:border-white/10 shadow-xl mb-6">
        {/* Titre principal */}
        <div className="text-center mb-10">
          <h1 className="text-title text-simpson-dark dark:text-simpson-white uppercase tracking-widest text-3xl font-black">
            Données Personnelles
          </h1>
          <div className="w-16 h-1 bg-simpson-orange dark:bg-simpson-yellow mx-auto mt-3 rounded-full" />
        </div>

        {/* Contenu RGPD */}
        <div className="space-y-8 text-simpson-gray dark:text-simpson-white/80 text-sm sm:text-base leading-relaxed">
          {/* SECTION 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              1. Collecte des informations
            </h2>
            <p>
              Dans le cadre de l'utilisation de notre Jeu de Cartes à
              Collectionner (TCG), nous collectons uniquement les informations
              nécessaires à la création de votre compte joueur et à la
              sauvegarde de votre progression :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Votre pseudonyme (utilisé pour vous identifier en jeu).</li>
              <li>
                Votre adresse e-mail (uniquement pour la sécurité de votre
                compte).
              </li>
              <li>
                Vos données de jeu (inventaire de cartes, historique des
                boosters ouverts, solde de donuts).
              </li>
            </ul>
          </section>

          {/* SECTION 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              2. Utilisation des données
            </h2>
            <p>Les données collectées nous servent exclusivement à :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Gérer votre profil de joueur et synchroniser votre collection de
                cartes.
              </li>
              <li>
                Sécuriser l'accès à votre espace utilisateur (authentification
                via Token).
              </li>
              <li>
                Améliorer l'expérience visuelle et technique de l'application.
              </li>
            </ul>
            <p className="bg-simpson-light/40 dark:bg-simpson-dark/30 p-4 rounded-xl border border-simpson-gray/5 text-[13px] font-medium mt-2">
              🔒 <strong>Zéro revente :</strong> Nous ne vendons, n'échangeons
              et ne transférons aucune de vos données personnelles à des tierces
              parties. Votre vie privée reste chez les Simpson.
            </p>
          </section>

          {/* SECTION 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              3. Cookies et Stockage Local
            </h2>
            <p>
              Cette application n'utilise aucun cookie publicitaire ou de
              pistage. Nous utilisons uniquement le stockage local (ou des
              cookies de session techniques) pour retenir votre jeton de
              connexion d'une visite à l'autre et vous éviter de devoir vous
              reconnecter manuellement.
            </p>
          </section>

          {/* SECTION 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              4. Vos Droits (RGPD)
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD), vous disposez d'un droit total d'accès, de rectification
              et de suppression de vos données.
            </p>
            <p>
              Si vous souhaitez réinitialiser votre progression ou supprimer
              définitivement votre compte joueur de notre base de données, vous
              pouvez le faire directement depuis les paramètres de votre profil
              ou en contactant l'administrateur du projet.
            </p>
          </section>

          {/* SECTION 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-simpson-dark dark:text-simpson-white uppercase tracking-wider">
              5. Sécurité
            </h2>
            <p>
              Nous mettons en œuvre une variété de mesures de sécurité pour
              préserver la sécurité de vos informations personnelles. Vos mots
              de passe de compte sont chiffrés dans nos bases de données et les
              communications avec notre API sont entièrement sécurisées via le
              protocole HTTPS.
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
