import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Configurable parameters for the grid */
export type HexGridParams = {
  /** Width of each hexagon (flat-to-flat) in pixels; smaller => denser grid */
  pixelsPerHex: number;
  /** Base hue (0–360 degrees in HSL) */
  hue: number;
  /** Random hue variation ±degrees around base hue */
  hueJitter: number;
  /** Base saturation percentage */
  s: number;
  /** Base lightness percentage */
  l: number;
};

type HexData = {
  id: string;
  position: [number, number, number];
  baseScale: number;
  phase: number;
  depthOffset: number;
  hue: number;        // 0..1
  rotation: number;
  baseOpacity: number;
};

export default function PulseHexGridOverlapLine({ params }: { params: HexGridParams }) {
  const { size, camera, gl } = useThree();
  const dpr = gl.getPixelRatio();
  const width = size.width / dpr;
  const height = size.height / dpr;

  // Keep the orthographic camera aligned with canvas size
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, width, height]);

  // Shared hexagon geometry
  const geometry = useMemo(() => createUnitHexGeometry(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const hexes = useMemo(
    () => generateHexGrid(Math.floor(width), Math.floor(height), params),
    [width, height, params.pixelsPerHex, params.hue, params.hueJitter, params.s, params.l]
  );

  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = groupRef.current;
    if (!g) return;
    g.rotation.z = Math.sin(t * 0.18) * 0.08;
    g.position.z = Math.sin(t * 0.25) * 6;
  });

  return (
    <group ref={groupRef}>
      {hexes.map((hex) => (
        <HexLoop key={hex.id} data={hex} geometry={geometry} sPct={params.s} lPct={params.l} />
      ))}
    </group>
  );
}

/* ===== Helpers ===== */

function createUnitHexGeometry() {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 6 + (i * Math.PI) / 3;
    pts.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0));
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints(pts);
  return geometry;
}

/** Create hex data for a given canvas size and parameters */
function generateHexGrid(width: number, height: number, p: HexGridParams): HexData[] {
  if (width === 0 || height === 0) return [];

  const radius = p.pixelsPerHex / Math.sqrt(3);
  const hexWidth = Math.sqrt(3) * radius;  // == p.pixelsPerHex
  const vSpacing = (3 / 2) * radius;
  const hSpacing = hexWidth;
  const columns = Math.ceil(width / hSpacing) + 2;
  const rows = Math.ceil(height / vSpacing) + 2;

  const baseHue01 = (((p.hue % 360) + 360) % 360) / 360;
  const jitter01 = Math.abs(p.hueJitter) / 360;

  const hexes: HexData[] = [];
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < columns; c++) {
      const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
      const x = -width / 2 + c * hSpacing + offsetX;
      const y = -height / 2 + r * vSpacing;
      const z = (Math.random() - 0.5) * 80;

      const hue = wrap01(baseHue01 + (Math.random() * 2 - 1) * jitter01);

      hexes.push({
        id: `${r}-${c}-${hexes.length}`,
        position: [x, y, z],
        baseScale: radius * (0.9 + Math.random() * 0.4),
        phase: Math.random() * Math.PI * 2,
        depthOffset: Math.random() * 6,
        hue,
        rotation: (Math.random() - 0.5) * 0.15,
        baseOpacity: 0.30 + Math.random() * 0.14,
      });
    }
  }
  return hexes;
}

function wrap01(n: number) {
  return (n % 1 + 1) % 1;
}

function HexLoop({
  data,
  geometry,
  sPct,
  lPct,
}: {
  data: HexData;
  geometry: THREE.BufferGeometry;
  sPct: number;
  lPct: number;
}) {
  const lineRef = useRef<THREE.LineLoop>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);

  const initialColor = useMemo(() => {
    const c = new THREE.Color();
    c.setHSL(data.hue, sPct / 100, lPct / 100);
    return c;
  }, [data.hue, sPct, lPct]);

  useEffect(() => {
    if (lineRef.current) lineRef.current.scale.setScalar(data.baseScale);
  }, [data.baseScale]);

  useEffect(() => {
    if (matRef.current) matRef.current.color.copy(initialColor);
  }, [initialColor]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const line = lineRef.current;
    const mat = matRef.current;
    if (!line || !mat) return;

    const pulse = 1 + 0.08 * Math.sin(t * 2.2 + data.phase);
    line.scale.setScalar(data.baseScale * pulse);
    line.position.z = data.position[2] + Math.sin(t * 1.4 + data.phase) * data.depthOffset;

    const bright = 0.45 + 0.18 * Math.sin(t * 1.7 + data.phase);
    mat.color.setHSL(data.hue, sPct / 100, THREE.MathUtils.clamp(bright, 0.3, 0.7));

    const op = data.baseOpacity + 0.25 * Math.sin(t * 1.9 + data.phase);
    mat.opacity = THREE.MathUtils.clamp(op, 0.15, 0.55);
  });

  return (
    <lineLoop
      ref={lineRef}
      position={data.position}
      rotation={[0, 0, data.rotation]}
      renderOrder={1}
      frustumCulled={false}
    >
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial
        ref={matRef}
        color={initialColor}
        transparent
        opacity={data.baseOpacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </lineLoop>
  );
}
