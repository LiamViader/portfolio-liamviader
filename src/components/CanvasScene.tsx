"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type HexData = {
        id: string;
        position: [number, number, number];
        baseScale: number;
        phase: number;
        depthOffset: number;
        hue: number;
        rotation: number;
        baseOpacity: number;
};

const createUnitHexGeometry = () => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < 6; i += 1) {
                const angle = Math.PI / 6 + (i * Math.PI) / 3;
                points.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0));
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(points);
        return geometry;
};

const generateHexGrid = (width: number, height: number): HexData[] => {
        if (width === 0 || height === 0) {
                return [];
        }

        const minDimension = Math.min(width, height);
        const radius = Math.max(14, Math.min(minDimension / 36, 24));
        const hexWidth = Math.sqrt(3) * radius;
        const verticalSpacing = (3 / 2) * radius;
        const horizontalSpacing = hexWidth;
        const columns = Math.ceil(width / horizontalSpacing) + 2;
        const rows = Math.ceil(height / verticalSpacing) + 2;

        const hexes: HexData[] = [];

        for (let row = -1; row < rows; row += 1) {
                for (let column = -1; column < columns; column += 1) {
                        const offsetX = row % 2 !== 0 ? horizontalSpacing / 2 : 0;
                        const x = -width / 2 + column * horizontalSpacing + offsetX;
                        const y = -height / 2 + row * verticalSpacing;
                        const z = (Math.random() - 0.5) * 80;

                        hexes.push({
                                id: `${row}-${column}-${hexes.length}`,
                                position: [x, y, z],
                                baseScale: radius * (0.9 + Math.random() * 0.4),
                                phase: Math.random() * Math.PI * 2,
                                depthOffset: Math.random() * 6,
                                hue: 0.5 + Math.random() * 0.08,
                                rotation: (Math.random() - 0.5) * 0.15,
                                baseOpacity: 0.32 + Math.random() * 0.12,
                        });
                }
        }

        return hexes;
};

function HexLoop({ data, geometry }: { data: HexData; geometry: THREE.BufferGeometry }) {
        const lineRef = useRef<THREE.LineLoop>(null);
        const materialRef = useRef<THREE.LineBasicMaterial>(null);
        const initialColor = useMemo(() => {
                const color = new THREE.Color();
                color.setHSL(data.hue, 0.55, 0.58);
                return color;
        }, [data.hue]);

        useEffect(() => {
                const line = lineRef.current;
                if (line) {
                        line.scale.setScalar(data.baseScale);
                }
        }, [data.baseScale]);

        useEffect(() => {
                const material = materialRef.current;
                if (material) {
                        material.color.copy(initialColor);
                }
        }, [initialColor]);

        useFrame(({ clock }) => {
                const elapsed = clock.getElapsedTime();
                const line = lineRef.current;
                const material = materialRef.current;
                if (!line || !material) return;

                const pulse = 1 + 0.08 * Math.sin(elapsed * 2.2 + data.phase);
                line.scale.setScalar(data.baseScale * pulse);
                line.position.z = data.position[2] + Math.sin(elapsed * 1.4 + data.phase) * data.depthOffset;

                const brightness = 0.45 + 0.18 * Math.sin(elapsed * 1.7 + data.phase);
                const clampedBrightness = THREE.MathUtils.clamp(brightness, 0.3, 0.7);
                material.color.setHSL(data.hue, 0.6, clampedBrightness);

                const opacity = data.baseOpacity + 0.25 * Math.sin(elapsed * 1.9 + data.phase);
                material.opacity = THREE.MathUtils.clamp(opacity, 0.15, 0.55);
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
                                ref={materialRef}
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

function HexGrid() {
        const { size, camera, gl } = useThree();
        const dpr = gl.getPixelRatio();
        const width = size.width / dpr;
        const height = size.height / dpr;

        useEffect(() => {
                if (camera instanceof THREE.OrthographicCamera) {
                        camera.left = -width / 2;
                        camera.right = width / 2;
                        camera.top = height / 2;
                        camera.bottom = -height / 2;
                        camera.updateProjectionMatrix();
                }
        }, [camera, width, height]);

        const geometry = useMemo(() => createUnitHexGeometry(), []);

        useEffect(() => () => geometry.dispose(), [geometry]);

        const hexes = useMemo(() => generateHexGrid(Math.floor(width), Math.floor(height)), [width, height]);

        const groupRef = useRef<THREE.Group>(null);
        useFrame(({ clock }) => {
                const elapsed = clock.getElapsedTime();
                const group = groupRef.current;
                if (!group) return;

                group.rotation.z = Math.sin(elapsed * 0.18) * 0.08;
                group.position.z = Math.sin(elapsed * 0.25) * 6;
        });

        return (
                <group ref={groupRef}>
                        {hexes.map((hex) => (
                                <HexLoop key={hex.id} data={hex} geometry={geometry} />
                        ))}
                </group>
        );
}

export default function CanvasScene() {
        return (
                <div className="pointer-events-none absolute inset-0 h-full w-full">
                        <Canvas
                                orthographic
                                dpr={[1, 2]}
                                camera={{ position: [0, 0, 20], near: -1000, far: 1000 }}
                                gl={{ antialias: true, alpha: true }}
                                frameloop="always"
                        >
                                <fog attach="fog" args={["#04060c", 0.0018]} />
                                <Suspense fallback={null}>
                                        <HexGrid />
                                </Suspense>
                        </Canvas>
                </div>
        );
}
