# BoosterOpener

Composant qui combine le module générique `BoosterPack3D` et ton composant `Card` existant pour offrir une expérience complète "tirer un booster + révéler les cartes".

## Structure

```
BoosterOpener/
├── index.ts
├── components/
│   ├── BoosterOpener.tsx       ← composant racine (orchestre tout)
│   └── CardGrid.tsx            ← grille des cartes avec animation cascade
├── Hooks/
│   └── useBoosterCards.ts      ← fetch + state (loading, error)
├── Schema/
│   └── card.schema.ts          ← types CardData + Zod
└── Styles/
    └── animations.css          ← keyframe d'apparition des cartes
```

## Avant la première utilisation

Trois petits chemins à corriger dans le code, marqués par des `// TODO` :

1. **`Hooks/useBoosterCards.ts`** — fonction `fetchBoosterCards()` : remplace l'URL, la méthode HTTP et le body par les vrais paramètres de ton endpoint backend. Si la réponse n'est pas `{ cards: [...] }`, ajuste aussi `OpenBoosterResponseSchema` dans `Schema/card.schema.ts`.

2. **`components/CardGrid.tsx`** — `import Card from "@/components/Card"` : adapte le chemin à l'emplacement réel de ton composant `Card` dans ton projet.

3. **`components/BoosterOpener.tsx`** — `import { BoosterPack3D } from "@/features/BoosterPack3D"` : adapte aussi si tu as mis `BoosterPack3D/` ailleurs que `src/features/`.

## Utilisation

```tsx
import { BoosterOpener } from "@/features/BoosterOpener";

export default function OpenBoosterPage() {
  return <BoosterOpener imageUrl="/booster.png" />;
}
```

C'est tout. Le composant gère :

- l'affichage du booster 3D
- le fetch des cartes au moment de la déchirure
- l'état de chargement avec un message
- la gestion d'erreur (avec reset auto du booster si le fetch foire)
- l'affichage de la grille de cartes (via `CardGrid` qui utilise ton `Card`)
- le bouton "Ouvrir un autre booster" qui remet tout à zéro

## Props de `<BoosterOpener>`

```ts
interface BoosterOpenerProps {
  imageUrl?: string;                              // défaut : "/booster.png"
  cardSize?: number;                              // défaut : 200, taille de chaque Card
  onCardClick?: (card: CardData) => void;         // callback clic sur une carte
}
```

## Flux interne

```
1. <BoosterPack3D> affiché
       ↓ (utilisateur tire au-delà de 90%)
2. onOpen → useBoosterCards.openBooster() → fetch
       ↓
3. POST /api/booster/open
       ↓
4a. Succès → setCards(...) → bascule sur <CardGrid>
4b. Échec → setError(...) + boosterRef.reset() (l'utilisateur peut retenter)
       ↓
5. <CardGrid> affichée + bouton reset
       ↓ (clic reset)
6. cards = [], boosterRef.reset() → retour au début
```

## Adapter à un autre format d'API

Si ton backend renvoie autre chose que `{ cards: CardData[] }` :

```ts
// Schema/card.schema.ts
export const OpenBoosterResponseSchema = z.object({
  data: z.object({                          // ← exemple : enveloppé dans "data"
    booster_id: z.string(),
    cards: z.array(CardDataSchema),
  }),
});

// Hooks/useBoosterCards.ts (fetchBoosterCards)
const parsedResponse = OpenBoosterResponseSchema.parse(rawData);
return parsedResponse.data.cards;           // ← chemin vers le tableau
```

Zod fera le travail de validation au runtime et te lèvera une erreur explicite si la structure ne correspond pas.

## Personnaliser le visuel

- **Fond de la page** : modifie la classe Tailwind du `<div>` racine dans `BoosterOpener.tsx` (actuellement un gradient radial bleu nuit).
- **Animation des cartes** : édite le keyframe `booster-card-enter` dans `Styles/animations.css`. Pour changer le délai entre cartes, passe `cascadeDelaySeconds` à `<CardGrid>`.
- **Taille des cartes** : prop `cardSize` (le composant `Card` calcule ses unités `em` à partir de ça, donc tout se redimensionne proportionnellement).

## Dépendances

Les mêmes que `BoosterPack3D` (`three`, `@react-three/fiber`, `@react-three/drei`, `zod`) + ton composant `Card` existant. Pas de nouvelle dépendance.
