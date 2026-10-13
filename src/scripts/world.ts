import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import vertexShader from '../shaders/screen.vert.glsl?raw';
import fragmentShader from '../shaders/grid.frag.glsl?raw';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function createWorld(host: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let running = true;
  let visible = !document.hidden;
  let frame = 0;
  let mark: THREE.Object3D | null = null;
  let heroEnd=innerHeight;
  let worksTop=innerHeight;
  let aboutTop=Infinity;
  let modelHeight=2.63;
  const pointer = new THREE.Vector2();
  const smoothPointer = new THREE.Vector2();
  const overlay = document.createElement('div');
  overlay.className = 'mark-canvas';
  overlay.setAttribute('aria-hidden', 'true');
  Object.assign(overlay.style, {position:'fixed', inset:'0', zIndex:'2', pointerEvents:'none'});
  let bg: THREE.WebGLRenderer;
  let renderer: THREE.WebGLRenderer;
  try {
    bg = new THREE.WebGLRenderer({antialias:false, powerPreference:'low-power'});
    renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'high-performance'});
  } catch {
    host.dataset.model='unavailable';
    return () => {};
  }
  host.append(bg.domElement);
  overlay.append(renderer.domElement);
  document.body.append(overlay);
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
  camera.position.set(0,0,7.8);
  const screenScene = new THREE.Scene();
  const uniforms = {uTime:{value:0},uAspect:{value:1},uScroll:{value:0},uPointer:{value:smoothPointer}};
  const shader = new THREE.ShaderMaterial({vertexShader, fragmentShader, uniforms, depthTest:false, depthWrite:false});
  const screenGeometry = new THREE.PlaneGeometry(2,2);
  screenScene.add(new THREE.Mesh(screenGeometry, shader));
  const screenCamera = new THREE.Camera();

  // Local procedural studio lighting; no external HDR dependency.
  const environmentCanvas=document.createElement('canvas');
  environmentCanvas.width=1024; environmentCanvas.height=512;
  const ctx=environmentCanvas.getContext('2d')!;
  ctx.fillStyle='#17172b';ctx.fillRect(0,0,1024,512);
  const strips=[[90,10,100,430,'#cbd5ff'],[280,65,14,390,'#ffffff'],[370,0,160,512,'#161346'],[550,20,55,420,'#7970ee'],[690,30,180,100,'#ffffff'],[710,320,180,70,'#949dcb'],[960,0,8,512,'#ffffff']] as const;
  for(const [x,y,w,h,color] of strips){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
  const environmentTexture=new THREE.CanvasTexture(environmentCanvas);
  environmentTexture.mapping=THREE.EquirectangularReflectionMapping;
  environmentTexture.colorSpace=THREE.SRGBColorSpace;
  const pmrem=new THREE.PMREMGenerator(renderer);
  const environment=pmrem.fromEquirectangular(environmentTexture);
  scene.environment=environment.texture;
  const rippleCanvas=document.createElement('canvas');rippleCanvas.width=256;rippleCanvas.height=256;
  const rippleCtx=rippleCanvas.getContext('2d')!;const pixels=rippleCtx.createImageData(256,256);
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const value=128+38*Math.sin(x*.055+Math.sin(y*.04)*2)+20*Math.sin(y*.09+x*.025)+12*Math.cos(x*.19-y*.13);
    const i=(y*256+x)*4;pixels.data[i]=value;pixels.data[i+1]=value;pixels.data[i+2]=value;pixels.data[i+3]=255;
  }
  rippleCtx.putImageData(pixels,0,0);
  const ripple=new THREE.CanvasTexture(rippleCanvas);ripple.wrapS=ripple.wrapT=THREE.RepeatWrapping;
  scene.environmentRotation.set(0,.65,.25);
  // Preserve the original K's finish. Scroll effects only move the object.
  const material=new THREE.MeshPhysicalMaterial({color:'#e0dffc',metalness:1,roughness:.09,clearcoat:1,clearcoatRoughness:.08,iridescence:.6,iridescenceIOR:1.4,iridescenceThicknessRange:[180,480],envMapIntensity:1.8,bumpMap:ripple,bumpScale:.18});
  scene.add(new THREE.HemisphereLight('#aebdff','#141022',.6));
  const light=new THREE.DirectionalLight('#ffffff',2);light.position.set(-3,4,5);scene.add(light);
  const blue=new THREE.DirectionalLight('#7867ff',1.5);blue.position.set(4,-2,3);scene.add(blue);
  new GLTFLoader().load('/models/k-mark.glb', gltf=>{
    if(!running){gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});return;}
    mark=gltf.scene;
    modelHeight=new THREE.Box3().setFromObject(mark).getSize(new THREE.Vector3()).y;
    mark.traverse(o=>{if(o instanceof THREE.Mesh){const old=o.material; (Array.isArray(old)?old:[old]).forEach(m=>m.dispose());o.material=material;}});
    scene.add(mark);
    host.dataset.model='ready';
  },undefined,()=>{host.dataset.model='unavailable';});

  const move=(e:PointerEvent)=>pointer.set(e.clientX/innerWidth-.5,.5-e.clientY/innerHeight);
  const resize=()=>{
    const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio,w<760?1.25:1.5);
    bg.setPixelRatio(dpr);renderer.setPixelRatio(dpr);bg.setSize(w,h);renderer.setSize(w,h);
    camera.aspect=w/h;camera.updateProjectionMatrix();uniforms.uAspect.value=w/h;
    const hero=document.getElementById('top');
    const stage=document.querySelector<HTMLElement>('.hero-stage');
    heroEnd=Math.max(1,(hero?.offsetHeight??h)-(stage?.offsetHeight??h));
    worksTop=document.getElementById('works')?.offsetTop??h;
    aboutTop=document.getElementById('about')?.offsetTop??Infinity;
  };
  const visibility=()=>{visible=!document.hidden;};
  addEventListener('pointermove',move,{passive:true});addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);ScrollTrigger.addEventListener('refresh',resize);resize();
  const start=performance.now();
  const draw=()=>{
    if(!running)return;
    frame=requestAnimationFrame(draw);
    if(!visible)return;
    const time=(performance.now()-start)/1000;
    const scroll=scrollY/innerHeight;
    const transition=THREE.MathUtils.clamp(scrollY/heroEnd,0,1);
    const fade=1-THREE.MathUtils.smoothstep(scrollY,worksTop,worksTop+innerHeight*.3);
    overlay.style.opacity=String(fade);
    smoothPointer.lerp(pointer,.035);
    uniforms.uTime.value=reduced?0:time;
    uniforms.uScroll.value=scroll;
    if(mark){
      const mobile=innerWidth<760;
      const centerY=mobile?(innerHeight<=740?.48:.50):.55;
      const frustumHeight=2*camera.position.z*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
      const baseScale=frustumHeight*(mobile?.34:.43)/modelHeight;
      const pull=reduced?0:THREE.MathUtils.smoothstep(transition,.08,.65);
      const retreat=reduced?0:THREE.MathUtils.smoothstep(transition,.67,1);
      const absorption=reduced?0:THREE.MathUtils.clamp((transition-.34)/.34,0,1);
      const impulse=Math.sin(absorption*Math.PI);
      mark.scale.setScalar(baseScale*(1+pull*.08+impulse*.045)*(1-retreat*.36));
      mark.position.y=THREE.MathUtils.lerp((.5-centerY)*frustumHeight,.02*frustumHeight,pull)+retreat*.12*frustumHeight+(reduced?0:Math.sin(time*.6)*.04)*(1-pull);
      mark.position.x=retreat*-.18*frustumHeight;
      mark.position.z=impulse*.18-retreat*4.8;
      mark.rotation.set(.10+(reduced?0:smoothPointer.y*.16)+impulse*.12,-.30+(reduced?0:smoothPointer.x*.25+Math.sin(time*.18)*.13)+impulse*.24+retreat*.8,-.07+impulse*.045+retreat*.08);
    }
    // Opaque content covers the world below About; avoid rendering hidden pixels.
    if(scrollY<aboutTop)bg.render(screenScene,screenCamera);
    if(fade>.01)renderer.render(scene,camera);
  };
  draw();
  return ()=>{
    running=false;cancelAnimationFrame(frame);removeEventListener('pointermove',move);removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);ScrollTrigger.removeEventListener('refresh',resize);
    mark?.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});
    material.dispose();ripple.dispose();environment.dispose();environmentTexture.dispose();pmrem.dispose();shader.dispose();screenGeometry.dispose();renderer.dispose();bg.dispose();overlay.remove();bg.domElement.remove();
  };
}
