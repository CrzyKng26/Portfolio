"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import NoiseBackground from "./NoiseBackground";
import FloatingParticles from "./FloatingParticles";

export default function Scene() {
  return (
    <div className="fixed inset-0 z-[-1]" style={{ pointerEvents: "none" }}>
      <Canvas
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 2], fov: 50, near: 0.1, far: 10 }}
        dpr={[1, 1.5]}
        style={{ background: "#000" }}
      >
        <NoiseBackground />
        <FloatingParticles />
        <Preload all />
      </Canvas>
    </div>
  );
}
