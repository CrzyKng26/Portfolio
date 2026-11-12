import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* Detailing layer: the small, finished touches across the existing design.
   Nothing here changes layout or content; every effect has a reduced-motion path. */

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
type Dispose = () => void;

/* ------------------------------------------------------------------ */
/* Persistent chrome (header, menu, footer): set up once               */
/* ------------------------------------------------------------------ */
export function initChromeDetail(lenis: Lenis | null) {
  const root = document.documentElement;

  // Header hides while reading downwards and returns on the way up.
  const header = document.querySelector<HTMLElement>('.site-header');
  const menuButton = document.querySelector<HTMLButtonElement>('.menu-button');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    const menuOpen = menuButton?.getAttribute('aria-expanded') === 'true';
    const hide = !reduced && !menuOpen && y > 240 && y > lastY + 2 && !root.classList.contains('garage-mode');
    if (hide) header?.classList.add('is-tucked');
    else if (y < lastY - 2 || y <= 240) header?.classList.remove('is-tucked');
    lastY = y;
  };
  if (lenis) lenis.on('scroll', onScroll); else addEventListener('scroll', onScroll, { passive: true });
  header?.addEventListener('focusin', () => header.classList.remove('is-tucked'));
  // Reaching for the top of the window brings the header back.
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && e.clientY < 90) header?.classList.remove('is-tucked'); }, { passive: true });

  // Rolling labels on navigation: the word slides up and is replaced by its twin.
  document.querySelectorAll<HTMLElement>('.desktop-nav a, .contact-pill, .footer-links a').forEach(link => {
    const textNode = [...link.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent!.trim());
    if (!textNode || link.querySelector('.roll')) return;
    const text = textNode.textContent!.trim();
    const roll = document.createElement('span');
    roll.className = 'roll';
    const a = document.createElement('span'); a.textContent = text;
    const b = document.createElement('span'); b.textContent = text; b.setAttribute('aria-hidden', 'true');
    roll.append(a, b);
    textNode.replaceWith(roll, document.createTextNode(textNode.textContent!.endsWith(' ') ? ' ' : ''));
  });

  // Mobile menu: links rise in one after another, numbered.
  const menu = document.querySelector<HTMLElement>('#mobile-menu');
  if (menu && menuButton && !reduced) {
    new MutationObserver(() => {
      if (menuButton.getAttribute('aria-expanded') !== 'true') return;
      gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .7, ease: 'expo.out' });
      gsap.fromTo(menu.querySelectorAll('a'), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .8, ease: 'expo.out', stagger: .05, delay: .1 });
    }).observe(menuButton, { attributes: true, attributeFilter: ['aria-expanded'] });
  }

  // Footer wordmark: letters rise as the footer arrives.
  const footerName = document.querySelector<HTMLElement>('.footer-name');
  if (footerName && !footerName.querySelector('.footer-letter')) {
    const textNode = [...footerName.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent!.trim());
    if (textNode) {
      const word = document.createElement('span');
      word.className = 'footer-word';
      word.setAttribute('aria-label', textNode.textContent!.trim());
      [...textNode.textContent!.trim()].forEach(ch => {
        const letter = document.createElement('span');
        letter.className = 'footer-letter'; letter.textContent = ch; letter.setAttribute('aria-hidden', 'true');
        word.append(letter);
      });
      textNode.replaceWith(word);
      if (!reduced) {
        gsap.from(word.children, {
          yPercent: 105, duration: 1.3, ease: 'expo.out', stagger: .06,
          scrollTrigger: { trigger: '.site-footer', start: 'top 85%', toggleActions: 'play none none reset' },
        });
      }
    }
  }

  // Live local time in Chennai.
  const clock = document.querySelector<HTMLTimeElement>('time[data-clock]');
  if (clock) {
    const format = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    const tick = () => { const now = new Date(); clock.textContent = format.format(now); clock.dateTime = now.toISOString(); };
    tick();
    setInterval(tick, 20000);
  }
}

/* ------------------------------------------------------------------ */
/* Per-page detail                                                     */
/* ------------------------------------------------------------------ */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·✳';

/** Section labels decode from random glyphs into their text, once, as they enter. */
function scramble(el: HTMLElement) {
  const final = el.textContent ?? '';
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1, duration: Math.min(1.2, .35 + final.length * .03), ease: 'none',
    onUpdate: () => {
      const reveal = Math.floor(state.p * final.length);
      el.textContent = [...final].map((ch, i) => (i < reveal || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
    },
    onComplete: () => { el.textContent = final; },
  });
}

export function initPageDetail(scope: ParentNode = document): Dispose {
  if (reduced) return () => {};
  const disposers: Dispose[] = [];
  const triggers: ScrollTrigger[] = [];

  // 1. Scrambled section labels (only plain-text labels, so dynamic counters are untouched).
  scope.querySelectorAll<HTMLElement>('.section-index, .section-heading > .micro-label, .vision > .micro-label, .detail-heading > .micro-label, .work-index > .micro-label')
    .forEach(el => {
      if (el.children.length) return;
      const text = el.textContent;
      el.setAttribute('aria-label', text ?? '');
      let tween: gsap.core.Tween | null = null;
      triggers.push(ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => { tween = scramble(el); } }));
      disposers.push(() => { tween?.kill(); el.textContent = text; });
    });

  // 2. Image wipes: the frame opens from the bottom while the photo settles from a zoom.
  scope.querySelectorAll<HTMLElement>('.profile-portrait, .project-detail > figure, .project-preview figure, .project-index-card .project-art').forEach(frame => {
    const img = frame.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', once: true } })
      .fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' });
    if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0);
    disposers.push(() => { tl.scrollTrigger?.kill(); tl.progress(1).kill(); });
  });

  // 3. Experience: a line draws down the timeline; each chapter lights up as it passes.
  const timeline = scope.querySelector<HTMLElement>('.timeline');
  if (timeline) {
    triggers.push(ScrollTrigger.create({
      trigger: timeline, start: 'top 70%', end: 'bottom 60%', scrub: .4,
      onUpdate: self => timeline.style.setProperty('--progress', self.progress.toFixed(4)),
    }));
    timeline.querySelectorAll('article').forEach(article => {
      triggers.push(ScrollTrigger.create({ trigger: article, start: 'top 65%', end: 'bottom 40%', toggleClass: { targets: article, className: 'is-active' } }));
    });
  }

  // 4. "Make it felt": the two orbits counter-rotate with scroll.
  const vision = scope.querySelector<HTMLElement>('.vision');
  if (vision) {
    triggers.push(ScrollTrigger.create({
      trigger: vision, start: 'top bottom', end: 'bottom top', scrub: .6,
      onUpdate: self => vision.style.setProperty('--spin', `${(self.progress * 70).toFixed(2)}deg`),
    }));
  }

  // 5. Project screenshots drift inside their browser frame.
  scope.querySelectorAll<HTMLElement>('.project-preview figure a').forEach(frame => {
    const img = frame.querySelector('img');
    if (!img) return;
    const tween = gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
    disposers.push(() => { tween.scrollTrigger?.kill(); tween.revert(); });
  });

  // 6. Cards tilt towards the pointer.
  if (finePointer) {
    scope.querySelectorAll<HTMLElement>('[data-tilt]').forEach(card => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3' });
      gsap.set(card, { transformPerspective: 900 });
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 7);
        rx(-((e.clientY - r.top) / r.height - .5) * 7);
      };
      const leave = () => { rx(0); ry(0); };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      disposers.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); gsap.set(card, { clearProps: 'transform' }); });
    });
  }

  // 7. Cards and rows arrive in a stagger rather than all at once.
  const cards = scope.querySelectorAll('.project-index-card');
  if (cards.length) {
    const tween = gsap.from(cards, { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: cards[0], start: 'top 90%', once: true } });
    disposers.push(() => { tween.scrollTrigger?.kill(); tween.progress(1).kill(); });
  }

  return () => { triggers.forEach(t => t.kill()); disposers.forEach(fn => fn()); };
}
