"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

export default function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const pseudoRandom = (index: number) => {
    const value = Math.sin(index * 12.9898) * 43758.5453;
    return (value - Math.floor(value)) - 0.5;
  };

  const positions = useMemo(
    () => new Float32Array(Array.from({ length: 800 * 3 }, (_, index) => pseudoRandom(index) * 4)),
    []
  );

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#d9ff70"
        size={0.003}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}
