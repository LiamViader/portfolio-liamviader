"use client";

import * as THREE from "three";
import React, { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { HexGridParams } from "./PulseHexGridOverlapLine";

export type TrailOptions = {
  trailCount?: number;        // default 3
  stepsPerSecond?: number;    // default 20
  fadeSeconds?: number;       // default 1.6
  avoidBacktrack?: boolean;   // default true
  hueJitter?: number;         // default = params.hueJitter
};

type Vertex = { x: number; y: number; };
type Edge = { a: number; b: number; };

type Graph = {
  vertices: Vertex[];
  edges: Edge[];
  edgesByVertex: number[][];
  positions: Float32Array;
  colors: Float32Array;
  tLit: Float32Array;               
  geometry: THREE.BufferGeometry;
  radius: number;
};

type Trail = { edge: number; at: number; tAccum: number; };


function makeTrailShaderMaterial(): THREE.ShaderMaterial {
  const vertexShader = /* glsl */`
    attribute vec3 color;
    attribute float tLit;
    varying vec3 vColor;
    varying float vTLit;
    void main() {
      vColor = color;
      vTLit = tLit;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = /* glsl */`
    precision mediump float;
    varying vec3 vColor;
    varying float vTLit;
    uniform float uOpacity;
    uniform float uTime;
    uniform float uFadeSeconds;
    void main(){
      // si nunca se encendió, alpha=0
      float a = (vTLit < 0.0) ? 0.0 : exp(-(uTime - vTLit) / max(1e-4, uFadeSeconds));
      // mismo "corte" efectivo de la versión CPU (<0.01 -> 0)
      a = (a < 0.01) ? 0.0 : a;
      gl_FragColor = vec4(vColor, a * uOpacity);
    }
  `;
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uOpacity: { value: 1.0 },
      uTime: { value: 0 },
      uFadeSeconds: { value: 1.6 },
    },
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

  useLayoutEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, width, height]);

  const { pixelsPerHex, hue, s, l } = params;

  const graph = useMemo(
    () =>
      buildHexGraph(
        width,
        height,
        { pixelsPerHex, hue, s, l } as HexGridParams,
        opts.hueJitter
      ),
    [width, height, pixelsPerHex, hue, s, l, opts.hueJitter]
  );

  const lineMat = useMemo(() => makeTrailShaderMaterial(), []);
  useEffect(() => {
    (lineMat.uniforms.uFadeSeconds as THREE.IUniform<number>).value = opts.fadeSeconds;
  }, [lineMat, opts.fadeSeconds]);

  const tLitAttrRef = useRef<THREE.BufferAttribute | null>(null);
  useEffect(() => {
    const tAttr = graph.geometry.getAttribute("tLit") as THREE.BufferAttribute;
    tAttr.setUsage(THREE.DynamicDrawUsage);
    tLitAttrRef.current = tAttr;
  }, [graph.geometry]);

  const trailsRef = useRef<Trail[]>([]);

  useEffect(() => {
    trailsRef.current = [];
    const totalEdges = graph.edges.length;
    if (totalEdges === 0) return;
    const tArr = (graph.geometry.getAttribute("tLit") as THREE.BufferAttribute).array as Float32Array;
    tArr.fill(-1);
    (graph.geometry.getAttribute("tLit") as THREE.BufferAttribute).needsUpdate = true;

    for (let i = 0; i < opts.trailCount; i++) {
      const e = (Math.random() * totalEdges) | 0;
      trailsRef.current.push({ edge: e, at: Math.random() < 0.5 ? 0 : 1, tAccum: 0 });
    }
  }, [graph, opts.trailCount]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime();
    (lineMat.uniforms.uTime as THREE.IUniform<number>).value = t;

    const g = groupRef.current;
    if (g) {
      g.rotation.z = Math.sin(t * 0.18) * 0.04;
      g.position.z = Math.sin(t * 0.18) * 3.0;
    }

    const stepDt = 1 / Math.max(1e-4, opts.stepsPerSecond);
    let anyLit = false;

    for (const tr of trailsRef.current) {
      tr.tAccum += dt;
      if (tr.tAccum >= stepDt) {
        tr.tAccum -= stepDt;
        const next = pickNextEdgeFast(graph, tr.edge, tr.at, opts.avoidBacktrack);
        if (next === null) {
          tr.edge = (Math.random() * graph.edges.length) | 0;
          tr.at = Math.random() < 0.5 ? 0 : 1;
        } else {
          tr.edge = next.edge;
          tr.at = next.at;
        }
        if (tLitAttrRef.current) {
          const arr = tLitAttrRef.current.array as Float32Array;
          const i = tr.edge * 2;
          arr[i + 0] = t;
          arr[i + 1] = t;
          anyLit = true;
        }
      }
    }

    if (anyLit && tLitAttrRef.current) {
      tLitAttrRef.current.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} frustumCulled={false}>
      <lineSegments geometry={graph.geometry} material={lineMat} frustumCulled={false} renderOrder={1} />
    </group>
  );
}


function buildHexGraph(
  width: number,
  height: number,
  p: HexGridParams,
  hueJitterDeg: number
): Graph {
  const vertices: Vertex[] = [];
  const edges: Edge[] = [];
  const edgesByVertex: number[][] = [];

  const radius = p.pixelsPerHex / Math.sqrt(3);
  const hexWidth = Math.sqrt(3) * radius;
  const vSpacing = (3 / 2) * radius;
  const hSpacing = hexWidth;
  const margin = Math.ceil((width / hSpacing) * 0.05);
  const cols = Math.ceil(width / hSpacing) + margin;
  const rows = Math.ceil(height / vSpacing) + margin;

  const VERT_KEY_PREC = 4;
  const key = (x: number, y: number) => `${x.toFixed(VERT_KEY_PREC)}|${y.toFixed(VERT_KEY_PREC)}`;
  const vIndex = new Map<string, number>();

  const baseHue01 = (((p.hue % 360) + 360) % 360) / 360;
  const jitter01 = Math.abs(hueJitterDeg) / 360;
  const sNorm = p.s / 100;
  const lNorm = p.l / 100;


  const ang: number[] = [];
  for (let i = 0; i < 6; i++) ang.push(Math.PI / 6 + (i * Math.PI) / 3);


  const sidePairs: [number, number][] = [
    [5, 0],
    [0, 1],
    [4, 5],
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

  const positions = new Float32Array(edges.length * 2 * 3);
  const colors    = new Float32Array(edges.length * 2 * 3);
  const tLit      = new Float32Array(edges.length * 2);
  let pi = 0, ci = 0;

  const color = new THREE.Color();
  for (let e = 0; e < edges.length; e++) {
    const { a, b } = edges[e];
    const va = vertices[a], vb = vertices[b];
    positions[pi++] = va.x; positions[pi++] = va.y; positions[pi++] = 0;
    positions[pi++] = vb.x; positions[pi++] = vb.y; positions[pi++] = 0;

    const h0 = wrap01(baseHue01 + (Math.random() * 2 - 1) * jitter01);
    const h1 = wrap01(baseHue01 + (Math.random() * 2 - 1) * jitter01);
    color.setHSL(h0, sNorm, lNorm);
    colors[ci++] = color.r; colors[ci++] = color.g; colors[ci++] = color.b;
    color.setHSL(h1, sNorm, lNorm);
    colors[ci++] = color.r; colors[ci++] = color.g; colors[ci++] = color.b;

    tLit[e * 2 + 0] = -1;
    tLit[e * 2 + 1] = -1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.StaticDrawUsage));
  geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3).setUsage(THREE.StaticDrawUsage));
  geometry.setAttribute("tLit",     new THREE.BufferAttribute(tLit, 1).setUsage(THREE.DynamicDrawUsage));
  geometry.computeBoundingSphere();

  return { vertices, edges, edgesByVertex, positions, colors, tLit, geometry, radius };
}

function pickNextEdgeFast(
  graph: Graph,
  edge: number,
  at: number,
  avoidBacktrack: boolean
): { edge: number; at: number } | null {
  const { edges, edgesByVertex } = graph;
  const e = edges[edge];
  const v = (at === 0) ? e.a : e.b;
  const list = edgesByVertex[v];

  if (!avoidBacktrack) {
    const next = list[(Math.random() * list.length) | 0];
    const n = edges[next];
    return { edge: next, at: (n.a === v) ? 1 : 0 };
  }

  if (list.length === 1 && list[0] === edge) return null;
  let tries = 0;
  let next = list[(Math.random() * list.length) | 0];
  while (next === edge && tries < 4 && list.length > 1) {
    next = list[(Math.random() * list.length) | 0];
    tries++;
  }
  if (next === edge && list.length === 1) return null;
  const n = edges[next];
  return { edge: next, at: (n.a === v) ? 1 : 0 };
}

function wrap01(n: number) {
  return (n % 1 + 1) % 1;
}
