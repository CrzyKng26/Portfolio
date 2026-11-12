import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import type Lenis from 'lenis';
import type { AliasModel } from '../../data/alias';
import { buildConcept } from './concept';
import { carPaint, zebra, clay, wire, concreteTexture, radialTexture, labelTexture, type ViewMode } from './materials';

const SPACING = 9;
const SPIN = .26; // rad/s ≈ one revolution every 24 s, like a watch winder
const BROWSE_OFFSET = new THREE.Vector3(0, 2.4, 12.2);
const BROWSE_LOOK_Y = .75;
const ROOM = new THREE.Color('#050507');
const STUDIO = new THREE.Color('#0d0d13');

type Bay = {
  model: AliasModel;
  root: THREE.Group;        // fixed to the floor
  table: THREE.Group;       // rotates
  car: THREE.Group | null;
  paint: THREE.MeshPhysicalMaterial | null;
  originals: Map<THREE.Mesh, THREE.Material | THREE.Material[]>;
  tubes: THREE.MeshBasicMaterial;
  ring: THREE.MeshBasicMaterial;
  glow: THREE.MeshBasicMaterial;
  power: { value: number };
  loading: boolean;
};

export function createGarage(host: HTMLElement, lenis: Lenis | null) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const models: AliasModel[] = JSON.parse(host.dataset.models || '[]');
  const canvasHost = host.querySelector<HTMLElement>('[data-garage-canvas]')!;
  const shutter = host.querySelector<HTMLElement>('[data-garage-shutter]');
  const html = document.documentElement;
  html.classList.add('garage-mode');
  lenis?.stop();
  scrollTo(0, 0);

  const shutterTimers: number[] = [];
  const openShutter = (delay = 0) => {
    if (!shutter || reduced) { host.classList.add('is-open'); return; }
    // CSS transition (wall-clock) so the door still opens on a slow first frame.
    const open = () => host.classList.add('is-open');
    shutterTimers.push(window.setTimeout(() => host.classList.add('is-raising'), delay * 1000));
    shutterTimers.push(window.setTimeout(open, delay * 1000 + 2100));
  };

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch {
    host.dataset.state = 'unavailable';
    openShutter();
    return () => { html.classList.remove('garage-mode'); lenis?.start(); };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  canvasHost.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = ROOM.clone();
  scene.fog = new THREE.Fog(ROOM.clone(), 12, 36);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTarget = pmrem.fromScene(room, .04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = .42;
  RectAreaLightUniformsLib.init();

  const camera = new THREE.PerspectiveCamera(30, 1, .1, 140);
  const look = new THREE.Vector3(0, BROWSE_LOOK_Y, 0);
  camera.position.copy(BROWSE_OFFSET);
  camera.lookAt(look);

  scene.add(new THREE.HemisphereLight('#9fa6ff', '#0a0a0c', .25));
  const key = new THREE.DirectionalLight('#ffffff', .55);
  key.position.set(4, 8, 6);
  scene.add(key, key.target);

  // ---------- Room ----------
  const span = Math.max(1, models.length) * SPACING;
  const concrete = concreteTexture();
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(span + 80, 60),
    new THREE.MeshStandardMaterial({ color: '#111114', roughness: .42, roughnessMap: concrete, metalness: .3 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.x = span / 2 - SPACING / 2;
  scene.add(floor);

  const wall = new THREE.Mesh(new THREE.PlaneGeometry(span + 80, 14), new THREE.MeshStandardMaterial({ color: '#0c0c10', roughness: .92 }));
  wall.position.set(floor.position.x, 7, -6.5);
  scene.add(wall);
  const ribCount = Math.ceil((span + 40) / 1.6);
  const ribs = new THREE.InstancedMesh(new THREE.BoxGeometry(.1, 14, .35), new THREE.MeshStandardMaterial({ color: '#15151b', roughness: .6, metalness: .4 }), ribCount);
  const m = new THREE.Matrix4();
  for (let i = 0; i < ribCount; i++) { m.makeTranslation(-20 + i * 1.6, 7, -6.3); ribs.setMatrixAt(i, m); }
  scene.add(ribs);

  // A cyclorama that wraps the inspected car so the garage fades into a studio.
  const cyclorama = new THREE.Mesh(
    new THREE.SphereGeometry(6, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: '#0c0c11', side: THREE.BackSide, transparent: true, opacity: 0, depthWrite: false, fog: false }),
  );
  cyclorama.visible = false;
  scene.add(cyclorama);

  // ---------- Bays ----------
  const shadowTexture = radialTexture('rgba(0,0,0,.85)', 'rgba(0,0,0,0)');
  const poolTexture = radialTexture('rgba(255,255,255,.55)', 'rgba(255,255,255,0)');
  const tableGeometry = new THREE.CylinderGeometry(2.95, 3.05, .14, 96);
  const tableMaterial = new THREE.MeshStandardMaterial({ color: '#25262c', metalness: .92, roughness: .32 });
  const tickGeometry = new THREE.BoxGeometry(.02, .01, .18);
  const tubeGeometry = new THREE.BoxGeometry(3.6, .06, .06);

  const bays: Bay[] = models.map((model, i) => {
    const root = new THREE.Group();
    root.position.x = i * SPACING;
    const table = new THREE.Group();
    const plinth = new THREE.Mesh(tableGeometry, tableMaterial);
    plinth.position.y = .07;
    table.add(plinth);
    const ring = new THREE.MeshBasicMaterial({ color: '#ff5a1f', transparent: true, opacity: .25, toneMapped: false });
    const ringMesh = new THREE.Mesh(new THREE.RingGeometry(2.8, 2.84, 128), ring);
    ringMesh.rotation.x = -Math.PI / 2; ringMesh.position.y = .142;
    const ticks = new THREE.InstancedMesh(tickGeometry, new THREE.MeshBasicMaterial({ color: '#56576a' }), 60);
    for (let t = 0; t < 60; t++) {
      const a = (t / 60) * Math.PI * 2;
      m.makeRotationY(-a).setPosition(Math.cos(a) * 2.62, .145, Math.sin(a) * 2.62);
      ticks.setMatrixAt(t, m);
    }
    const contact = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.2), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
    contact.rotation.x = -Math.PI / 2; contact.position.y = .143;
    table.add(ringMesh, ticks, contact);
    root.add(table);

    const glow = new THREE.MeshBasicMaterial({ map: poolTexture, transparent: true, opacity: .0, depthWrite: false, blending: THREE.AdditiveBlending });
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), glow);
    pool.rotation.x = -Math.PI / 2; pool.position.y = .004;
    const number = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .8), new THREE.MeshBasicMaterial({ map: labelTexture(String(i + 1).padStart(2, '0')), transparent: true, opacity: .1, depthWrite: false }));
    number.rotation.x = -Math.PI / 2; number.position.set(-3.7, .005, 3.1);
    root.add(pool, number);

    const tubes = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
    for (const z of [-1.1, 1.1]) { const tube = new THREE.Mesh(tubeGeometry, tubes); tube.position.set(0, 5.4, z); root.add(tube); }
    scene.add(root);
    return { model, root, table, car: null, paint: null, originals: new Map(), tubes, ring, glow, power: { value: 0 }, loading: false };
  });

  // A single RectAreaLight follows the active bay: lighting cost stays flat however many bays exist.
  const areaLight = new THREE.RectAreaLight('#f4f2ff', 0, 3.6, 2.4);
  areaLight.position.set(0, 5.3, 0);
  areaLight.rotation.x = -Math.PI / 2;
  scene.add(areaLight);
  const applyPower = (bay: Bay) => {
    const p = bay.power.value;
    bay.tubes.color.setScalar(.08 + p * .92);
    if (bay === bays[index]) areaLight.intensity = p * 9;
    bay.glow.opacity = p * .14;
    bay.ring.opacity = .12 + p * .5;
  };

  // ---------- Models (lazy: current bay ± 1) ----------
  let gltfLoader: Promise<import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader> | null = null;
  const getLoader = () => gltfLoader ??= Promise.all([
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/libs/meshopt_decoder.module.js'),
  ]).then(([{ GLTFLoader }, { MeshoptDecoder }]) => new GLTFLoader().setMeshoptDecoder(MeshoptDecoder));

  const mount = (bay: Bay, car: THREE.Group, paint: THREE.MeshPhysicalMaterial | null) => {
    // Normalise any model to ~4.6 m long, centred on the turntable.
    const box = new THREE.Box3().setFromObject(car);
    const size = box.getSize(new THREE.Vector3());
    const scale = 4.6 / Math.max(size.x, size.z, .001);
    car.scale.setScalar(scale);
    box.setFromObject(car);
    const center = box.getCenter(new THREE.Vector3());
    car.position.set(-center.x, .14 - box.min.y, -center.z);
    car.traverse(o => { const mesh = o as THREE.Mesh; if (mesh.isMesh) bay.originals.set(mesh, mesh.material); });
    bay.table.add(car);
    bay.car = car; bay.paint = paint;
    if (mode !== 'shaded' && bay === bays[index]) setMode(mode);
  };

  const load = (i: number) => {
    const bay = bays[i];
    if (!bay || bay.car || bay.loading) return;
    bay.loading = true;
    const color = bay.model.paints[0]?.color ?? '#24252b';
    if (!bay.model.glb) {
      const { group, paint } = buildConcept(bay.model.placeholder ?? 'coupe', color);
      mount(bay, group, paint);
      return;
    }
    void getLoader().then(loader => loader.loadAsync(bay.model.glb!)).then(gltf => {
      if (disposed) return;
      let paint: THREE.MeshPhysicalMaterial | null = null;
      gltf.scene.traverse(o => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const name = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material).name.toLowerCase();
        if (name.includes('paint')) { paint ??= carPaint(color); mesh.material = paint; }
      });
      mount(bay, gltf.scene, paint);
    }).catch(error => {
      console.warn(`Garage: could not load ${bay.model.glb}`, error);
      const { group, paint } = buildConcept(bay.model.placeholder ?? 'coupe', color);
      mount(bay, group, paint);
    });
  };

  // ---------- UI ----------
  const $ = <T extends HTMLElement>(selector: string) => host.querySelector<T>(selector)!;
  const plaque = { index: $('[data-g-index]'), name: $('[data-g-name]'), meta: $('[data-g-meta]'), summary: $('[data-g-summary]'), tools: $('[data-g-tools]'), surfaces: $('[data-g-surfaces]'), hours: $('[data-g-hours]') };
  const prev = $<HTMLButtonElement>('[data-g-prev]');
  const next = $<HTMLButtonElement>('[data-g-next]');
  const enterButton = $<HTMLButtonElement>('[data-g-enter]');
  const inspectPanel = $('[data-g-inspect]');
  const paintsEl = $('[data-g-paints]');
  const hotspotsEl = $('[data-g-hotspots]');
  const note = $('[data-g-note]');
  const modeButtons = [...host.querySelectorAll<HTMLButtonElement>('[data-g-mode]')];

  let index = 0;
  let mode: ViewMode = 'shaded';
  let state: 'browse' | 'inspect' | 'moving' = 'browse';
  const rig = { x: 0 };

  const renderPlaque = (model: AliasModel, i: number) => {
    plaque.index.textContent = String(i + 1).padStart(2, '0');
    plaque.name.textContent = model.name;
    plaque.meta.textContent = `${model.year} · ${model.category}`;
    plaque.summary.textContent = model.summary;
    plaque.tools.textContent = model.tools.join(' · ');
    plaque.surfaces.textContent = model.surfaces ? String(model.surfaces) : '—';
    plaque.hours.textContent = model.hours ? String(model.hours) : '—';
    prev.disabled = i === 0;
    next.disabled = i === models.length - 1;
  };

  const goTo = (target: number, immediate = false) => {
    const i = Math.max(0, Math.min(models.length - 1, target));
    if (i === index && !immediate) return;
    index = i;
    [i - 1, i, i + 1].forEach(load);
    bays.forEach((bay, b) => gsap.to(bay.power, { value: b === i ? 1 : .18, duration: immediate || reduced ? 0 : (b === i ? 1.1 : .6), delay: b === i && !immediate ? .5 : 0, ease: 'power2.out', onUpdate: () => applyPower(bay) }));
    gsap.to(rig, { x: i * SPACING, duration: immediate || reduced ? 0 : 1.5, ease: 'power3.inOut' });
    const copy = host.querySelectorAll('[data-garage-plaque] h2, [data-garage-plaque] p, [data-garage-plaque] dl');
    if (immediate || reduced) { renderPlaque(models[i], i); return; }
    gsap.timeline()
      .to(copy, { y: -10, autoAlpha: 0, duration: .25, ease: 'power2.in', stagger: .02 })
      .add(() => renderPlaque(models[i], i))
      .fromTo(copy, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6, ease: 'expo.out', stagger: .04 });
  };

  // ---------- Inspect ----------
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = false;
  controls.enableDamping = true;
  controls.dampingFactor = .06;
  controls.enablePan = false;
  controls.minDistance = 5.2;
  controls.maxDistance = 12;
  controls.maxPolarAngle = Math.PI / 2 - .06;
  let spinPausedUntil = 0;
  let dragging = false;
  controls.addEventListener('start', () => { dragging = true; });
  controls.addEventListener('end', () => { dragging = false; spinPausedUntil = performance.now() + 2800; });

  const zebraMaterial = zebra();
  const clayMaterial = clay();
  const wireMaterial = wire();
  function setMode(next: ViewMode) {
    mode = next;
    modeButtons.forEach(b => b.setAttribute('aria-checked', String(b.dataset.gMode === next)));
    const bay = bays[index];
    bay?.originals.forEach((original, mesh) => {
      const isLamp = mesh.name.startsWith('light_');
      mesh.material = next === 'shaded' || (isLamp && next !== 'wire') ? original : next === 'zebra' ? zebraMaterial : next === 'clay' ? clayMaterial : wireMaterial;
    });
  }

  const hotspotButtons: { el: HTMLButtonElement; local: THREE.Vector3 }[] = [];
  const buildInspectUI = (bay: Bay) => {
    paintsEl.replaceChildren(...bay.model.paints.map((paint, p) => {
      const b = document.createElement('button');
      b.type = 'button'; b.style.setProperty('--swatch', paint.color);
      b.setAttribute('aria-label', `Paint: ${paint.name}`); b.setAttribute('aria-pressed', String(p === 0));
      b.dataset.cursor = paint.name;
      b.addEventListener('click', () => {
        paintsEl.querySelectorAll('button').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
        if (bay.paint) { const c = new THREE.Color(paint.color); gsap.to(bay.paint.color, { r: c.r, g: c.g, b: c.b, duration: reduced ? 0 : .9, ease: 'power2.inOut' }); }
      });
      return b;
    }));
    hotspotButtons.length = 0;
    hotspotsEl.replaceChildren(...bay.model.hotspots.map(spot => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'garage-hotspot'; b.textContent = spot.label; b.dataset.cursor = spot.label;
      b.addEventListener('click', () => {
        note.innerHTML = '';
        const title = document.createElement('b'); title.textContent = spot.label;
        note.append(title, document.createTextNode(spot.note));
        spinPausedUntil = performance.now() + 6000;
      });
      hotspotButtons.push({ el: b, local: new THREE.Vector3(...spot.position) });
      return b;
    }));
    note.textContent = '';
  };

  const enter = () => {
    if (state !== 'browse' || !bays[index]) return;
    state = 'moving';
    const bay = bays[index];
    buildInspectUI(bay);
    host.classList.add('is-inspecting');
    inspectPanel.hidden = false;
    const x = index * SPACING;
    cyclorama.position.set(x, 0, 0); cyclorama.visible = true;
    controls.target.set(x, .7, 0);
    const d = reduced ? 0 : 1.6;
    gsap.to(cyclorama.material, { opacity: .96, duration: d, ease: 'power2.inOut' });
    gsap.to(scene.fog as THREE.Fog, { near: 9.5, far: 15, duration: d });
    gsap.to([(scene.fog as THREE.Fog).color, scene.background], { r: STUDIO.r, g: STUDIO.g, b: STUDIO.b, duration: d });
    gsap.to(look, { x, y: .7, z: 0, duration: d, ease: 'power3.inOut' });
    gsap.to(camera.position, {
      x: x + 5.4, y: 2.1, z: 7.2, duration: d, ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(look),
      onComplete: () => { controls.enabled = true; controls.update(); state = 'inspect'; modeButtons[0]?.focus({ preventScroll: true }); },
    });
  };

  const exit = () => {
    if (state !== 'inspect') return;
    state = 'moving';
    controls.enabled = false;
    setMode('shaded');
    note.textContent = '';
    host.classList.remove('is-inspecting');
    const x = index * SPACING;
    const d = reduced ? 0 : 1.4;
    look.copy(controls.target);
    gsap.to(cyclorama.material, { opacity: 0, duration: d, ease: 'power2.inOut', onComplete: () => { cyclorama.visible = false; } });
    gsap.to(scene.fog as THREE.Fog, { near: 12, far: 36, duration: d });
    gsap.to([(scene.fog as THREE.Fog).color, scene.background], { r: ROOM.r, g: ROOM.g, b: ROOM.b, duration: d });
    gsap.to(look, { x: x + (camera.aspect > 1.1 ? -1.7 : 0), y: BROWSE_LOOK_Y, z: 0, duration: d, ease: 'power3.inOut' });
    gsap.to(camera.position, {
      x: x + (camera.aspect > 1.1 ? -1.7 : 0) + BROWSE_OFFSET.x, y: BROWSE_OFFSET.y, z: BROWSE_OFFSET.z, duration: d, ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(look),
      onComplete: () => { inspectPanel.hidden = true; state = 'browse'; enterButton.focus({ preventScroll: true }); },
    });
  };

  // ---------- Input ----------
  let wheelLock = 0, wheelSum = 0;
  const onWheel = (e: WheelEvent) => {
    if (state !== 'browse') return;
    e.preventDefault();
    wheelSum += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const now = performance.now();
    if (now < wheelLock || Math.abs(wheelSum) < 40) return;
    goTo(index + Math.sign(wheelSum));
    wheelSum = 0; wheelLock = now + 950;
  };
  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('input, textarea')) return;
    if (state === 'browse') {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
      else if (e.key === 'Enter' && !(e.target as HTMLElement).closest('button, a, summary')) { e.preventDefault(); enter(); }
    } else if (state === 'inspect') {
      if (e.key === 'Escape') { e.preventDefault(); exit(); }
      const modes: ViewMode[] = ['shaded', 'zebra', 'wire', 'clay'];
      if (/^[1-4]$/.test(e.key)) setMode(modes[Number(e.key) - 1]);
    }
  };
  let swipeX: number | null = null;
  const onPointerDown = (e: PointerEvent) => { if (state === 'browse') swipeX = e.clientX; };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeX === null || state !== 'browse') return;
    const dx = e.clientX - swipeX; swipeX = null;
    if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
  };
  const onPrev = () => goTo(index - 1), onNext = () => goTo(index + 1);
  const onMode = (e: Event) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-g-mode]'); if (b) setMode(b.dataset.gMode as ViewMode); };
  host.addEventListener('wheel', onWheel, { passive: false });
  addEventListener('keydown', onKey);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  addEventListener('pointerup', onPointerUp);
  prev.addEventListener('click', onPrev);
  next.addEventListener('click', onNext);
  enterButton.addEventListener('click', enter);
  $('[data-g-back]').addEventListener('click', exit);
  host.querySelector('.garage-modes')!.addEventListener('click', onMode);

  // ---------- Loop ----------
  const resize = () => {
    const w = canvasHost.clientWidth || innerWidth, h = canvasHost.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < .9 ? 44 : 30;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvasHost);
  resize();

  let last = performance.now();
  const projected = new THREE.Vector3();
  const toCamera = new THREE.Vector3();
  const outward = new THREE.Vector3();
  let frame = 0;
  let disposed = false;
  // Adaptive resolution: if the GPU averages > 28 ms a frame, step the pixel ratio down.
  const ratios = [Math.min(devicePixelRatio, 1.75), 1.25, 1, .75].filter((r, i, a) => i === 0 || r < a[0]);
  let ratioStep = 0, sampleTime = 0, sampleFrames = 0;
  const render = () => {
    frame = requestAnimationFrame(render);
    if (document.hidden) { last = performance.now(); return; }
    const now = performance.now();
    const elapsed = now - last;
    const dt = Math.min(elapsed / 1000, .05);
    last = now;
    if (elapsed < 250) { sampleTime += elapsed; sampleFrames++; }
    if (sampleFrames === 40) {
      if (sampleTime / sampleFrames > 28 && ratioStep < ratios.length - 1) { renderer.setPixelRatio(ratios[++ratioStep]); resize(); }
      sampleTime = 0; sampleFrames = 0;
    }
    areaLight.position.x = state === 'browse' ? rig.x : index * SPACING;
    bays.forEach((bay, b) => {
      const inspecting = state !== 'browse' && b === index;
      const paused = inspecting && (dragging || now < spinPausedUntil);
      if (!reduced && !paused) bay.table.rotation.y += dt * SPIN;
    });
    if (state === 'browse') {
      // On wide screens the car sits right of the plaque.
      const shift = camera.aspect > 1.1 ? -1.7 : 0;
      look.set(rig.x + shift, BROWSE_LOOK_Y, 0);
      camera.position.set(rig.x + shift + BROWSE_OFFSET.x, BROWSE_OFFSET.y, BROWSE_OFFSET.z);
      camera.lookAt(look);
    } else if (state === 'inspect') {
      controls.update();
    }
    // Project hotspots (they live in car space and turn with the table).
    const bay = bays[index];
    if (state === 'inspect' && bay?.car) {
      const center = bay.table.getWorldPosition(projected.clone());
      hotspotButtons.forEach(({ el, local }) => {
        projected.copy(local).applyMatrix4(bay.table.matrixWorld);
        outward.copy(projected).sub(center).setY(0);
        toCamera.copy(camera.position).sub(projected);
        el.classList.toggle('is-behind', outward.dot(toCamera) < 0);
        projected.project(camera);
        el.style.transform = `translate(${(projected.x * .5 + .5) * canvasHost.clientWidth}px, ${(-projected.y * .5 + .5) * canvasHost.clientHeight}px)`;
      });
    }
    renderer.render(scene, camera);
  };

  // ---------- Intro: lights flicker on, shutter rises ----------
  renderPlaque(models[0], 0);
  [0, 1].forEach(load);
  bays.forEach(applyPower);
  if (reduced) {
    goTo(0, true);
    openShutter();
  } else {
    const first = bays[0];
    const flicker = gsap.timeline({ delay: .35 });
    [.9, 0, .6, 0, .2, 0, 1].forEach((v, i) => flicker.to(first.power, { value: v, duration: i === 6 ? .5 : .06, ease: 'none', onUpdate: () => applyPower(first) }, i * .11));
    bays.slice(1).forEach(bay => flicker.to(bay.power, { value: .18, duration: .8, onUpdate: () => applyPower(bay) }, 1));
    openShutter(.9);
  }
  render();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    shutterTimers.forEach(clearTimeout);
    observer.disconnect();
    gsap.killTweensOf([rig, look, camera.position, cyclorama.material, scene.fog, ...bays.map(b => b.power)]);
    host.removeEventListener('wheel', onWheel);
    removeEventListener('keydown', onKey);
    removeEventListener('pointerup', onPointerUp);
    controls.dispose();
    scene.traverse(o => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(mat => {
        Object.values(mat).forEach(v => { if (v instanceof THREE.Texture) v.dispose(); });
        mat.dispose();
      });
    });
    bays.forEach(bay => bay.originals.forEach(mat => (Array.isArray(mat) ? mat : [mat]).forEach(x => x.dispose())));
    [zebraMaterial, clayMaterial, wireMaterial].forEach(mat => mat.dispose());
    envTarget.dispose(); pmrem.dispose(); room.dispose?.();
    renderer.dispose();
    renderer.domElement.remove();
    html.classList.remove('garage-mode');
    lenis?.start();
  };
}
