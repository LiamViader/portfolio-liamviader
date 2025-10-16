import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { HexGridParams } from "./PulseHexGridOverlapLine"; // reutiliza tu tipo

export type TrailOptions = {
  /** Número de trails simultáneos */
  trailCount?: number;        // default 3
  /** Velocidad de avance en aristas por segundo */
  stepsPerSecond?: number;    // default 20
  /** Segundos que tarda en desvanecerse una arista “encendida” */
  fadeSeconds?: number;       // default 1.6
  /** Evitar retroceder inmediatamente por la misma arista */
  avoidBacktrack?: boolean;   // default true
  /** Cuánto jitter de color por arista (± grados HSL) */
  hueJitter?: number;         // default = params.hueJitter
};

type Vertex = { x: number; y: number; };
type Edge = { a: number; b: number; }; // índices a vertices[]
type Graph = {
  vertices: Vertex[];
  edges: Edge[];
  edgesByVertex: number[][]; // lista de ids de aristas por vértice
  positions: Float32Array;   // 2 * edges * vec3
  colors: Float32Array;      // 2 * edges * vec3
  alphas: Float32Array;      // 2 * edges * float
  geometry: THREE.BufferGeometry;
  radius: number;
};

type Trail = {
  edge: number;   // arista actual
  at: number;     // cabeza en vértice: 0 -> en A; 1 -> en B (para selección de siguiente)
  tAccum: number; // acumulador de tiempo para step discreto
};

/** Shader de líneas con color por vértice y alpha por vértice */
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
    uniform float uOpacity; // multiplicador global
    void main() {
      gl_FragColor = vec4(vColor, vAlpha * uOpacity);
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

export default function HexGridTrails({
  params,
  options,
}: {
  params: HexGridParams;
  options?: TrailOptions;
}) {
  const opts: Required<TrailOptions> = {
    trailCount: options?.trailCount ?? 3,
    stepsPerSecond: options?.stepsPerSecond ?? 20,
    fadeSeconds: options?.fadeSeconds ?? 1.6,
    avoidBacktrack: options?.avoidBacktrack ?? true,
    hueJitter: options?.hueJitter ?? params.hueJitter,
  };

  const { size, camera, gl } = useThree();
  const dpr = gl.getPixelRatio();
  const width = size.width / dpr;
  const height = size.height / dpr;

  // Cámara ortográfica alineada al canvas (espacio pixel)
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, width, height]);

  // Construir grafo del hex grid y geometría de LineSegments
  const graph = useMemo(
    () => buildHexGraph(width, height, params, opts.hueJitter),
    [width, height, params.pixelsPerHex, params.hue, opts.hueJitter, params.s, params.l]
  );

  // Material shader
  const lineMat = useMemo(() => makeLineShaderMaterial(), []);

  // Guardamos referencias a arrays mutables para actualizar alphas sin recrear nada
  const alphasRef = useRef<Float32Array | null>(null);
  useEffect(() => {
    const alphaAttr = graph.geometry.getAttribute("alpha") as THREE.BufferAttribute;
    alphaAttr.setUsage(THREE.DynamicDrawUsage);
    alphasRef.current = alphaAttr.array as Float32Array;
  }, [graph.geometry]);

  // Estado de trails
  const trailsRef = useRef<Trail[]>([]);
  const hotEdges = useRef<Map<number, number>>(new Map()); // edgeId -> alpha (0..1)

  // (re)spawn trails cuando cambia el grafo
  useEffect(() => {
    trailsRef.current = [];
    hotEdges.current.clear();
    const totalEdges = graph.edges.length;
    if (totalEdges === 0) return;
    for (let i = 0; i < opts.trailCount; i++) {
      const e = Math.floor(Math.random() * totalEdges);
      trailsRef.current.push({ edge: e, at: Math.random() < 0.5 ? 0 : 1, tAccum: 0 });
    }
    // arrancar con una chispa inicial
    for (const tr of trailsRef.current) lightUpEdge(graph, tr.edge, hotEdges.current);
    // limpiar alphas visibles a 0
    const a = alphasRef.current!;
    a.fill(0);
    (graph.geometry.getAttribute("alpha") as THREE.BufferAttribute).needsUpdate = true;
  }, [graph, opts.trailCount]);

  // Animación
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const g = groupRef.current;
    const t = state.clock.getElapsedTime();
    if (g) {
      g.rotation.z = Math.sin(t * 0.18) * 0.04;
      g.position.z = Math.sin(t * 0.18) * 3.0;
    }

    // 1) Avance discreto por aristas (step cuando tAccum supera 1/stepsPerSecond)
    const stepDt = 1 / Math.max(1e-4, opts.stepsPerSecond);
    for (const tr of trailsRef.current) {
      tr.tAccum += dt;
      if (tr.tAccum >= stepDt) {
        tr.tAccum -= stepDt;
        // Elegir siguiente arista desde el vértice actual
        const next = pickNextEdge(graph, tr.edge, tr.at, opts.avoidBacktrack);
        if (next === null) {
          // respawn en una arista aleatoria
          tr.edge = Math.floor(Math.random() * graph.edges.length);
          tr.at = Math.random() < 0.5 ? 0 : 1;
        } else {
          tr.edge = next.edge;
          tr.at = next.at;
        }
        lightUpEdge(graph, tr.edge, hotEdges.current);
      }
    }

    // 2) Decaimiento de alphas SOLO para aristas activas
    const decay = Math.exp(-dt / Math.max(1e-4, opts.fadeSeconds));
    const a = alphasRef.current!;
    let dirty = false;
    for (const [eid, val] of hotEdges.current) {
      const newVal = val * decay;
      if (newVal < 0.01) {
        hotEdges.current.delete(eid);
        // set a 0 para ambos extremos de la arista
        const i = eid * 2;
        a[i + 0] = 0;
        a[i + 1] = 0;
        dirty = true;
      } else {
        hotEdges.current.set(eid, newVal);
        const i = eid * 2;
        a[i + 0] = newVal;
        a[i + 1] = newVal;
        dirty = true;
      }
    }
    if (dirty) (graph.geometry.getAttribute("alpha") as THREE.BufferAttribute).needsUpdate = true;
  });

  // Render
  return (
    <group ref={groupRef} frustumCulled={false}>
      <lineSegments geometry={graph.geometry} material={lineMat} frustumCulled={false} renderOrder={1} />
    </group>
  );
}

/* ================= helpers ================= */

function buildHexGraph(
  width: number,
  height: number,
  p: HexGridParams,
  hueJitterDeg: number
): Graph {
  const vertices: Vertex[] = [];
  const edges: Edge[] = [];
  const edgesByVertex: number[][] = [];

  // Layout igual que en tus otros fondos (pointy-top, desplazamiento en filas impares)
  const radius = p.pixelsPerHex / Math.sqrt(3);
  const hexWidth = Math.sqrt(3) * radius;
  const vSpacing = (3 / 2) * radius;
  const hSpacing = hexWidth;
  const margin = Math.ceil((width / hSpacing) * 0.05);
  const cols = Math.ceil(width / hSpacing) + margin;
  const rows = Math.ceil(height / vSpacing) + margin;

  const VERT_KEY_PREC = 4; // evita duplicados numéricos
  const key = (x: number, y: number) => `${x.toFixed(VERT_KEY_PREC)}|${y.toFixed(VERT_KEY_PREC)}`;
  const vIndex = new Map<string, number>();

  const baseHue01 = (((p.hue % 360) + 360) % 360) / 360;
  const jitter01 = Math.abs(hueJitterDeg) / 360;
  const sNorm = p.s / 100;
  const lNorm = p.l / 100;

  // Precomputa los 6 ángulos del hex
  const ang: number[] = [];
  for (let i = 0; i < 6; i++) ang.push(Math.PI / 6 + (i * Math.PI) / 3);

  // Crea vértices y aristas únicas (E, NE, SE) por celda
  const sidePairs: [number, number][] = [
    [5, 0], // E (horizontal)
    [0, 1], // NE
    [4, 5], // SE
  ];

  function getOrCreateVertex(x: number, y: number): number {
    const k = key(x, y);
    let idx = vIndex.get(k);
    if (idx !== undefined) return idx;
    idx = vertices.length;
    vertices.push({ x, y });
    edgesByVertex.push([]);
    vIndex.set(k, idx);
    return idx;
  }

  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
      const cx = -width / 2 + c * hSpacing + offsetX;
      const cy = -height / 2 + r * vSpacing - (margin * hexWidth * 0.5);

      const vx = ang.map(a => cx + radius * Math.cos(a));
      const vy = ang.map(a => cy + radius * Math.sin(a));

      for (const [i0, i1] of sidePairs) {
        const a = getOrCreateVertex(vx[i0], vy[i0]);
        const b = getOrCreateVertex(vx[i1], vy[i1]);
        const eid = edges.length;
        edges.push({ a, b });
        edgesByVertex[a].push(eid);
        edgesByVertex[b].push(eid);
      }
    }
  }

  // Construye atributos de LineSegments: pos(2*edges), color(2*edges), alpha(2*edges)
  const positions = new Float32Array(edges.length * 2 * 3);
  const colors    = new Float32Array(edges.length * 2 * 3);
  const alphas    = new Float32Array(edges.length * 2);
  let pi = 0, ci = 0;

  const color = new THREE.Color();
  for (let e = 0; e < edges.length; e++) {
    const { a, b } = edges[e];
    const va = vertices[a], vb = vertices[b];
    positions[pi++] = va.x; positions[pi++] = va.y; positions[pi++] = 0;
    positions[pi++] = vb.x; positions[pi++] = vb.y; positions[pi++] = 0;

    // Color por arista con jitter de H: ligero degradado entre extremos
    const h0 = wrap01(baseHue01 + (Math.random() * 2 - 1) * jitter01);
    const h1 = wrap01(baseHue01 + (Math.random() * 2 - 1) * jitter01);
    color.setHSL(h0, sNorm, lNorm);
    colors[ci++] = color.r; colors[ci++] = color.g; colors[ci++] = color.b;
    color.setHSL(h1, sNorm, lNorm);
    colors[ci++] = color.r; colors[ci++] = color.g; colors[ci++] = color.b;
  }
  // al principio invisible
  alphas.fill(0);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("alpha",    new THREE.BufferAttribute(alphas, 1));
  geometry.computeBoundingSphere();

  return { vertices, edges, edgesByVertex, positions, colors, alphas, geometry, radius };
}

// elige próxima arista desde el vértice de salida
function pickNextEdge(graph: Graph, edge: number, at: number, avoidBacktrack: boolean): { edge: number; at: number } | null {
  const { edges, edgesByVertex } = graph;
  const e = edges[edge];
  const v = at === 0 ? e.a : e.b;          // vértice actual
  const prev = edge;                        // arista por la que llegamos
  const candidates = edgesByVertex[v].filter(eid => !avoidBacktrack || eid !== prev);
  if (candidates.length === 0) return null;
  const next = candidates[(Math.random() * candidates.length) | 0];
  // nueva orientación: si next.a == v, avanzamos hacia next.b => at = 1; si no, hacia a => at = 0
  const n = edges[next];
  const nextAt = (n.a === v) ? 1 : 0;
  return { edge: next, at: nextAt };
}

// ilumina (pone alpha=1) una arista y la marca como activa para que se desvanezca
function lightUpEdge(graph: Graph, edgeId: number, hot: Map<number, number>) {
  hot.set(edgeId, 1);
  const a = (graph.geometry.getAttribute("alpha") as THREE.BufferAttribute).array as Float32Array;
  const i = edgeId * 2;
  a[i + 0] = 1;
  a[i + 1] = 1;
  (graph.geometry.getAttribute("alpha") as THREE.BufferAttribute).needsUpdate = true;
}

function wrap01(n: number) {
  return (n % 1 + 1) % 1;
}
