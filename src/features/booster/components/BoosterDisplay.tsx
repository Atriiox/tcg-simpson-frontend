import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// ============================================================
// Types & Interfaces
// ============================================================
interface BoosterDisplayProps {
  imageUrl?: string;
  className?: string; // Pour te permettre d'ajuster la taille depuis le parent via Tailwind
}

interface BoosterBounds {
  u0: number;
  u1: number;
  v0: number;
  v1: number;
  aspect: number;
}

interface BoosterTextures {
  color: THREE.Texture;
  normal: THREE.CanvasTexture;
  bounds: BoosterBounds;
  aspect: number;
}

// ============================================================
// Normal map procédurale (plis du film plastique)
// ============================================================
function generateNormalMap(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const img = ctx.createImageData(W, H);
  const data = img.data;

  const heights = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const h =
        Math.sin(x * 0.025 + y * 0.04) * 0.5 +
        Math.sin(x * 0.06 - y * 0.02) * 0.3 +
        Math.sin(x * 0.13 + y * 0.11) * 0.15 +
        Math.cos(x * 0.018 + y * 0.08) * 0.2;
      heights[y * W + x] = h;
    }
  }

  const SCALE = 2.0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      const hL = heights[Math.max(0, x - 1) + y * W];
      const hR = heights[Math.min(W - 1, x + 1) + y * W];
      const hU = heights[x + Math.max(0, y - 1) * W];
      const hD = heights[x + Math.min(H - 1, y + 1) * W];
      const dx = (hR - hL) * SCALE;
      const dy = (hD - hU) * SCALE;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const nx = -dx / len;
      const ny = -dy / len;
      const nz = 1 / len;
      const i = idx * 4;
      data[i + 0] = (nx * 0.5 + 0.5) * 255;
      data[i + 1] = (ny * 0.5 + 0.5) * 255;
      data[i + 2] = (nz * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// ============================================================
// Détection automatique de la zone du booster
// ============================================================
function detectBoosterBounds(img: HTMLImageElement): BoosterBounds {
  const SAMPLE_W = 200;
  const sampleH = Math.round((SAMPLE_W * img.naturalHeight) / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_W;
  canvas.height = sampleH;
  const ctx = canvas.getContext("2d");

  if (!ctx) return { u0: 0, u1: 1, v0: 0, v1: 1, aspect: 1949 / 2600 };

  ctx.drawImage(img, 0, 0, SAMPLE_W, sampleH);
  const data = ctx.getImageData(0, 0, SAMPLE_W, sampleH).data;

  const isDark = (r: number, g: number, b: number) => (r + g + b) / 3 < 28;
  const ROW_THRESHOLD = 0.92;

  const rowDarkRatio = (y: number) => {
    let n = 0;
    for (let x = 0; x < SAMPLE_W; x++) {
      const i = (y * SAMPLE_W + x) * 4;
      if (isDark(data[i], data[i + 1], data[i + 2])) n++;
    }
    return n / SAMPLE_W;
  };
  const colDarkRatio = (x: number) => {
    let n = 0;
    for (let y = 0; y < sampleH; y++) {
      const i = (y * SAMPLE_W + x) * 4;
      if (isDark(data[i], data[i + 1], data[i + 2])) n++;
    }
    return n / sampleH;
  };

  let minY = 0;
  while (minY < sampleH - 1 && rowDarkRatio(minY) > ROW_THRESHOLD) minY++;
  let maxY = sampleH - 1;
  while (maxY > 0 && rowDarkRatio(maxY) > ROW_THRESHOLD) maxY--;
  let minX = 0;
  while (minX < SAMPLE_W - 1 && colDarkRatio(minX) > ROW_THRESHOLD) minX++;
  let maxX = SAMPLE_W - 1;
  while (maxX > 0 && colDarkRatio(maxX) > ROW_THRESHOLD) maxX--;

  const PAD = 2;
  minX = Math.max(0, minX - PAD);
  minY = Math.max(0, minY - PAD);
  maxX = Math.min(SAMPLE_W - 1, maxX + PAD);
  maxY = Math.min(sampleH - 1, maxY + PAD);

  const u0 = minX / SAMPLE_W;
  const u1 = (maxX + 1) / SAMPLE_W;
  const yTop = minY / sampleH;
  const yBottom = (maxY + 1) / sampleH;

  const w = (u1 - u0) * img.naturalWidth;
  const h = (yBottom - yTop) * img.naturalHeight;
  const aspect = w > 0 && h > 0 ? w / h : 1949 / 2600;

  return { u0, u1, v0: 1 - yBottom, v1: 1 - yTop, aspect };
}

// ============================================================
// Hook de chargement des textures
// ============================================================
function useBoosterTextures(imageUrl: string): BoosterTextures | null {
  const [data, setData] = useState<BoosterTextures | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;

      const bounds = detectBoosterBounds(img);

      const colorTex = new THREE.Texture(img);
      colorTex.colorSpace = THREE.SRGBColorSpace;
      colorTex.anisotropy = 16;
      colorTex.minFilter = THREE.LinearMipmapLinearFilter;
      colorTex.magFilter = THREE.LinearFilter;
      colorTex.wrapS = THREE.ClampToEdgeWrapping;
      colorTex.wrapT = THREE.ClampToEdgeWrapping;
      colorTex.needsUpdate = true;

      const cNormal = document.createElement("canvas");
      cNormal.width = 512;
      cNormal.height = 800;
      generateNormalMap(cNormal);
      const normalTex = new THREE.CanvasTexture(cNormal);
      normalTex.wrapS = THREE.RepeatWrapping;
      normalTex.wrapT = THREE.RepeatWrapping;
      normalTex.anisotropy = 8;
      normalTex.needsUpdate = true;

      setData({
        color: colorTex,
        normal: normalTex,
        bounds,
        aspect: bounds.aspect,
      });
    };
    img.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return data;
}

function buildUVPlane(
  width: number,
  height: number,
  bounds: BoosterBounds,
): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(width, height, 1, 1);
  const uvs = geo.attributes.uv.array as Float32Array;
  const { u0, u1, v0, v1 } = bounds;

  for (let i = 0; i < uvs.length; i += 2) {
    const planeU = uvs[i];
    const planeV = uvs[i + 1];
    uvs[i] = u0 + planeU * (u1 - u0);
    uvs[i + 1] = v0 + planeV * (v1 - v0);
  }
  geo.attributes.uv.needsUpdate = true;
  return geo;
}

// ============================================================
// Composant Mesh 3D
// ============================================================
const PACK_W = 2.0;

function FullBoosterMesh({ textures }: { textures: BoosterTextures }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const bounds = textures.bounds;
  const aspect = textures.aspect;
  const packH = PACK_W / aspect;

  const geo = useMemo(
    () => buildUVPlane(PACK_W, packH, bounds),
    [packH, bounds],
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshPhysicalMaterial
        map={textures.color}
        normalMap={textures.normal}
        normalScale={new THREE.Vector2(0.22, 0.22)}
        metalness={0.15}
        roughness={0.45}
        clearcoat={0.7}
        clearcoatRoughness={0.12}
        envMapIntensity={0.7}
        side={THREE.FrontSide}
        transparent={true}
      />
    </mesh>
  );
}

// ============================================================
// Effet Parallaxe
// ============================================================
interface TiltState {
  rx: number;
  ry: number;
}

function ParallaxGroup({
  tilt,
  children,
}: {
  tilt: TiltState;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x +=
      (tilt.rx - groupRef.current.rotation.x) * 0.08;
    groupRef.current.rotation.y +=
      (tilt.ry - groupRef.current.rotation.y) * 0.08;
  });
  return <group ref={groupRef}>{children}</group>;
}

// ============================================================
// Composant Principal Exporté (Version Epurée Tailwind)
// ============================================================
export default function BoosterDisplay({
  imageUrl = "/booster1.webp",
  className = "w-60 h-85",
}: BoosterDisplayProps) {
  const [tilt, setTilt] = useState<TiltState>({ rx: 0, ry: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const textures = useBoosterTextures(imageUrl);

  const handleHoverMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    setTilt({ rx: -ny * 0.25, ry: nx * 0.3 });
  };

  const handleHoverLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none bg-transparent cursor-grab ${className}`}
      onMouseMove={handleHoverMove}
      onMouseLeave={handleHoverLeave}
    >
      {textures ? (
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6.5], fov: 28 }}
          className="w-full h-full"
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            alpha: true,
          }}
          onCreated={({ gl }) => {
            gl.domElement.style.touchAction = "none";
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 5]} intensity={1.0} />
          <pointLight position={[-4, -2, 3]} intensity={0.4} color="#9b6bff" />
          <pointLight position={[4, -1, 2]} intensity={0.35} color="#ff7a3d" />

          <ParallaxGroup tilt={tilt}>
            <FullBoosterMesh textures={textures} />
          </ParallaxGroup>
        </Canvas>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">
          Chargement du booster...
        </div>
      )}
    </div>
  );
}
