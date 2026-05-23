# Notions 3D utilisees dans ce module

Ce fichier explique les concepts de 3D temps reel utilises dans `BoosterPack3D`, sans presupposer de connaissances prealables. Lis-le une fois, puis reviens-y comme reference quand tu vois un terme bizarre dans le code.

## Sommaire

1. [Vocabulaire de base](#1-vocabulaire-de-base)
2. [Three.js et React Three Fiber](#2-threejs-et-react-three-fiber)
3. [Le Canvas et la scene](#3-le-canvas-et-la-scene)
4. [La camera et le champ de vision](#4-la-camera-et-le-champ-de-vision)
5. [Les lumieres](#5-les-lumieres)
6. [Le HDRI (Environment)](#6-le-hdri-environment)
7. [Le tone mapping](#7-le-tone-mapping)
8. [Les meshes : geometry + material](#8-les-meshes--geometry--material)
9. [Textures et coordonnees UV](#9-textures-et-coordonnees-uv)
10. [Normal maps](#10-normal-maps)
11. [meshPhysicalMaterial et le clearcoat](#11-meshphysicalmaterial-et-le-clearcoat)
12. [Settings de texture](#12-settings-de-texture)
13. [Groupes et pivots](#13-groupes-et-pivots)
14. [useFrame et la boucle d'animation](#14-useframe-et-la-boucle-danimation)
15. [Glossaire express](#15-glossaire-express)

---

## 1. Vocabulaire de base

Une scene 3D temps reel, c'est toujours les memes ingredients :

- **Scene** : le "monde" qui contient tout (comme la scene d'un theatre)
- **Camera** : le point de vue depuis lequel on regarde la scene
- **Lumieres** : sans elles, tout est noir
- **Meshes** : les objets 3D visibles (un cube, une sphere, un booster...)
- **Materiaux** : la "peinture" appliquee sur les meshes (couleur, brillance, reflets)
- **Textures** : des images appliquees sur les materiaux

Le **renderer** prend tout ca et le dessine 60 fois par seconde sur un `<canvas>` HTML.

Analogie : c'est exactement un studio photo. Il faut un sujet (mesh), un eclairage (lights), un point de vue (camera) et quelqu'un qui appuie sur le declencheur (renderer). Trois.js orchestre tout ca via JavaScript.

---

## 2. Three.js et React Three Fiber

**Three.js** est la librairie 3D la plus utilisee en JavaScript. Elle expose des classes comme `THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.Mesh`, etc.

En vanilla Three.js, on ecrit :

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, ratio, 0.1, 1000);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
renderer.render(scene, camera);
```

**React Three Fiber (R3F)** est un binding React qui transforme tout ca en JSX :

```tsx
<Canvas camera={{ fov: 30 }}>
  <mesh>
    <planeGeometry />
    <meshStandardMaterial />
  </mesh>
</Canvas>
```

Sous le capot c'est le meme Three.js, mais on profite de React (composants, hooks, declaratif). C'est ce qu'on utilise dans le module.

**Drei** est une lib d'utilitaires pour R3F (camera controls, environnements HDR, helpers). On l'utilise pour `<Environment preset="city" />`.

---

## 3. Le Canvas et la scene

Dans `BoosterScene.tsx` :

```tsx
<Canvas
  dpr={[1, 2]}
  camera={{ position: [0, 0, 6.5], fov: 30 }}
  gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
>
```

- **`<Canvas>`** : c'est le composant racine R3F. Il cree automatiquement la scene, le renderer WebGL, la camera et la boucle d'animation. Tout ce qu'on met dedans est ajoute a la scene.
- **`dpr={[1, 2]}`** : "device pixel ratio". Sur un ecran retina (Mac, mobile), 1 pixel CSS = 2 pixels physiques. Si on rendait a `dpr=1`, ce serait flou. A `dpr=2`, c'est net mais 4x plus de pixels a calculer. On laisse R3F choisir entre 1 et 2 selon l'appareil.
- **`gl={...}`** : options passees au renderer WebGL.
  - `antialias: true` : lissage des bords (sinon on voit des escaliers de pixels sur les diagonales).
  - `toneMapping` : voir section 7.

---

## 4. La camera et le champ de vision

```tsx
camera={{ position: [0, 0, 6.5], fov: 30 }}
```

- **`position: [0, 0, 6.5]`** : x=0, y=0, z=6.5. La camera est centree et recule de 6.5 unites par rapport a l'origine. Le booster est centre sur (0,0,0), donc la camera regarde droit dessus.
- **`fov: 30`** : "field of view", en degres. C'est l'angle de vision vertical de la camera.

Le FOV, c'est l'equivalent en photo de la focale :
- **FOV 90°+** : grand-angle (deforme, donne un effet "GoPro")
- **FOV 50°** : "naturel" (proche de la vision humaine)
- **FOV 30°** : telephoto (peu de deformation, on "ecrase" la perspective)

On a choisi 30° parce qu'on veut un rendu **flatteur, peu deformant**, comme une photo produit. La camera est donc loin (z=6.5) avec un petit FOV.

```
FOV grand (90°)             FOV petit (30°)
  /              \              |       |
 /     scene      \             |  scene|
/                  \            |       |
camera proche                   camera loin
(deformation forte)             (peu de deformation)
```

---

## 5. Les lumieres

```tsx
<ambientLight intensity={0.45} />
<directionalLight position={[4, 6, 5]} intensity={0.9} />
<pointLight position={[-4, -2, 3]} intensity={0.4} color="#9b6bff" />
<pointLight position={[4, -1, 2]} intensity={0.35} color="#ff7a3d" />
```

Trois types de lumieres avec des roles distincts :

**`ambientLight`** : lumiere uniforme partout. Ne projette pas d'ombre, ne cree pas de relief. Sert juste a eviter que les zones d'ombre soient totalement noires. Intensite faible (0.45) pour ne pas "ecraser" le rendu.

**`directionalLight`** : comme le soleil. Tous les rayons partent dans la meme direction. C'est la **lumiere principale** qui donne du relief. On la positionne en haut a droite (`[4, 6, 5]`).

**`pointLight`** : comme une ampoule. Emet dans toutes les directions depuis un point. On en met deux **colorees** :
- une violette en bas a gauche (`#9b6bff`)
- une orange en bas a droite (`#ff7a3d`)

Ces lumieres colorees creent du **rim light** : un liseré de couleur sur les bords du booster qui le detache du fond. C'est une technique de cinema photographique classique.

**Pourquoi 4 lumieres ?** Parce qu'avec une seule, le rendu est plat et triste. La regle "key light + fill light + rim lights" donne immediatement un rendu professionnel.

---

## 6. Le HDRI (Environment)

```tsx
<Environment preset="city" />
```

Un **HDRI** ("High Dynamic Range Image") est une image panoramique 360° qui contient des informations de luminosite tres precises. On l'utilise comme **environnement** : pour chaque surface reflechissante dans la scene, Three.js va aller chercher quelle couleur du HDRI elle reflete.

Sans HDRI, un materiau "metal" est tout noir parce qu'il n'a rien a refleter. Avec, il reflete l'environnement comme un vrai metal le ferait.

`preset="city"` charge un HDRI urbain pre-fait par Drei (lumiere de ville, fenetres, batiments). C'est ce qui donne aux meshes brillants leurs reflets realistes, sans avoir a modeliser l'environnement.

Note : le HDRI sert UNIQUEMENT pour les reflets et l'eclairage indirect. Il n'est pas visible en arriere-plan (sauf si tu mets `background={true}`, ce qu'on ne fait pas ici).

---

## 7. Le tone mapping

```tsx
gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
```

Le **tone mapping** est l'etape finale du rendu qui convertit les valeurs de couleur "physiques" calculees (qui peuvent depasser 1.0, par exemple un reflet de soleil tres intense) en valeurs affichables a l'ecran (0-255 par canal).

- **Sans tone mapping** : les zones tres lumineuses sont "ecretees" a blanc pur, on perd les details
- **Avec tone mapping ACES Filmic** : on compresse intelligemment les hautes lumieres pour preserver les details, comme le ferait une pellicule de cinema

C'est la difference entre une photo amateur (lumieres cramees) et une photo cinema (lumieres soyeuses). ACES est le standard de l'industrie du cinema.

---

## 8. Les meshes : geometry + material

Un **mesh** est l'objet 3D visible. Il est compose de :

- **Geometry** : la forme. Une collection de **sommets** (points 3D) relies par des **triangles**.
- **Material** : l'apparence. Comment chaque triangle reagit a la lumiere (couleur, brillance, transparence, etc.)

```tsx
<mesh geometry={topGeometry}>
  <meshPhysicalMaterial map={colorTexture} />
</mesh>
```

Dans le booster, on utilise `THREE.PlaneGeometry(width, height, 1, 1)` : un simple rectangle compose de deux triangles. C'est suffisant parce que le booster est plat. Si on voulait modeliser un booster en relief, on prendrait `BoxGeometry` ou on chargerait un modele `.glb`.

---

## 9. Textures et coordonnees UV

Une **texture** est une image 2D qu'on "colle" sur une geometrie 3D. Le probleme : comment dire a chaque triangle de la geometrie quelle partie de l'image afficher ?

Reponse : les **coordonnees UV**. Chaque sommet du mesh a deux coordonnees supplementaires (U et V) qui pointent vers un endroit precis de la texture.

```
Texture (image 2D)           Plane Geometry (mesh 3D)
(0,1)         (1,1)             sommet TL --- sommet TR
   +-----------+                    |            |
   |           |                    |            |
   |           |                    |            |
   +-----------+                    sommet BL --- sommet BR
(0,0)         (1,0)
```

Par convention, **U** est l'axe horizontal de la texture (0 = gauche, 1 = droite) et **V** est l'axe vertical (0 = bas, 1 = haut, sauf si on a `flipY=true` qui inverse, et c'est notre cas dans Three.js).

**Cas standard** : un `PlaneGeometry` a deja les UVs `(0,0)`, `(1,0)`, `(0,1)`, `(1,1)` aux quatre coins. La texture entiere s'affiche.

**Notre cas** : on veut afficher SEULEMENT une partie de la texture sur chaque moitie du booster. C'est pour ca qu'on ecrit `buildPartialUVPlane` dans `BoosterMesh.tsx` : on **reecrit les UVs** pour ne pointer que vers la portion qui nous interesse.

Exemple : si la moitie basse doit afficher de V=0 a V=0.88 (88% du bas de l'image), on met les UVs des deux sommets du bas a V=0 et des deux sommets du haut a V=0.88. Et le PlaneGeometry standard du mesh n'a aucun moyen de savoir qu'il n'affiche qu'une partie de l'image — il fait juste ce qu'on lui dit.

C'est aussi comme ca qu'on recadre automatiquement sur la zone du booster (en ignorant les bandes noires de la photo) : la detection nous donne `{uMin, uMax, vMin, vMax}`, et on remappe les UVs entre ces bornes.

---

## 10. Normal maps

**Le probleme** : un plane est plat. Sa **normale** (la direction perpendiculaire a la surface) pointe partout dans la meme direction. Donc quand une lumiere frappe le plane, elle est reflechie de maniere uniforme. Resultat : pas de relief.

**La solution naive** : ajouter plein de polygones pour faire des bosses. Probleme : c'est cher en calcul.

**La solution maline : la normal map.**

Une normal map est une texture speciale ou chaque pixel encode une **direction de normale** au lieu d'une couleur :
- Composante R (rouge) = X de la normale
- Composante G (vert) = Y de la normale
- Composante B (bleu) = Z de la normale

(L'encodage est `couleur = direction * 0.5 + 0.5` pour que `-1..1` devienne `0..1`, donc `0..255` en RGB.)

Quand le shader rend un pixel du mesh, il regarde la normal map a cet endroit, decode la direction et calcule l'eclairage **comme si la surface etait orientee dans cette direction**, meme si geometriquement le mesh est plat.

Resultat : on a l'illusion d'un relief detaille (les plis du film plastique) avec **zero polygone supplementaire**. C'est l'astuce qui fait tourner les jeux video AAA.

**Pourquoi on en genere une procedurale** : on aurait pu telecharger une normal map de plis plastique sur internet. Mais en sommant quelques sinusoides bruitees, on obtient un height map convaincant, puis on calcule les normales par **differences centrales** (le gradient du height map a chaque pixel donne la direction perpendiculaire au relief). C'est rapide, ca tient en quelques lignes, et c'est unique a chaque booster.

```
Height map         ->        Normales calculees
(altitude)                   (direction perpendiculaire)
                                        \
  /\                                     \   <-- ici la pente
 /  \                                    /\      monte, donc la
/    \____                              /  \     normale pointe
              <-- ici la pente            ___ <-- ici la surface
                  descend, donc la            est plate, normale
                  normale pointe              droit en haut
                  vers la gauche
```

Le `normalScale={new Vector2(0.22, 0.22)}` dans le materiau attenue l'effet (sinon les plis seraient enormes et caricaturaux).

---

## 11. meshPhysicalMaterial et le clearcoat

Three.js propose plusieurs materiaux :

- **`meshBasicMaterial`** : pas de calcul d'eclairage. Toujours pleine couleur. Inutile ici.
- **`meshStandardMaterial`** : PBR ("Physically Based Rendering"). Couleur, metalness, roughness, normal map. Le standard.
- **`meshPhysicalMaterial`** : extension de Standard avec des fonctionnalites en plus, dont le **clearcoat**.

Le **clearcoat** simule une **couche de vernis transparente** par-dessus le materiau. C'est exactement ce qu'on veut pour le film plastique brillant du booster :

- En dessous : la photo du booster (eclairee, avec les plis)
- Par-dessus : une fine couche transparente qui ajoute des reflets et du brillant

Sans clearcoat, le booster aurait l'air mat (genre carton). Avec clearcoat, il a l'air d'etre sous plastique.

Les autres parametres du materiau :

```ts
const materialProps = {
  map: textures.colorTexture,                    // image du booster (couleur)
  normalMap: textures.normalTexture,             // plis (relief simule)
  normalScale: new THREE.Vector2(0.22, 0.22),    // intensite du relief
  metalness: 0.15,                               // 0=plastique, 1=metal pur
  roughness: 0.45,                               // 0=miroir, 1=mat
  clearcoat: 0.7,                                // intensite du vernis (0..1)
  clearcoatRoughness: 0.12,                      // brillant du vernis
  envMapIntensity: 0.7,                          // force des reflets HDRI
  side: THREE.FrontSide,                         // on ne rend que la face avant
  transparent: true,
};
```

**Pourquoi `metalness: 0.15`** : la photo est deja eclairee dans l'image. Si on mettait `metalness: 1`, on aurait un effet "metal" qui combat avec l'eclairage deja present dans la photo. On garde une valeur basse, juste pour avoir un peu de reflets.

**`side: FrontSide`** : Three.js peut rendre les triangles des deux cotes (`DoubleSide`) ou seulement de devant (`FrontSide`). Avec `FrontSide`, le dos du plane est invisible. Sinon on verrait la texture en miroir quand le top pivote vers la camera.

---

## 12. Settings de texture

Dans `useBoosterTextures.ts` :

```ts
colorTexture.colorSpace = THREE.SRGBColorSpace;
colorTexture.anisotropy = 16;
colorTexture.minFilter = THREE.LinearMipmapLinearFilter;
colorTexture.magFilter = THREE.LinearFilter;
colorTexture.wrapS = THREE.ClampToEdgeWrapping;
colorTexture.wrapT = THREE.ClampToEdgeWrapping;
```

Chaque parametre repond a un probleme precis :

**`colorSpace: SRGBColorSpace`** : les images PNG/JPG sont stockees en espace sRGB (le standard du web). Three.js fait ses calculs d'eclairage en lineaire. Sans cette ligne, les couleurs sortiraient delavees / sur-eclairees. On dit "interprete cette image comme du sRGB et convertis-la en lineaire pour les calculs".

**`anisotropy: 16`** : quand on regarde une texture sous un angle tres incline, elle devient floue. L'anisotropie compense en echantillonnant plus de pixels. 16 est le max GPU usuel. Sans ca, le booster vu de profil serait moche.

**`minFilter: LinearMipmapLinearFilter`** : quand la texture est rendue plus petite que sa taille reelle (par ex, le booster eloigne de la camera), il faut decider comment "reduire" les pixels. Cette option utilise des **mipmaps** (versions pre-reduites de l'image) avec interpolation lineaire entre elles. C'est le meilleur compromis qualite/perf.

**`magFilter: LinearFilter`** : quand la texture est rendue plus grande que sa taille reelle (zoom). `Linear` = interpolation bilineaire (lisse). `Nearest` donnerait un effet pixel-art.

**`wrapS / wrapT: ClampToEdgeWrapping`** : que se passe-t-il si on demande la texture en dehors de `[0, 1]` (UV out of range) ? `ClampToEdge` = on prend le pixel du bord. `RepeatWrapping` = on repete la texture. Pour le booster, on veut clamp pour ne pas avoir un effet de tile.

**Sur la normal map** par contre, on utilise `RepeatWrapping`. Pourquoi ? Parce que la normal map represente une texture procedurale de plis qui peut sans probleme se repeter en dehors de `[0, 1]`.

---

## 13. Groupes et pivots

```tsx
<group ref={topPivotRef} position={[0, bottomHeight - packHeight / 2, 0]}>
  <mesh geometry={topGeometry} position={[0, topHeight / 2, 0]}>
    <meshPhysicalMaterial {...materialProps} />
  </mesh>
</group>
```

Un **`<group>`** est un conteneur Three.js. Il a sa propre position/rotation et applique ces transformations a tous ses enfants.

**Pourquoi un groupe pour la moitie haute ?** Parce qu'on veut que la rotation se fasse autour de la **ligne de dechirure** (le bas du mesh top), pas autour du centre du mesh.

Astuce : on positionne le groupe a l'endroit de la ligne de dechirure, et on positionne le mesh A L'INTERIEUR DU GROUPE a un offset vertical de `topHeight / 2`. Quand le groupe tourne, il tourne autour de son propre origine — qui est la ligne de dechirure. Le mesh est entraine avec, mais son axe de rotation effective est celui du groupe.

Sans cette technique :
- Si on tournait le mesh directement, il pivoterait autour de SON centre, donc la moitie superieure descendrait pendant que la moitie inferieure monterait. Pas l'effet voulu.
- Avec le groupe, le bord bas du mesh reste fixe (c'est l'origine du groupe), le bord haut tourne dans l'espace. Effet "dechirure" parfait.

C'est un pattern tres commun en 3D : pour faire pivoter un objet autour d'un point qui n'est pas son centre, on l'enferme dans un groupe positionne au point de pivot voulu.

---

## 14. useFrame et la boucle d'animation

```tsx
useFrame((state) => {
  const elapsedTime = state.clock.elapsedTime;
  bottomMeshRef.current.position.y = -packHeight / 2 + bobOffset;
  topPivotRef.current.rotation.x = -tearAngleRadians;
});
```

**`useFrame`** est un hook R3F qui execute son callback **a chaque frame** de la boucle de rendu (~60 fois par seconde). C'est l'equivalent de `requestAnimationFrame` mais integre a R3F.

A chaque frame, on peut :
- Lire l'horloge (`state.clock.elapsedTime` en secondes depuis le debut)
- Modifier la position/rotation/scale des refs
- Modifier les materiaux

Important : **on ne passe pas par `setState`** dans `useFrame`. Sinon on declencherait un re-render React 60 fois par seconde, ce qui est catastrophique en perf. A la place, on modifie directement les proprietes des objets Three.js via les refs, et Three.js redessine la scene au prochain tick.

C'est le principe fondamental d'une animation 3D temps reel : la scene n'est PAS recreee a chaque frame, elle est seulement **modifiee in-place** entre deux rendus.

---

## 15. Glossaire express

| Terme | Definition rapide |
|---|---|
| **Mesh** | Objet 3D visible = geometry + material |
| **Geometry** | La forme (sommets + triangles) |
| **Material** | L'apparence (couleur, brillance, etc.) |
| **Texture** | Image 2D appliquee sur un mesh |
| **UV** | Coordonnees (0..1) pour mapper une texture sur un mesh |
| **Normale** | Vecteur perpendiculaire a la surface, sert a calculer l'eclairage |
| **Normal map** | Texture qui encode des normales pour simuler du relief sans polygones |
| **PBR** | Physically Based Rendering, simulation realiste de l'eclairage |
| **Metalness** | 0 = dielectrique (plastique, bois), 1 = metal pur |
| **Roughness** | 0 = surface miroir, 1 = surface mate |
| **Clearcoat** | Couche de vernis transparente par-dessus le materiau |
| **HDRI** | Image panoramique haute dynamique, sert d'environnement |
| **Tone mapping** | Compression des hautes lumieres pour l'affichage ecran |
| **FOV** | Field of view, angle de vision de la camera (en degres) |
| **dpr** | Device pixel ratio, densite de pixels physiques vs CSS |
| **Mipmap** | Versions pre-reduites d'une texture pour le filtrage |
| **Anisotropy** | Qualite de filtrage des textures vues sous un angle |
| **Frame** | Une image de la boucle de rendu (60 par seconde) |
| **Group** | Conteneur Three.js qui groupe et transforme ses enfants |

---

## Pour aller plus loin

- **Three.js Journey** (https://threejs-journey.com) : la formation de reference, payante mais excellente
- **Three.js docs** (https://threejs.org/docs/) : la doc officielle (un peu seche)
- **React Three Fiber docs** (https://r3f.docs.pmnd.rs/) : doc du binding React
- **Bruno Simon sur YouTube** : auteur de Three.js Journey, tres pedagogue
- **Threejs-Resources** sur GitHub : index communautaire d'exemples et de ressources

Le mieux pour apprendre : ouvrir les exemples sur https://threejs.org/examples/ et "voir le code source" sur ceux qui t'intriguent.
