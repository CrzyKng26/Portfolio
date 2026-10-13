"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8776, 0.4794, -0.4794, 0.8776);
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = rot * p * 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.08;

    vec2 q = vec2(fbm(uv * 3.0 + t), fbm(uv * 3.0 + vec2(5.2, 1.3) + t * 0.7));
    vec2 r = vec2(
      fbm(uv * 3.0 + 4.0 * q + vec2(1.7, 9.2) + t * 0.2),
      fbm(uv * 3.0 + 4.0 * q + vec2(8.3, 2.8) + t * 0.3)
    );
    float f = fbm(uv * 3.0 + 4.0 * r);

    // Ultra-dark cinematic palette
    vec3 c1 = vec3(0.008, 0.007, 0.006);  // near-black
    vec3 c2 = vec3(0.025, 0.018, 0.014);  // warm charcoal
    vec3 c3 = vec3(0.07, 0.035, 0.025);    // burnt umber
    vec3 c4 = vec3(0.11, 0.055, 0.035);    // soft ember

    vec3 color = mix(c1, c2, clamp(f * 2.0, 0.0, 1.0));
    color = mix(color, c3, clamp(length(q) * 0.6, 0.0, 1.0));
    color = mix(color, c4, clamp(f * f * 3.0, 0.0, 1.0));

    // Subtle acid vein
    float vein = smoothstep(0.42, 0.58, fbm(uv * 5.0 + vec2(t * 0.4, 0.0)));
    color += vec3(0.04, 0.07, 0.02) * vein;

    // Center glow
    float d = length(uv - 0.5);
    color += vec3(0.03, 0.012, 0.006) * (1.0 - d * 2.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function NoiseBackground() {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -1]} scale={[4, 4, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
