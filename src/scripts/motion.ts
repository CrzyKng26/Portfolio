import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
type Dispose = () => void;

/* ------------------------------------------------------------------ */
/* Preloader + sound gate (first visit of a session only)              */
/* ------------------------------------------------------------------ */
export function initPreloader(onEnter: (withSound: boolean) => void) {
  const root = document.documentElement;
  const loader = document.querySelector<HTMLElement>('[data-preloader]');
  if (!loader || root.classList.contains('preloaded')) {
    root.classList.add('preloaded', 'entered');
    return;
  }
  const count = loader.querySelector<HTMLElement>('[data-preloader-count]')!;
  const counter = { value: 0 };
  const ready = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    document.readyState === 'complete' ? Promise.resolve() : new Promise(r => addEventListener('load', r, { once: true })),
  ]);
  // The counter eases towards 90 while assets load, then completes.
  const tween = gsap.to(counter, {
    value: 90, duration: reduced ? .2 : 1.6, ease: 'power2.out',
    onUpdate: () => { count.textContent = String(Math.round(counter.value)).padStart(3, '0'); },
  });
  void ready.then(() => {
    tween.kill();
    gsap.to(counter, {
      value: 100, duration: reduced ? .1 : .5, ease: 'power3.out',
      onUpdate: () => { count.textContent = String(Math.round(counter.value)).padStart(3, '0'); },
      onComplete: () => {
        loader.classList.add('is-ready');
        loader.querySelector<HTMLButtonElement>('[data-enter-quiet]')?.focus({ preventScroll: true });
      },
    });
  });

  const enter = (withSound: boolean) => {
    try { sessionStorage.setItem('kannan:entered', '1'); } catch { /* private mode */ }
    loader.classList.add('is-leaving');
    onEnter(withSound);
    const done = () => { root.classList.add('preloaded'); loader.remove(); };
    root.classList.add('entered');
    if (reduced) { done(); return; }
    gsap.timeline({ onComplete: done })
      .to(loader.querySelector('.preloader-gate'), { opacity: 0, y: 16, duration: .35, ease: 'power2.in' })
      .to(loader.querySelector('.preloader-k'), { yPercent: -110, duration: .7, ease: 'expo.inOut' }, '<.1')
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '<.25');
  };
  loader.querySelector('[data-enter-sound]')?.addEventListener('click', () => enter(true), { once: true });
  loader.querySelector('[data-enter-quiet]')?.addEventListener('click', () => enter(false), { once: true });
}

/* ------------------------------------------------------------------ */
/* Cursor: global and persistent across Swup visits                    */
/* ------------------------------------------------------------------ */
export function initCursor() {
  const cursor = document.querySelector<HTMLElement>('.cursor');
  if (!cursor || !finePointer || reduced) return;
  document.documentElement.classList.add('has-cursor');
  const dot = cursor.querySelector<HTMLElement>('.cursor-dot')!;
  const ring = cursor.querySelector<HTMLElement>('.cursor-ring')!;
  const label = cursor.querySelector<HTMLElement>('[data-cursor-label]')!;
  const dotX = gsap.quickTo(dot, 'x', { duration: .08, ease: 'power3' });
  const dotY = gsap.quickTo(dot, 'y', { duration: .08, ease: 'power3' });
  const ringX = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3' });
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY);
    cursor.classList.remove('is-hidden');
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.addEventListener('pointerover', e => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, [role="button"]');
    const text = target?.dataset.cursor ?? '';
    cursor.classList.toggle('is-hover', Boolean(target));
    cursor.classList.toggle('has-label', Boolean(text));
    if (text) label.textContent = text;
  });
}

/* ------------------------------------------------------------------ */
/* Per-page effects. Each returns a disposer for Swup page swaps.      */
/* ------------------------------------------------------------------ */
export function initMagnetic(scope: ParentNode = document): Dispose {
  if (!finePointer || reduced) return () => {};
  const disposers: Dispose[] = [];
  scope.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el => {
    const x = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
    const y = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * .35);
      y((e.clientY - (r.top + r.height / 2)) * .35);
    };
    const leave = () => { x(0); y(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    disposers.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.set(el, { x: 0, y: 0 }); });
  });
  return () => disposers.forEach(fn => fn());
}

export function initSplitReveals(scope: ParentNode = document): Dispose {
  const targets = [...scope.querySelectorAll<HTMLElement>('[data-split]')];
  if (reduced || !targets.length) return () => {};
  const splits: SplitText[] = [];
  const tweens: gsap.core.Tween[] = [];
  targets.forEach(el => {
    // Lines are masked so each one rises out of its own baseline.
    const split = SplitText.create(el, { type: 'lines,words', linesClass: 'split-line', mask: 'lines', aria: 'auto' });
    splits.push(split);
    tweens.push(gsap.from(split.words, {
      yPercent: 115, rotate: 4, duration: 1.15, ease: 'expo.out', stagger: .035,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    }));
  });
  return () => { tweens.forEach(t => { t.scrollTrigger?.kill(); t.kill(); }); splits.forEach(s => s.revert()); };
}

export function initVelocityMarquee(lenis: Lenis | null, scope: ParentNode = document): Dispose {
  const track = scope.querySelector<HTMLElement>('.velocity-track');
  if (!track || reduced) return () => {};
  const copy = track.firstElementChild as HTMLElement;
  let x = 0, skew = 0;
  const setX = gsap.quickSetter(track, 'x', 'px');
  const setSkew = gsap.quickSetter(track, 'skewX', 'deg');
  const tick = (_t: number, delta: number) => {
    const velocity = lenis ? lenis.velocity : 0;
    const width = copy.offsetWidth || 1;
    x -= (0.6 + Math.min(Math.abs(velocity), 60) * .35) * (delta / 16.7) * (velocity < 0 ? -1 : 1);
    x = ((x % width) - width) % width;
    skew += (gsap.utils.clamp(-8, 8, -velocity * .25) - skew) * .1;
    setX(x); setSkew(skew);
  };
  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}

export function initScrollProgress(): Dispose {
  const bar = document.querySelector<HTMLElement>('.scroll-progress span');
  if (!bar) return () => {};
  const set = gsap.quickSetter(bar, 'scaleX');
  const trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => set(self.progress), onRefresh: self => set(self.progress) });
  return () => trigger.kill();
}

/** Hero entrance after the preloader. Uses only yPercent/rotationX on letters so it never
 *  fights the scroll-scrubbed absorption timeline (which owns x, z, rotationY, opacity). */
export function playHeroEntrance(): Dispose {
  const letters = document.querySelectorAll('.hero-letter');
  if (!letters.length || reduced) return () => {};
  gsap.set('.hero-portrait img', { xPercent: -50, x: 0 });
  const tl = gsap.timeline({ delay: .15 })
    .from(letters, { yPercent: 105, rotationX: -70, transformOrigin: '50% 100%', duration: 1.4, ease: 'expo.out', stagger: .06 })
    .from('.hero-eyebrow span, .hero-intro > *, .hero-news > *, .hero-baseline > *', { y: 24, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: .05 }, .45)
    .from('.hero-portrait img', { scale: 1.12, duration: 2.2, ease: 'expo.out' }, 0);
  return () => tl.progress(1).kill();
}

/** Subtle pointer parallax on the hero portrait and grid. */
export function initHeroParallax(): Dispose {
  const portrait = document.querySelector<HTMLElement>('.hero-portrait img');
  const grid = document.querySelector<HTMLElement>('.hero-grid');
  if (!portrait || !finePointer || reduced) return () => {};
  // The CSS centres the image with translateX(-50%); keep that in GSAP's transform cache.
  gsap.set(portrait, { xPercent: -50, x: 0 });
  const px = gsap.quickTo(portrait, 'x', { duration: 1.2, ease: 'power3' });
  const py = gsap.quickTo(portrait, 'y', { duration: 1.2, ease: 'power3' });
  const gx = grid ? gsap.quickTo(grid, 'xPercent', { duration: 1.6, ease: 'power3' }) : null;
  const move = (e: PointerEvent) => {
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    px(nx * -24); py(ny * -16); gx?.(nx * 1.5);
  };
  addEventListener('pointermove', move, { passive: true });
  return () => removeEventListener('pointermove', move);
}
