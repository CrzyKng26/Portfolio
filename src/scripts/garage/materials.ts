import * as THREE from 'three';

export type ViewMode = 'shaded' | 'zebra' | 'wire' | 'clay';

export const carPaint = (color: string) => new THREE.MeshPhysicalMaterial({
  name: 'paint', color, metalness: .55, roughness: .3, clearcoat: 1, clearcoatRoughness: .05, envMapIntensity: 1.4,
});
export const glass = () => new THREE.MeshPhysicalMaterial({ name: 'glass', color: '#07080b', metalness: .1, roughness: .04, clearcoat: 1, envMapIntensity: 1.6 });
export const tyre = () => new THREE.MeshStandardMaterial({ name: 'tyre', color: '#0d0d0f', roughness: .82 });
export const rim = () => new THREE.MeshStandardMaterial({ name: 'rim', color: '#b8bcc4', metalness: 1, roughness: .22 });
export const lamp = (color: string) => new THREE.MeshBasicMaterial({ name: color === '#ffffff' ? 'light_front' : 'light_rear', color, toneMapped: false });

/** Zebra analysis: view-space reflection stripes, the way Alias checks surface continuity.
 *  Smooth stripes = smooth surface; kinks in the stripes reveal curvature breaks. */
export const zebra = (stripes = 14) => new THREE.ShaderMaterial({
  name: 'zebra',
  uniforms: { uStripes: { value: stripes } },
  vertexShader: /* glsl */`
    varying vec3 vNormalW;
    varying vec3 vPositionW;
    void main() {
      vec4 world = modelMatrix * vec4(position, 1.0);
      vPositionW = world.xyz;
      vNormalW = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * world;
    }`,
  fragmentShader: /* glsl */`
    uniform float uStripes;
    varying vec3 vNormalW;
    varying vec3 vPositionW;
    void main() {
      vec3 view = normalize(vPositionW - cameraPosition);
      vec3 r = reflect(view, normalize(vNormalW));
      float x = (r.y * 0.5 + 0.5) * uStripes;
      float d = abs(fract(x) - 0.5);
      float aa = fwidth(x) * 0.75;
      float s = smoothstep(0.25 - aa, 0.25 + aa, d);
      gl_FragColor = vec4(mix(vec3(0.015), vec3(0.96), s), 1.0);
    }`,
});

export const clay = () => new THREE.MeshStandardMaterial({ name: 'clay', color: '#bdb9b0', roughness: .78, metalness: 0 });
export const wire = () => new THREE.MeshBasicMaterial({ name: 'wire', color: '#a3a6ff', wireframe: true, transparent: true, opacity: .75 });

/** Procedural concrete so the floor reads as a real garage slab without a texture download. */
export function concreteTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const v = 150 + Math.random() * 70;
    image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  // A few soft stains break the repetition.
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * size, y = Math.random() * size, r = 20 + Math.random() * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${Math.random() > .5 ? 255 : 90},${Math.random() > .5 ? 255 : 90},${Math.random() > .5 ? 255 : 90},.12)`);
    g.addColorStop(1, 'rgba(128,128,128,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(30, 9);
  return texture;
}

export function radialTexture(inner: string, outer: string) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function labelTexture(text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 210px "Kannan Display", Georgia, serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 10, 140);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
