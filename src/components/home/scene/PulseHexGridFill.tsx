"use client";

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
  fillAlphaMax: 0.95,
  lineAlphaMin: 0.12,
  lineAlphaMax: 0.82,
  baseFreq: 0.2,
  freqJitter: 0.9,
  phaseJitter: 0.01,
  lightnessAmp: 0.12,
  invertAtMax: true,
};

// --- SHADERS ---

// Helper function for HSL to RGB inside shader
const hslChunk = /* glsl */`
  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }
`;

/**
 * Shader for the Instanced Hex Fills
 * Handles pulsing size, color, and opacity entirely on GPU.
 */
const FillShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uBaseFreq: { value: 0.2 },
    uFillScaleMin: { value: 0.55 },
    uFillScaleMax: { value: 0.95 },
    uFillAlphaMin: { value: 0.1 },
    uFillAlphaMax: { value: 0.85 },
    uBaseL: { value: 0.5 },
    uLightnessAmp: { value: 0.25 },
    uSaturation: { value: 0.5 },
    uInvert: { value: 1.0 }, // 1.0 = true, 0.0 = false
  },
  vertexShader: /* glsl */`
    precision mediump float;
    
    // Attributes provided by InstancedMesh logic
    attribute float aPhase;
    attribute float aSpeed;
    attribute float aHue;
    attribute vec3 aCenter; // The center position of the hex

    varying vec3 vColor;
    varying float vAlpha;

    uniform float uTime;
    uniform float uBaseFreq;
    uniform float uFillScaleMin;
    uniform float uFillScaleMax;
    uniform float uFillAlphaMin;
    uniform float uFillAlphaMax;
    uniform float uBaseL;
    uniform float uLightnessAmp;
    uniform float uSaturation;
    uniform float uInvert;

    ${hslChunk}

    void main() {
      // 1. Calculate Pulse (0.0 to 1.0)
      float omega = 2.0 * 3.14159 * uBaseFreq * aSpeed;
      float rawSine = sin(omega * uTime + aPhase); // -1 to 1
      float pulse = 0.5 + 0.5 * rawSine; // 0 to 1

      // 2. Inversion logic
      float p = mix(pulse, 1.0 - pulse, uInvert);

      // 3. Scale Logic
      float scaleRel = mix(uFillScaleMin, uFillScaleMax, 1.0 - p);
      
      // Transform position: We scale the vertex relative to (0,0,0) then move it to aCenter
      vec3 transformed = position * scaleRel + aCenter;

      // 4. Color & Alpha Logic
      vAlpha = mix(uFillAlphaMin, uFillAlphaMax, 1.0 - p);
      
      float L = clamp(uBaseL + (p - 0.5) * 2.0 * uLightnessAmp, 0.05, 0.95);
      vColor = hsl2rgb(vec3(aHue, uSaturation, L));

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    precision mediump float;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      gl_FragColor = vec4(vColor, vAlpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
  toneMapped: false,
});

/**
 * Shader for the Lines
 * Interpolates pulse between two connected cells per vertex.
 */
const LineShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uBaseFreq: { value: 0.2 },
    uLineAlphaMin: { value: 0.12 },
    uLineAlphaMax: { value: 0.82 },
    uBaseL: { value: 0.5 },
    uLightnessAmp: { value: 0.25 },
    uSaturation: { value: 0.5 },
    uInvert: { value: 1.0 },
    uGlobalOpacity: { value: 1.0 },
  },
  vertexShader: /* glsl */`
    precision mediump float;

    // Per-vertex attributes (each vertex of the line belongs to a specific cell logically)
    attribute float aPhase;
    attribute float aSpeed;
    attribute float aHue;

    varying vec3 vColor;
    varying float vAlpha;

    uniform float uTime;
    uniform float uBaseFreq;
    uniform float uLineAlphaMin;
    uniform float uLineAlphaMax;
    uniform float uBaseL;
    uniform float uLightnessAmp;
    uniform float uSaturation;
    uniform float uInvert;

    ${hslChunk}

    void main() {
      // Calculate Pulse for this specific vertex's cell
      float omega = 2.0 * 3.14159 * uBaseFreq * aSpeed;
      float rawSine = sin(omega * uTime + aPhase);
      float pulse = 0.5 + 0.5 * rawSine;

      float p = mix(pulse, 1.0 - pulse, uInvert);

      // Alpha
      vAlpha = mix(uLineAlphaMin, uLineAlphaMax, 1.0 - p);

      // Lightness / Color
      float L = clamp(uBaseL + (p - 0.5) * 2.0 * uLightnessAmp, 0.05, 0.95);
      vColor = hsl2rgb(vec3(aHue, uSaturation, L));

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    precision mediump float;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uGlobalOpacity;

    void main() {
      gl_FragColor = vec4(vColor, vAlpha * uGlobalOpacity);
    }
  `,
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
  toneMapped: false,
});


// --- COMPONENT ---

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

  // Camera setup
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, width, height]);

  // Build Geometry Data once
  const { fillData, lineData, fillGeometry, radius } = useMemo(
    () => buildOptimizedGrid(width, height, params, tuning),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, height, params.pixelsPerHex]
  );

  // References to materials to update uniforms
  const fillMatRef = useRef<THREE.ShaderMaterial>(null);
  const lineMatRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Clone materials per instance to avoid conflicts if used multiple times
  const activeFillMat = useMemo(() => FillShaderMaterial.clone(), []);
  const activeLineMat = useMemo(() => LineShaderMaterial.clone(), []);

  // Sync Uniforms
  useEffect(() => {
    activeFillMat.uniforms.uBaseFreq.value = tuning.baseFreq;
    activeFillMat.uniforms.uFillScaleMin.value = tuning.fillScaleMin;
    activeFillMat.uniforms.uFillScaleMax.value = tuning.fillScaleMax;
    activeFillMat.uniforms.uFillAlphaMin.value = tuning.fillAlphaMin;
    activeFillMat.uniforms.uFillAlphaMax.value = tuning.fillAlphaMax;
    activeFillMat.uniforms.uBaseL.value = params.l / 100;
    activeFillMat.uniforms.uLightnessAmp.value = tuning.lightnessAmp;
    activeFillMat.uniforms.uSaturation.value = params.s / 100;
    activeFillMat.uniforms.uInvert.value = tuning.invertAtMax ? 1.0 : 0.0;

    activeLineMat.uniforms.uBaseFreq.value = tuning.baseFreq;
    activeLineMat.uniforms.uLineAlphaMin.value = tuning.lineAlphaMin;
    activeLineMat.uniforms.uLineAlphaMax.value = tuning.lineAlphaMax;
    activeLineMat.uniforms.uBaseL.value = params.l / 100;
    activeLineMat.uniforms.uLightnessAmp.value = tuning.lightnessAmp;
    activeLineMat.uniforms.uSaturation.value = params.s / 100;
    activeLineMat.uniforms.uInvert.value = tuning.invertAtMax ? 1.0 : 0.0;
  }, [tuning, params, activeFillMat, activeLineMat]);

  // Animation Loop (Zero CPU logic, just uniform update)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Group movement
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.18) * 0.04;
      groupRef.current.position.z = Math.sin(t * 0.22) * 2.5;
    }

    // Update time uniform
    activeFillMat.uniforms.uTime.value = t;
    activeLineMat.uniforms.uTime.value = t;
  });

  return (
    <group ref={groupRef}>
      {/* FILL MESHES (Instanced) */}
      <instancedMesh 
        args={[fillGeometry, activeFillMat, fillData.count]}
        frustumCulled={false}
      >
        {/* NOTA: Usamos "geometry-attributes-nombre" porque el padre es la Mesh, 
            pero queremos adjuntar el atributo a la geometría de esa Mesh.
        */}
        <instancedBufferAttribute attach="geometry-attributes-aCenter" args={[fillData.centers, 3]} />
        <instancedBufferAttribute attach="geometry-attributes-aPhase" args={[fillData.phases, 1]} />
        <instancedBufferAttribute attach="geometry-attributes-aSpeed" args={[fillData.speeds, 1]} />
        <instancedBufferAttribute attach="geometry-attributes-aHue" args={[fillData.hues, 1]} />
      </instancedMesh>

      {/* LINE MESHES (Single LineSegments) */}
      <lineSegments material={activeLineMat}>
        <bufferGeometry>
          {/* SOLUCIÓN DEL ERROR:
             Usamos args={[array, itemSize]} en lugar de pasar las props sueltas.
          */}
          <bufferAttribute attach="attributes-position" args={[lineData.positions, 3]} />
          <bufferAttribute attach="attributes-aPhase" args={[lineData.phases, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[lineData.speeds, 1]} />
          <bufferAttribute attach="attributes-aHue" args={[lineData.hues, 1]} />
        </bufferGeometry>
      </lineSegments>
    </group>
  );
}

// --- DATA GENERATION (Run once) ---

function buildOptimizedGrid(
  width: number,
  height: number,
  p: HexGridParams,
  tuning: Required<FillTuning>
) {
  const radius = p.pixelsPerHex / Math.sqrt(3);
  const hexWidth = Math.sqrt(3) * radius;
  const vSpacing = (3 / 2) * radius;
  const hSpacing = hexWidth;
  
  const margin = Math.ceil((width / hSpacing) * 0.05);
  const columns = Math.ceil(width / hSpacing) + margin;
  const rows = Math.ceil(height / vSpacing) + margin;

  // Basic Cell Data container
  type CellData = {
    row: number;
    col: number;
    cx: number;
    cy: number;
    phase: number;
    speed: number;
    hue01: number;
  };
  
  const cells: CellData[] = [];
  // Mapping 'row,col' string to index for edge building
  const cellMap = new Map<string, number>();

  const baseHue01 = (((p.hue % 360) + 360) % 360) / 360;
  const hueJitter01 = Math.abs(p.hueJitter) / 360;

  // Wrapper to keep 0..1 range
  const wrap01 = (n: number) => (n % 1 + 1) % 1;

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
      const cx = -width / 2 + c * hSpacing + offsetX;
      const cy = -height / 2 + r * vSpacing - (margin * hexWidth * 0.5);

      const phase = Math.random() * Math.PI * 2 + (Math.random() - 0.5) * tuning.phaseJitter;
      const speed = 1 + (Math.random() * 2 - 1) * tuning.freqJitter;
      const hue01 = wrap01(baseHue01 + (Math.random() * 2 - 1) * hueJitter01);

      cells.push({ row: r, col: c, cx, cy, phase, speed, hue01 });
      cellMap.set(`${r},${c}`, idx++);
    }
  }

  // --- PREPARE FILL DATA (Instanced Arrays) ---
  const count = cells.length;
  const centers = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const hues = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const c = cells[i];
    centers[i * 3 + 0] = c.cx;
    centers[i * 3 + 1] = c.cy;
    centers[i * 3 + 2] = -0.5; // Z depth

    phases[i] = c.phase;
    speeds[i] = c.speed;
    hues[i] = c.hue01;
  }

  // Define the Single Hex Geometry (Unit shape centered at 0,0)
  const angles = new Array(6).fill(0).map((_, i) => Math.PI / 6 + (i * Math.PI) / 3);
  const shape = new THREE.Shape();
  shape.moveTo(Math.cos(angles[0]) * radius, Math.sin(angles[0]) * radius);
  for (let i = 1; i < 6; i++) shape.lineTo(Math.cos(angles[i]) * radius, Math.sin(angles[i]) * radius);
  shape.closePath();
  const fillGeometry = new THREE.ShapeGeometry(shape);


  // --- PREPARE LINE DATA ---
  // We need to construct edges. Each edge connects two vertices.
  // Vertex 1 gets params from Cell A, Vertex 2 gets params from Cell B.
  
  // Calculate vertices for a cell function
  const getVerts = (cx: number, cy: number) => 
    angles.map(a => ({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) }));

  // Connections logic (Right, TopRight, BottomRight) to avoid duplicates
  const sidePairs = [[5, 0], [0, 1], [4, 5]]; // Indicies of the hex corners to draw
  
  const linePositions: number[] = [];
  const linePhases: number[] = [];
  const lineSpeeds: number[] = [];
  const lineHues: number[] = [];

  for (let i = 0; i < count; i++) {
    const cell = cells[i];
    const cVerts = getVerts(cell.cx, cell.cy);
    
    // Neighbors
    const nE  = { r: cell.row, c: cell.col + 1 };
    const nNE = cell.row % 2 === 0 ? { r: cell.row - 1, c: cell.col } : { r: cell.row - 1, c: cell.col + 1 };
    const nSE = cell.row % 2 === 0 ? { r: cell.row + 1, c: cell.col } : { r: cell.row + 1, c: cell.col + 1 };
    const neighbors = [nE, nNE, nSE];

    for (let s = 0; s < 3; s++) {
      // Geometry coords
      const [vIdx1, vIdx2] = sidePairs[s];
      const p1 = cVerts[vIdx1];
      const p2 = cVerts[vIdx2];

      // Logic:
      // Point 1 is part of the current cell.
      // Point 2 is part of the current cell, but also connects to the neighbor.
      // However, for gradients to work like the original, we want:
      // Vertex A of the line to have props of Cell A.
      // Vertex B of the line to have props of Cell B (if it exists, else Cell A).
      
      const n = neighbors[s];
      const nKey = `${n.r},${n.c}`;
      const hasNeighbor = cellMap.has(nKey);
      const neighborIdx = hasNeighbor ? cellMap.get(nKey)! : i;
      const neighborCell = cells[neighborIdx];

      // Push Vertex A (Start of line) -> Bound to Current Cell
      linePositions.push(p1.x, p1.y, 0);
      linePhases.push(cell.phase);
      lineSpeeds.push(cell.speed);
      lineHues.push(cell.hue01);

      // Push Vertex B (End of line) -> Bound to Neighbor Cell (or current if edge)
      linePositions.push(p2.x, p2.y, 0);
      linePhases.push(neighborCell.phase);
      lineSpeeds.push(neighborCell.speed);
      lineHues.push(neighborCell.hue01);
    }
  }

  return {
    radius,
    fillGeometry,
    fillData: { count, centers, phases, speeds, hues },
    lineData: { 
      positions: new Float32Array(linePositions),
      phases: new Float32Array(linePhases),
      speeds: new Float32Array(lineSpeeds),
      hues: new Float32Array(lineHues)
    }
  };
}