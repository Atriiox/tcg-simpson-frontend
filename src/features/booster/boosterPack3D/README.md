# BoosterPack3D

Composant React générique pour afficher un booster TCG en 3D avec un geste de déchirure interactif. Le module ne sait rien du contenu du booster : il expose un callback `onOpen` que tu branches à ta propre logique de fetch/affichage de cartes.

> **Nouveau à la 3D ?** Lis [`CONCEPTS.md`](./CONCEPTS.md) en parallèle. Il explique les notions de Three.js / 3D temps réel utilisées ici (camera, lumières, normal maps, UVs, etc.) sans présupposer de connaissances. Les commentaires dans le code y renvoient régulièrement.

## Sommaire

- [Aperçu rapide](#aperçu-rapide)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Structure du dossier](#structure-du-dossier)
- [API du composant](#api-du-composant)
- [Hooks publics (usage avancé)](#hooks-publics-usage-avancé)
- [Personnalisation visuelle](#personnalisation-visuelle)
- [Comment ça marche en interne](#comment-ça-marche-en-interne)
- [Dépendances](#dépendances)

## Aperçu rapide

- Rendu 3D avec **Three.js** via React Three Fiber
- Image du booster appliquée en texture sur un plane, **détection automatique** de la zone du booster dans l'image (ignore les bandes noires)
- **Normal map procédurale** pour simuler les plis du film plastique
- Geste : `pointerdown` + drag horizontal. Au seuil (90 % par défaut), `onOpen` est appelé
- **HDRI** (`Environment preset="city"`) pour des reflets réalistes
- Léger effet de **parallaxe** sur le hover
- Validation **Zod** pour les types runtime (bornes détectées)

## Installation

```bash
npm install three @react-three/fiber @react-three/drei zod
npm install -D @types/three
```

Place le dossier `BoosterPack3D/` dans ton arbo de features. Place une image de booster dans `/public/booster.png` (ou passe ton propre chemin).

## Quick start

```tsx
import { useRef, useState } from "react";
import { BoosterPack3D, type BoosterPack3DHandle } from "@/features/BoosterPack3D";
import { MyCard } from "@/components/MyCard"; // ton propre composant carte

export function MyPackOpener() {
  const boosterRef = useRef<BoosterPack3DHandle>(null);
  const [revealedCards, setRevealedCards] = useState<MyCardType[]>([]);

  const handleOpen = async () => {
    const cards = await fetchMyCards(5);
    setRevealedCards(cards);
  };

  const handleReset = () => {
    setRevealedCards([]);
    boosterRef.current?.reset();
  };

  return (
    <div>
      {revealedCards.length === 0 ? (
        <BoosterPack3D
          ref={boosterRef}
          imageUrl="/booster.png"
          onOpen={handleOpen}
        />
      ) : (
        <>
          {revealedCards.map((card) => (
            <MyCard key={card.id} {...card} />
          ))}
          <button onClick={handleReset}>Ouvrir un autre booster</button>
        </>
      )}
    </div>
  );
}
```

## Structure du dossier

```
BoosterPack3D/
├── index.ts                     ← API publique (barrel export)
├── README.md                    ← tu es ici
├── components/                  ← composants React
│   ├── BoosterPack3D.tsx        ← racine du module, gère la composition
│   ├── BoosterScene.tsx         ← Canvas R3F + lumières + HDRI
│   ├── BoosterMesh.tsx          ← mesh 3D (top + bottom + déchirure)
│   └── ParallaxGroup.tsx        ← wrapper qui anime le tilt souris
├── Hooks/                       ← logique réutilisable
│   ├── useBoosterTextures.ts    ← chargement image + normal map + détection bornes
│   ├── useBoosterDrag.ts        ← geste de déchirure (pointerdown/move/up global)
│   └── useParallaxTilt.ts       ← tilt 3D selon la souris
└── Schema/                      ← types + constantes + validation Zod
    ├── constants.ts             ← PACK_WIDTH, TEAR_LINE_POSITION, etc.
    └── booster.schema.ts        ← BoosterBounds, BoosterTextures, Tilt
```

**Convention** : seul `index.ts` est l'API publique. Les imports profonds (`BoosterPack3D/components/...`) sont déconseillés — la structure interne peut changer.

## API du composant

### `<BoosterPack3D />`

```tsx
interface BoosterPack3DProps {
  imageUrl?: string;                              // défaut : "/booster.png"
  containerWidth?: number | string;               // défaut : 520
  containerHeight?: number | string;              // défaut : 720
  openThresholdPercent?: number;                  // défaut : 90 (sur 100)
  onOpen?: () => void;                            // déclenché quand le seuil est atteint
  loadingFallback?: ReactNode;                    // override du spinner de chargement
  errorFallback?: ReactNode;                      // override du message d'erreur
  hintLabel?: ReactNode;                          // override du texte sous le booster
}
```

### `BoosterPack3DHandle` (via ref)

Le composant utilise `forwardRef`. Le handle expose :

```tsx
interface BoosterPack3DHandle {
  reset: () => void;   // remet le booster en état fermé
}
```

Utilisation :

```tsx
const boosterRef = useRef<BoosterPack3DHandle>(null);
// ...
<BoosterPack3D ref={boosterRef} ... />
// Plus tard :
boosterRef.current?.reset();
```

## Hooks publics (usage avancé)

Si tu veux composer ta propre scène 3D (par exemple, plusieurs boosters côte à côte, ou un layout custom), les hooks sont exposés directement.

### `useBoosterTextures(imageUrl, failTimeoutMs?)`

Charge l'image, détecte les bornes, génère la normal map. Retourne `{ textures, hasFailed }`.

### `useBoosterDrag({ openThresholdPercent?, onOpen, isDisabled? })`

Gère le geste de déchirure. Retourne `{ containerRef, tearProgress, isDragging, handlePointerDown, reset }`. Tu poses le `containerRef` sur le conteneur dont tu veux mesurer la largeur, et le `handlePointerDown` sur l'overlay qui capture les events.

### `useParallaxTilt({ containerRef, isDisabled?, pitchAmplitude?, yawAmplitude? })`

Calcule un tilt 3D selon la position du pointeur. Retourne `{ tilt, handlePointerMove, handlePointerLeave }`.

Exemple de composition manuelle :

```tsx
import {
  useBoosterTextures,
  useBoosterDrag,
  useParallaxTilt,
} from "@/features/BoosterPack3D";

function CustomBooster() {
  const { textures } = useBoosterTextures("/booster.png");
  const { containerRef, tearProgress, handlePointerDown } = useBoosterDrag({
    onOpen: () => console.log("ouvert"),
  });
  const { tilt, handlePointerMove, handlePointerLeave } = useParallaxTilt({
    containerRef,
  });

  return (
    <div ref={containerRef} onPointerDown={handlePointerDown} /* ... */>
      {/* compose ta scène avec les textures et le tilt */}
    </div>
  );
}
```

## Personnalisation visuelle

### Loading et erreur

Par défaut, un spinner Tailwind s'affiche pendant le chargement, et un cartouche rose en cas d'erreur. Tu peux les remplacer :

```tsx
<BoosterPack3D
  imageUrl="/booster.png"
  loadingFallback={<MySpinner />}
  errorFallback={<MyErrorBanner />}
/>
```

### Hint sous le booster

```tsx
<BoosterPack3D
  imageUrl="/booster.png"
  hintLabel={<span>Glisse pour ouvrir →</span>}
/>
```

### Style du conteneur

Le composant pose `position: relative` sur le conteneur. Pour ajuster la taille :

```tsx
<BoosterPack3D containerWidth={400} containerHeight={560} />
```

Pour styler l'environnement autour (fond, padding, layout), enveloppe le composant dans ton propre wrapper.

## Comment ça marche en interne

### Détection automatique de la zone du booster

`useBoosterTextures` échantillonne l'image en 200 px de large, calcule pour chaque ligne/colonne le ratio de pixels sombres, et avance depuis chaque bord vers le centre tant que ce ratio est > 92 %. Cela permet d'ignorer les bandes noires autour d'une photo prise sur fond sombre, et de cadrer la texture exactement sur le booster.

Les bornes sont exposées sous forme de coordonnées UV `{ uMin, uMax, vMin, vMax }` + un `aspectRatio`.

### Normal map procédurale

Pour donner du relief au plastique sans utiliser une vraie texture de plis, on génère à la volée une normal map en sommant plusieurs sinusoïdes pour obtenir une **height map**, puis on calcule les normales par différences centrales (gradients horizontaux et verticaux). Le résultat est appliqué via `meshPhysicalMaterial.normalMap`.

### Mesh coupé en deux

Le booster est en réalité **deux planes** :
- la moitié basse (statique, 88 % de la hauteur)
- la moitié haute (12 % de la hauteur, montée sur un `<group>` qui sert de pivot)

Quand on tire, le pivot tourne autour de l'axe X (jusqu'à 90°) et s'avance vers la caméra. Comme les UVs de chaque plane sont remappées sur la portion correspondante de la texture, l'illusion de déchirure est parfaite.

### Geste de déchirure robuste

`useBoosterDrag` écoute `pointermove` / `pointerup` / `pointercancel` sur **`window`** (pas sur le booster). C'est crucial : dès que le pointeur sort du booster pendant un drag rapide, sans listener global on perdrait le geste. La progression est calculée comme un pourcentage de la largeur du conteneur (mesurée via `getBoundingClientRect`), ce qui rend le seuil indépendant de la taille à l'écran.

### Pourquoi un overlay transparent ?

Le `<Canvas>` de R3F intercepte les pointer events sur les meshes 3D, ce qui rend le drag instable. On ajoute donc un `<div>` transparent **au-dessus** du Canvas qui capture tous les events de pointage. Le Canvas n'a plus qu'à afficher la scène.

### Pourquoi `meshPhysicalMaterial` et pas `meshStandardMaterial` ?

Pour le `clearcoat` — la couche transparente brillante qui simule le film plastique du booster. Sans clearcoat, le rendu est mat et perd l'effet "emballage".

## Dépendances

| Package | Usage |
|---|---|
| `three` | Moteur 3D |
| `@react-three/fiber` | Renderer React pour Three.js |
| `@react-three/drei` | Helpers (HDRI `Environment`) |
| `zod` | Validation runtime des bornes |
| `react` ≥ 18 | Hooks, `forwardRef`, `useImperativeHandle` |
| Tailwind CSS | Toutes les classes utilitaires (`animate-spin`, etc.) |

Aucune autre dépendance. Pas de CSS custom : tout passe par Tailwind ou inline-style pour les valeurs dynamiques (positions 3D, animations).
