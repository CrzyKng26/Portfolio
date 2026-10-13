import Swup from 'swup';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupA11yPlugin from '@swup/a11y-plugin';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projects } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis=reduced?null:new Lenis({duration:1.15});
const ticker=(time:number)=>lenis?.raf(time*1000);
gsap.ticker.add(ticker);
lenis?.on('scroll',ScrollTrigger.update);
const swup=new Swup({containers:['#swup'],plugins:[new SwupHeadPlugin(),new SwupA11yPlugin()]});
// A single scroll owner keeps Swup's anchor jumps and Lenis in sync.
if(lenis){
  swup.hooks.replace('scroll:top',()=>{lenis.resize();lenis.scrollTo(0,{immediate:true,force:true});return true;});
  swup.hooks.replace('scroll:anchor',(visit,{hash})=>{
    const target=swup.getAnchorElement(hash);
    if(!(target instanceof HTMLElement))return false;
    lenis.resize();
    lenis.scrollTo(target,{immediate:visit.from.url!==visit.to.url,force:true});
    return true;
  });
}
let cleanupPage=()=>{};

function initializePage(){
  cleanupPage();
  const disposers:Array<()=>void>=[];
  let disposed=false;
  disposers.push(()=>{disposed=true;});
  const home=document.querySelector<HTMLElement>('[data-home="true"]');
  const host=document.getElementById('world');
  if(host)void import('./world').then(({createWorld})=>{
    if(!disposed&&host.isConnected)disposers.push(createWorld(host));
  }).catch(()=>{host.dataset.model='unavailable';});
  const context=gsap.context(()=>{
    if(!reduced){
      const hero=document.querySelector<HTMLElement>('.hero');
      const stage=document.querySelector<HTMLElement>('.hero-stage');
      if(hero&&stage){
        const identity=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:hero,start:'top top',end:()=>`+=${hero.offsetHeight-stage.offsetHeight}`,scrub:.25,invalidateOnRefresh:true}});
        identity.to('.hero-portrait',{scale:.84,y:()=>stage.offsetHeight*.04,opacity:.38,duration:.27},.08)
          .to('.hero-wordmark',{scale:.74,y:()=>-stage.offsetHeight*.025,duration:.24},.10)
          .to('.hero-portrait',{scale:.06,y:()=>stage.offsetHeight*.12,z:-220,rotationX:24,rotationY:-12,opacity:0,duration:.30},.35)
          .to('.hero-wordmark',{scale:.06,y:()=>-stage.offsetHeight*(innerWidth<760?.27:.39),z:-300,rotationX:20,opacity:0,duration:.30},.35)
          .to('.hero-letter',{x:(_i,el:HTMLElement)=>((el.parentElement!.offsetWidth/2)-(el.offsetLeft+el.offsetWidth/2))*.8,z:-130,rotationY:(i:number)=>i<3?-36:36,opacity:0,duration:.20,stagger:{amount:.04,from:'center'}},.41)
          .to('.hero-absorption',{opacity:1,duration:.08},.31)
          .to('.hero-orbit',{scale:.08,rotationZ:135,rotationX:82,duration:.30,stagger:.025},.34)
          .fromTo('.hero-trail',{x:(i:number)=>Math.cos(i*Math.PI/6)*stage.offsetHeight*.16,y:(i:number)=>Math.sin(i*Math.PI/6)*stage.offsetHeight*.16,scaleX:1.3,opacity:.7},{x:0,y:0,scaleX:.08,opacity:0,duration:.18,stagger:{amount:.10},immediateRender:false},.35)
          .fromTo('.hero-absorption-core',{scale:.3,opacity:0},{scale:1.1,opacity:.8,duration:.12,immediateRender:false},.40)
          .to('.hero-absorption-core',{scale:.5,opacity:0,duration:.18},.52)
          .to('.hero-absorption',{opacity:0,duration:.09},.64)
          .to('.hero-grid',{scale:1.06,rotationZ:2,opacity:.20,duration:.30},.35)
          .to('.hero-eyebrow,.hero-bottom,.hero-baseline',{opacity:0,y:-12,duration:.20},.36)
          .to('.hero-grid',{opacity:0,duration:.28},.65)
          .to({}, {duration:.04},.96);
      }
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:.9,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    }
  });
  disposers.push(()=>context.revert());
  const chapters=document.querySelectorAll<HTMLAnchorElement>('[data-chapter]');
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){if(entry.isIntersecting){chapters.forEach(a=>{const active=a.dataset.chapter===entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}
  },{rootMargin:'-20% 0px -65% 0px'});
  if(home)document.querySelectorAll('section[id]').forEach(el=>observer.observe(el));
  disposers.push(()=>observer.disconnect());
  const works=document.querySelector<HTMLElement>('.works');
  const cards=[...document.querySelectorAll<HTMLAnchorElement>('.gallery-card')];
  if(works&&!reduced){
    const stage=works.querySelector<HTMLElement>('.works-stage')!;
    const arrival={value:0};
    const art=cards.map(card=>card.querySelector<HTMLElement>('.project-art')!);
    const images=art.map(el=>el.querySelector<HTMLImageElement>('img')!);
    const copy=[...works.querySelector<HTMLElement>('.work-caption > div:first-child')!.children];
    let captionMotion:gsap.core.Tween|null=null;
    let active=-1;
    let progress=0;
    const previous=document.querySelector<HTMLButtonElement>('[data-gallery-prev]')!;
    const next=document.querySelector<HTMLButtonElement>('[data-gallery-next]')!;
    const layout=(raw:number)=>{
      progress=raw;
      const width=innerWidth<760?innerWidth*.82:innerWidth*.49;
      cards.forEach((card,i)=>{
        const delta=i-raw,dist=Math.abs(delta);
        // Arrival is staggered in depth, then blends into the existing scroll rail.
        const entered=Math.max(0,Math.min(1,(arrival.value-i*.075)/(1-i*.075)));
        const depth=1-Math.pow(1-entered,3);
        const x=delta*(innerWidth<760?width*.92:innerWidth*.46);
        const y=delta*75-50+(1-depth)*140;
        const z=-dist*(innerWidth<760?220:420)-(1-depth)*(750+i*100);
        const scale=(1-Math.min(dist,2)*.08)*(1-(1-depth)*.12);
        card.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateY(${-delta*28+(1-depth)*(i%2?24:-24)}deg) rotateZ(${delta*2}deg) scale(${scale})`;
        card.style.opacity=String(Math.max(0,1-dist*.38)*depth);
        card.style.zIndex=String(5-Math.round(dist));
        const accessible=dist<.65&&depth>.8;
        card.style.pointerEvents=accessible?'auto':'none';
        card.tabIndex=accessible?0:-1;
        card.setAttribute('aria-hidden',String(!accessible));
        art[i].style.clipPath=depth>.999?'none':`inset(${(1-depth)*12}% ${(1-depth)*26}%)`;
        images[i].style.transform=`scale(${1+Math.min(dist,1)*.075+(1-depth)*.15})`;
        card.style.setProperty('--sweep-x',`${Math.max(-1,Math.min(1,delta))*140-70}%`);
        card.style.setProperty('--sweep-opacity',String(dist<1?Math.sin(dist*Math.PI)*.11:0));
      });
      const index=Math.round(raw);
      if(index!==active){const initial=active<0;active=index;const project=projects[index];
        document.querySelector('[data-work-number]')!.textContent=String(index+1).padStart(2,'0');
        document.querySelector('[data-work-title]')!.textContent=project.title;
        document.querySelector('[data-work-meta]')!.textContent=`${project.year} / ${project.category}`;
        document.querySelector('[data-work-description]')!.textContent=project.focus;
        document.querySelector<HTMLAnchorElement>('[data-work-link]')!.href=`/work/${project.slug}/`;
        const tags=document.querySelector('[data-work-tags]')!;tags.replaceChildren(...project.tags.map(t=>{const span=document.createElement('span');span.textContent=t;return span;}));
        previous.disabled=index===0;next.disabled=index===projects.length-1;
        if(!initial){
          captionMotion?.revert();
          captionMotion=gsap.fromTo(copy,{y:18,opacity:0,clipPath:'inset(0 0 100% 0)'},{y:0,opacity:1,clipPath:'inset(0 0 0% 0)',duration:.5,stagger:.035,ease:'power3.out',clearProps:'transform,opacity,clipPath'});
        }
      }
    };
    const trigger=ScrollTrigger.create({trigger:works,start:'top top',end:()=>`+=${works.offsetHeight-innerHeight}`,onUpdate:self=>layout(self.progress*(projects.length-1)),onRefresh:self=>layout(self.progress*(projects.length-1)),invalidateOnRefresh:true});
    const entrance=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:works,start:'top 45%',end:'top top',scrub:.35,invalidateOnRefresh:true}})
      .fromTo(stage,{opacity:0,y:50},{opacity:1,y:0,duration:1},0)
      .to(arrival,{value:1,duration:1,onUpdate:()=>layout(progress)},0);
    disposers.push(()=>{entrance.scrollTrigger?.kill();entrance.revert();captionMotion?.revert();});
    layout(trigger.progress*(projects.length-1));
    const go=(direction:number)=>{
      const index=Math.max(0,Math.min(projects.length-1,Math.round(progress)+direction));
      const target=trigger.start+(trigger.end-trigger.start)*index/(projects.length-1);
      if(lenis)lenis.scrollTo(target,{duration:1.1});else scrollTo({top:target,behavior:'smooth'});
    };
    const prevClick=()=>go(-1),nextClick=()=>go(1);
    previous.addEventListener('click',prevClick);next.addEventListener('click',nextClick);
    disposers.push(()=>{trigger.kill();previous.removeEventListener('click',prevClick);next.removeEventListener('click',nextClick);});
  }
  ScrollTrigger.refresh();
  cleanupPage=()=>disposers.forEach(fn=>fn());
}

const header=document.querySelector('.site-header')!;
const onScroll=()=>header.classList.toggle('scrolled',scrollY>60);
addEventListener('scroll',onScroll,{passive:true});onScroll();
const menuButton=document.querySelector<HTMLButtonElement>('.menu-button')!;
const menu=document.querySelector<HTMLElement>('#mobile-menu')!;
const closeMenu=()=>{menu.hidden=true;menuButton.setAttribute('aria-expanded','false');lenis?.start();};
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));if(open)lenis?.stop();else lenis?.start();});
menu.addEventListener('click',e=>{if((e.target as HTMLElement).closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menuButton.focus();}});

// Audio only starts after an explicit click. No downloaded audio or autoplay.
const soundButton=document.querySelector<HTMLButtonElement>('.sound-button')!;
let audioContext:AudioContext|null=null;
soundButton.addEventListener('click',async()=>{
  if(!audioContext){audioContext=new AudioContext();const gain=audioContext.createGain();gain.gain.value=.025;gain.connect(audioContext.destination);[110,164.81,220.1].forEach(frequency=>{const oscillator=audioContext!.createOscillator();oscillator.type='sine';oscillator.frequency.value=frequency;oscillator.connect(gain);oscillator.start();});await audioContext.suspend();}
  const enabled=soundButton.getAttribute('aria-pressed')!=='true';
  if(enabled)await audioContext.resume();else await audioContext.suspend();
  soundButton.setAttribute('aria-pressed',String(enabled));soundButton.setAttribute('aria-label',enabled?'Mute ambient sound':'Enable ambient sound');
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&audioContext){void audioContext.suspend();soundButton.setAttribute('aria-pressed','false');soundButton.setAttribute('aria-label','Enable ambient sound');}});
swup.hooks.before('content:replace',()=>{closeMenu();cleanupPage();cleanupPage=()=>{};});
swup.hooks.on('page:view',()=>{initializePage();lenis?.resize();ScrollTrigger.refresh();});
initializePage();

// Restore an initial deep link after the sticky chapters and scroll owner exist.
// Native hash scrolling can otherwise race the first ScrollTrigger refresh.
if(location.hash){
  const initialHash=location.hash;
  requestAnimationFrame(()=>{
    if(location.hash!==initialHash)return;
    const target=swup.getAnchorElement(initialHash);
    if(!(target instanceof HTMLElement))return;
    ScrollTrigger.refresh();
    if(lenis){lenis.resize();lenis.scrollTo(target,{immediate:true,force:true});}
    else target.scrollIntoView();
  });
}
