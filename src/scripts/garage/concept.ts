import * as THREE from 'three';
import { carPaint, glass, tyre, rim, lamp } from './materials';

/** Procedural stand-in cars. They exist only so the garage can be designed before the
 *  real Alias models arrive; every one is labelled "placeholder" in the UI. */
export type ConceptShape = 'coupe' | 'gt' | 'roadster' | 'hyper';

type Profile = {
  length: number; width: number; shoulder: number; roof: number; nose: number; tail: number;
  screenBase: number; roofFront: number; roofRear: number; pillarBase: number; wheel: number; open?: boolean;
};

const PROFILES: Record<ConceptShape, Profile> = {
  coupe:    { length: 4.5, width: 1.9, shoulder: .92, roof: 1.32, nose: .58, tail: .86, screenBase: .75, roofFront: -.05, roofRear: -.85, pillarBase: -1.55, wheel: .36 },
  gt:       { length: 4.8, width: 1.95, shoulder: .95, roof: 1.3, nose: .62, tail: .9, screenBase: .2, roofFront: -.55, roofRear: -1.3, pillarBase: -1.9, wheel: .37 },
  roadster: { length: 4.2, width: 1.85, shoulder: .88, roof: 1.12, nose: .55, tail: .84, screenBase: .35, roofFront: .1, roofRear: -.1, pillarBase: -.6, wheel: .34, open: true },
  hyper:    { length: 4.7, width: 2.05, shoulder: .78, roof: 1.12, nose: .42, tail: .8, screenBase: 1.05, roofFront: .2, roofRear: -.7, pillarBase: -1.8, wheel: .37 },
};

function bodyShape(p: Profile) {
  const half = p.length / 2, clearance = .2, arch = p.wheel + .07;
  const front = half - .95, rear = -half + .92;
  const s = new THREE.Shape();
  s.moveTo(-half, clearance + .14);
  s.lineTo(rear - arch, clearance);
  s.lineTo(rear - arch, p.wheel);
  s.absarc(rear, p.wheel, arch, Math.PI, 0, true);
  s.lineTo(rear + arch, clearance);
  s.lineTo(front - arch, clearance);
  s.lineTo(front - arch, p.wheel);
  s.absarc(front, p.wheel, arch, Math.PI, 0, true);
  s.lineTo(front + arch, clearance);
  s.lineTo(half - .12, clearance + .04);
  s.quadraticCurveTo(half + .04, clearance + .2, half, p.nose);
  s.quadraticCurveTo(half - .55, p.shoulder + .02, p.screenBase, p.shoulder);
  s.bezierCurveTo(p.screenBase - .8, p.shoulder + .03, p.pillarBase + .4, p.shoulder + .04, p.pillarBase, p.shoulder);
  s.quadraticCurveTo(-half + .25, p.shoulder - .02, -half, p.tail);
  s.quadraticCurveTo(-half - .1, (p.tail + clearance) / 2, -half + .08, clearance + .14);
  s.lineTo(-half, clearance + .14);
  return s;
}

function cabinShape(p: Profile) {
  const s = new THREE.Shape();
  const base = p.shoulder - .04;
  if (p.open) {
    // A low wrap-around windscreen only.
    s.moveTo(p.screenBase, base);
    s.quadraticCurveTo(p.screenBase - .2, p.roof, p.roofFront - .1, p.roof);
    s.lineTo(p.roofFront - .2, base);
    s.lineTo(p.screenBase, base);
    return s;
  }
  s.moveTo(p.screenBase, base);
  s.bezierCurveTo(p.screenBase - .35, p.shoulder + .12, p.roofFront + .3, p.roof, p.roofFront, p.roof);
  s.lineTo(p.roofRear, p.roof);
  s.bezierCurveTo(p.roofRear - .35, p.roof, p.pillarBase + .3, p.shoulder + .12, p.pillarBase, base);
  s.lineTo(p.screenBase, base);
  return s;
}

/** Extrude a side profile, then pull the upper part inward (tumblehome) so it reads as a car. */
function extrude(shape: THREE.Shape, width: number, bevel: number, pinchFrom: number, pinch: number, halfLength = 0, taper = 0) {
  const depth = Math.max(.1, width - bevel * 2);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, curveSegments: 40, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * .7, bevelSegments: 8,
  });
  geometry.translate(0, 0, -depth / 2);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i);
    const k = 1 - pinch * Math.max(0, (y - pinchFrom) / .6);
    // Plan-view taper: narrow the nose and tail so the ends read as rounded, not slab-like.
    const e = halfLength ? Math.min(1, Math.max(0, (Math.abs(position.getX(i)) / halfLength - .55) / .45)) : 0;
    const plan = 1 - taper * e * e;
    position.setZ(i, position.getZ(i) * k * plan);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function buildConcept(shape: ConceptShape, color: string) {
  const p = PROFILES[shape];
  const group = new THREE.Group();
  const paint = carPaint(color);

  const body = new THREE.Mesh(extrude(bodyShape(p), p.width, .26, .55, .14, p.length / 2, .32), paint);
  body.name = 'paint';
  const cabin = new THREE.Mesh(extrude(cabinShape(p), p.width * (p.open ? .86 : .8), .16, p.shoulder, .3), glass());
  cabin.name = 'glass';
  group.add(body, cabin);

  const half = p.length / 2;
  const wheelGeometry = new THREE.CylinderGeometry(p.wheel, p.wheel, .3, 48);
  wheelGeometry.rotateX(Math.PI / 2);
  const rimGeometry = new THREE.CylinderGeometry(p.wheel * .68, p.wheel * .68, .32, 10);
  rimGeometry.rotateX(Math.PI / 2);
  const tyreMaterial = tyre(), rimMaterial = rim();
  for (const x of [half - .95, -half + .92]) {
    for (const side of [-1, 1]) {
      const z = side * (p.width / 2 - .17);
      const t = new THREE.Mesh(wheelGeometry, tyreMaterial); t.name = 'tyre';
      const r = new THREE.Mesh(rimGeometry, rimMaterial); r.name = 'rim';
      t.position.set(x, p.wheel, z); r.position.set(x, p.wheel, z);
      group.add(t, r);
    }
  }
  const front = new THREE.Mesh(new THREE.BoxGeometry(.04, .045, p.width * .72), lamp('#ffffff'));
  front.position.set(half - .02, p.nose - .06, 0); front.name = 'light_front';
  const rearLamp = new THREE.Mesh(new THREE.BoxGeometry(.04, .05, p.width * .82), lamp('#ff2a3a'));
  rearLamp.position.set(-half - .01, p.tail - .1, 0); rearLamp.name = 'light_rear';
  group.add(front, rearLamp);

  group.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  return { group, paint };
}
