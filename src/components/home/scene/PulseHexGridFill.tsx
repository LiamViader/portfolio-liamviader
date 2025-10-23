import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HexGridParams } from "./PulseHexGridOverlapLine";

/** Optional fine-tuning (all fields optional). Pass as <PulseHexGridFill tuning={{ ... }} /> */
export type FillTuning = {
  /** Inner fill min/max scale (<= 1 keeps it inside the border) */
  fillScaleMin?: number;   // default 0.55
  fillScaleMax?: number;   // default 0.95
  /** Inner fill opacity range (never reaches 1 if max < 1) */
  fillAlphaMin?: number;   // default 0.10
  fillAlphaMax?: number;   // default 0.85
  /** Line (edge) opacity range */
  lineAlphaMin?: number;   // default 0.12
  lineAlphaMax?: number;   // default 0.82
  /** Base pulse frequency in Hz-ish (visual). Each cell jitters this value */
  baseFreq?: number;       // default 0.9
  /** Per-cell frequency jitter factor: 0 = same speed; 0.5 = ±50% */
  freqJitter?: number;     // default 0.35
  /** Extra phase randomness in radians added per cell */
  phaseJitter?: number;    // default Math.PI
  /** Lightness modulation amplitude around params.l (0..1 scale). 0.25 = ±25% */
  lightnessAmp?: number;   // default 0.25
  /** Map size->brightness/opacity inverted so max size = dimmer/fainter */
  invertAtMax?: boolean;   // default true
};

/** Defaults for tuning */
const DEFAULT_TUNING: Required<FillTuning> = {
  fillScaleMin: 0.55,
  fillScaleMax: 0.95,
  fillAlphaMin: 0.10,
  fillAlphaMax: 0.85,
  lineAlphaMin: 0.12,
  lineAlphaMax: 0.82,
  baseFreq: 0.2,
  freqJitter: 0.35,
  phaseJitter: Math.PI,
  lightnessAmp: 0.25,
  invertAtMax: true,
};

type Cell = {
  idx: number;
  row: number;
  col: number;
  cx: number;
  cy: number;
  /** Each cell has its own random phase (0..2π) */
  phase: number;
  /** Each cell has its own speed multiplier, e.g. 0.7..1.3 */
  speed: number;
  hue01: number; // 0..1
};

type Edge = {
  a: THREE.Vector3; // endpoint A
  b: THREE.Vector3; // endpoint B
  cellA: number;
  cellB?: number;
};

/** Shared-edge line shader (supports per-vertex RGB + per-vertex alpha) */
function makeLineShaderMaterial(): THREE.ShaderMaterial {
  const vertexShader = /* glsl */`
    attribute vec3 color;
    attribute float alpha;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vColor = color;
      vAlpha = alpha;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = /* glsl */`
    precision mediump float;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uOpacity; // global multiplier
    void main() {
      gl_FragColor = vec4(vColor, vAlpha * uOpacity);
      // if (gl_FragColor.a < 0.02) discard; // optional hard cutoff
    }
  `;
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uOpacity: { value: 1.0 } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}

/** One shared-edge line mesh + per-cell inner fills (no columns sync, fully randomised) */
export default function PulseHexGridFill({
  params,
  tuning: userTuning,
}: {
  params: HexGridParams;
  tuning?: FillTuning;
}) {
  const tuning = { ...DEFAULT_TUNING, ...(userTuning ?? {}) };

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

  // Build static grid (cells with random freq/phase, shared edges, and geometries)
  const {
    cells,
    edges,
    lineGeometry,
    fillGeometry, // hex shape centered at (0,0)
    radius,
  } = useMemo(
    () => buildSharedGrid(width, height, params, tuning),
    // rebuild only on density/size changes; color-related params apply at runtime
    [width, height, params.pixelsPerHex]
  );

  /** ===== Lines (shared edges) with per-vertex color + alpha ===== */
  const lineColorsRef = useRef<Float32Array | null>(null);
  const lineAlphasRef = useRef<Float32Array | null>(null);
  const lineColorAttrRef = useRef<THREE.BufferAttribute | null>(null);
  const lineAlphaAttrRef = useRef<THREE.BufferAttribute | null>(null);

  useEffect(() => {
    const colorAttr = lineGeometry.getAttribute("color") as THREE.BufferAttribute;
    const alphaAttr = lineGeometry.getAttribute("alpha") as THREE.BufferAttribute;
    colorAttr.setUsage(THREE.DynamicDrawUsage);
    alphaAttr.setUsage(THREE.DynamicDrawUsage);
    lineColorsRef.current = colorAttr.array as Float32Array;
    lineAlphasRef.current = alphaAttr.array as Float32Array;
    lineColorAttrRef.current = colorAttr;
    lineAlphaAttrRef.current = alphaAttr;
  }, [lineGeometry]);

  const lineMaterial = useMemo(() => makeLineShaderMaterial(), []);

  /** ===== Inner fills (one mesh per cell, simple & clear) ===== */
  const fillGroupRef = useRef<THREE.Group>(null);
  const fillMeshesRef = useRef<THREE.Mesh[]>([]);
  const fillMatsRef = useRef<THREE.MeshBasicMaterial[]>([]);
  const pulsesRef = useRef<Float32Array | null>(null);
  const sNorm = params.s / 100;
  const baseL = params.l / 100; // used as center for lightness modulation

  useEffect(() => {
    const group = fillGroupRef.current;
    if (!group) return;

    // cleanup old meshes/materials
    group.clear();
    fillMeshesRef.current = [];
    fillMatsRef.current = [];

    pulsesRef.current = new Float32Array(cells.length);

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(cell.hue01, sNorm, baseL),
        transparent: true,
        opacity: tuning.fillAlphaMin,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      });

      const mesh = new THREE.Mesh(fillGeometry, mat);
      mesh.position.set(cell.cx, cell.cy, -0.5); // behind lines
      mesh.scale.setScalar(tuning.fillScaleMin * radius);
      group.add(mesh);

      fillMeshesRef.current.push(mesh);
      fillMatsRef.current.push(mat);
    }
  }, [cells, fillGeometry, radius, sNorm, baseL, tuning.fillScaleMin]);

  /** ===== Animation loop ===== */
  const groupRef = useRef<THREE.Group>(null);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Small global motion just so it always feels alive (optional)
    const g = groupRef.current;
    if (g) {
      g.rotation.z = Math.sin(t * 0.18) * 0.04;
      g.position.z = Math.sin(t * 0.22) * 2.5;
    }

    const pulses = pulsesRef.current;
    if (!pulses) return;

    const invertAtMax = tuning.invertAtMax;
    const baseOmega = 2 * Math.PI * tuning.baseFreq;
    const fillScaleMin = tuning.fillScaleMin;
    const fillScaleRange = tuning.fillScaleMax - tuning.fillScaleMin;
    const fillAlphaMin = tuning.fillAlphaMin;
    const fillAlphaRange = tuning.fillAlphaMax - tuning.fillAlphaMin;
    const lineAlphaMin = tuning.lineAlphaMin;
    const lineAlphaRange = tuning.lineAlphaMax - tuning.lineAlphaMin;
    const lightnessAmp = tuning.lightnessAmp;

    /** 1) Per-cell pulse p in [0,1], with unique frequency & phase (no columns) */
    for (let i = 0; i < cells.length; i++) {
      // Each cell: p = 0.5 + 0.5 * sin(2π * f_i * t + phase_i)
      pulses[i] = 0.5 + 0.5 * Math.sin((baseOmega * cells[i].speed) * t + cells[i].phase);
    }

    /** 2) Update fills: scale + opacity + lightness (base L respected) */
    for (let i = 0; i < cells.length; i++) {
      const p = invertAtMax ? 1.0 - pulses[i] : pulses[i]; // invert: bigger -> dimmer/fainter
      const mesh = fillMeshesRef.current[i];
      const mat = fillMatsRef.current[i];
      if (!mesh || !mat) continue;

      // scale stays inside the outline (<= 1.0 * radius)
      const scaleRel = fillScaleMin + fillScaleRange * (1.0 - p);
      mesh.scale.setScalar(scaleRel * radius);

      // opacity never reaches 1 (clamped by tuning.fillAlphaMax)
      mat.opacity = fillAlphaMin + fillAlphaRange * (1.0 - p);

      // lightness around baseL with amplitude (so L is not ignored)
      const L = THREE.MathUtils.clamp(
        baseL + (p - 0.5) * 2.0 * lightnessAmp,
        0.05,
        0.95
      );
      mat.color.setHSL(cells[i].hue01, sNorm, L);
    }

    /** 3) Update shared lines' per-vertex color + alpha (match the fill intent) */
    const colors = lineColorsRef.current;
    const alphas = lineAlphasRef.current;
    if (!colors || !alphas) return;

    const color = tempColor;
    let ci = 0, ai = 0;

    for (let e = 0; e < edges.length; e++) {
      const edge = edges[e];

      // endpoint A uses cellA pulse/hue
      const pA = invertAtMax ? 1.0 - pulses[edge.cellA] : pulses[edge.cellA];
      const cA = cells[edge.cellA];
      const LA = THREE.MathUtils.clamp(
        baseL + (pA - 0.5) * 2.0 * lightnessAmp,
        0.05,
        0.95
      );
      const aA = lineAlphaMin + lineAlphaRange * (1.0 - pA);
      color.setHSL(cA.hue01, sNorm, LA);
      colors[ci++] = color.r; colors[ci++] = color.g; colors[ci++] = color.b;
      alphas[ai++] = aA;

      // endpoint B uses neighbor's pulse/hue (or A at boundary)
      const nb = edge.cellB != null ? edge.cellB : edge.cellA;
      const pB = invertAtMax ? 1.0 - pulses[nb] : pulses[nb];
      const cB = cells[nb];
      const LB = THREE.MathUtils.clamp(
        baseL + (pB - 0.5) * 2.0 * lightnessAmp,
        0.05,
        0.95
      );
      const aB = lineAlphaMin + lineAlphaRange * (1.0 - pB);
      color.setHSL(cB.hue01, sNorm, LB);
      colors[ci++] = color.r; colors[ci++] = color.g; colors[ci++] = color.b;
      alphas[ai++] = aB;
    }

    if (lineColorAttrRef.current) lineColorAttrRef.current.needsUpdate = true;
    if (lineAlphaAttrRef.current) lineAlphaAttrRef.current.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* inner fills */}
      <group ref={fillGroupRef} />
      {/* shared edges */}
      <lineSegments geometry={lineGeometry} material={lineMaterial} />
    </group>
  );
}

/* ==================== builders ==================== */

function buildSharedGrid(
  width: number,
  height: number,
  p: HexGridParams,
  tuning: Required<FillTuning>
) {
  // pointy-top hex layout with odd-row horizontal offset
  const radius = p.pixelsPerHex / Math.sqrt(3);
  const hexWidth = Math.sqrt(3) * radius;
  const vSpacing = (3 / 2) * radius;
  const hSpacing = hexWidth;
  
  const margin = Math.ceil((width / hSpacing) * 0.05);

  const columns = Math.ceil(width / hSpacing) + margin;
  const rows = Math.ceil(height / vSpacing) + margin;

  const cells: Cell[] = [];
  const indexOf = (r: number, c: number) => r * columns + c;

  const baseHue01 = (((p.hue % 360) + 360) % 360) / 360;
  const hueJitter01 = Math.abs(p.hueJitter) / 360;

  // Build cells with fully randomised phase & frequency (no column sync)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
      const cx = -width / 2 + c * hSpacing + offsetX;
      const cy = -height / 2 + r * vSpacing - (margin * hexWidth * 0.5);

      // random phase in [0, 2π) — not tied to row/column at all
      const phase = Math.random() * Math.PI * 2 + (Math.random() - 0.5) * tuning.phaseJitter;

      // per-cell speed multiplier (e.g. 0.65 .. 1.35)
      const speed = 1 + (Math.random() * 2 - 1) * tuning.freqJitter;

      const hue01 = wrap01(baseHue01 + (Math.random() * 2 - 1) * hueJitter01);

      cells.push({
        idx: indexOf(r, c),
        row: r,
        col: c,
        cx,
        cy,
        phase,
        speed,
        hue01,
      });
    }
  }

  // Precompute 6 vertices per cell at fixed radius
  const angles = new Array(6).fill(0).map((_, i) => Math.PI / 6 + (i * Math.PI) / 3);
  const verts: THREE.Vector3[][] = cells.map(cell =>
    angles.map(a => new THREE.Vector3(cell.cx + radius * Math.cos(a), cell.cy + radius * Math.sin(a), 0))
  );

  // Unique edges: E(5-0), NE(0-1), SE(4-5)
  const sidePairs: [number, number][] = [
    [5, 0],
    [0, 1],
    [4, 5],
  ];

  const edges: Edge[] = [];
  for (const cell of cells) {
    const nE  = { r: cell.row, c: cell.col + 1 };
    const nNE = cell.row % 2 === 0 ? { r: cell.row - 1, c: cell.col } : { r: cell.row - 1, c: cell.col + 1 };
    const nSE = cell.row % 2 === 0 ? { r: cell.row + 1, c: cell.col } : { r: cell.row + 1, c: cell.col + 1 };
    const neighbors = [nE, nNE, nSE];

    for (let s = 0; s < 3; s++) {
      const [i0, i1] = sidePairs[s];
      const a = verts[cell.idx][i0];
      const b = verts[cell.idx][i1];

      const n = neighbors[s];
      const neighborIdx =
        n.r >= 0 && n.r < rows && n.c >= 0 && n.c < columns ? indexOf(n.r, n.c) : undefined;

      edges.push({ a: a.clone(), b: b.clone(), cellA: cell.idx, cellB: neighborIdx });
    }
  }

  // Build LineSegments geometry with per-vertex color + alpha
  const positions = new Float32Array(edges.length * 2 * 3);
  const colors    = new Float32Array(edges.length * 2 * 3);
  const alphas    = new Float32Array(edges.length * 2);
  let pi = 0;

  for (const e of edges) {
    positions[pi++] = e.a.x; positions[pi++] = e.a.y; positions[pi++] = e.a.z;
    positions[pi++] = e.b.x; positions[pi++] = e.b.y; positions[pi++] = e.b.z;
  }

  // init (dim); runtime will overwrite every frame
  for (let i = 0; i < colors.length; i += 3) {
    colors[i + 0] = 0.25; colors[i + 1] = 0.30; colors[i + 2] = 0.35;
  }
  for (let i = 0; i < alphas.length; i++) {
    alphas[i] = 0.4;
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  lineGeometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));
  lineGeometry.setAttribute("alpha",    new THREE.BufferAttribute(alphas, 1));
  lineGeometry.computeBoundingSphere();

  // Single hex shape (radius=1) — we scale by `radius` at runtime
  const shape = new THREE.Shape();
  shape.moveTo(Math.cos(angles[0]), Math.sin(angles[0]));
  for (let i = 1; i < 6; i++) shape.lineTo(Math.cos(angles[i]), Math.sin(angles[i]));
  shape.closePath();
  const unitFill = new THREE.ShapeGeometry(shape);

  return { cells, edges, lineGeometry, fillGeometry: unitFill, radius };
}

/* ==================== utils ==================== */

function wrap01(n: number) {
  return (n % 1 + 1) % 1;
}
