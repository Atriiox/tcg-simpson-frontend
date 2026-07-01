# TCG-Simpson — Frontend

Interface web du jeu de cartes à collectionner Simpsons, construite avec Next.js 15, React 19 et TypeScript.

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS avec design system personnalisé (tokens `simpson-*`, police Fredoka Variable)
- **State management** : Redux Toolkit + Redux Persist
- **3D** : @react-three/fiber + @react-three/drei
- **Formulaires** : Formik + Zod
- **Architecture** : Feature-Sliced Design (FSD)

## Prérequis

- Node.js 18+
- Yarn
- Backend TCG-Simpson démarré sur `http://localhost:3000`

## Installation

```bash
yarn install
```

## Démarrage

```bash
yarn dev
```

L'application est accessible sur [http://localhost:3001](http://localhost:3001).

> Le port 3001 est utilisé par défaut, le port 3000 étant réservé au backend.

## Tests E2E — Cypress

Les tests end-to-end couvrent les parcours critiques de l'application : inscription, ouverture de booster et affichage des cartes.

### Prérequis

- L'application frontend doit tourner sur `http://localhost:3001`
- Le backend doit tourner sur `http://localhost:3000`

### Lancer les tests

Mode interactif (recommandé pour le développement) :
```bash
yarn cypress open
```

Mode headless (CI ou vérification rapide) :
```bash
yarn cypress run
```

### Régression visuelle

Les tests incluent des comparaisons de screenshots via `cypress-visual-regression`. Les images de référence (baseline) sont versionnées dans `cypress/snapshots/base/`.

Pour régénérer la baseline après un changement UI intentionnel :
```bash
yarn cypress run --expose visualRegressionType=base
```

### Structure

```
cypress/
├── e2e/                  # Specs des tests
│   └── register.cy.ts    # Parcours inscription + ouverture booster
├── snapshots/
│   ├── base/             # Images de référence (versionnées)
│   └── actual/           # Captures du dernier run (ignorées par git)
├── support/
│   └── e2e.ts            # Configuration des commandes custom
└── tsconfig.json         # Configuration TypeScript dédiée à Cypress
```

### Nettoyage

Les comptes créés pendant les tests sont automatiquement supprimés via la route `DELETE /users/me` après chaque run.

## Déploiement

L'application est déployée sur Vercel. Les variables d'environnement nécessaires sont décrites dans `.env.example`.