"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const PROJECTS = [
  {
    id: "01",
    title: "Aether / 01",
    subtitle: "A sonic identity for a future-facing music platform.",
    tags: ["Identity", "WebGL", "Direction"],
    year: "2026",
    color: "#d9ff70",
    bgFrom: "#202d1a",
    bgTo: "#657d2b",
  },
  {
    id: "02",
    title: "Morrow / 02",
    subtitle: "A tactile showroom where fashion meets the open web.",
    tags: ["Digital retail", "Motion", "Editorial"],
    year: "2025",
    color: "#ff745b",
    bgFrom: "#3d1b18",
    bgTo: "#a84d3c",
  },
  {
    id: "03",
    title: "Kite / 03",
    subtitle: "A playful campaign platform built to move at the speed of culture.",
    tags: ["Campaign", "Creative tech", "Launch"],
    year: "2025",
    color: "#f3b35c",
    bgFrom: "#3a2412",
    bgTo: "#9b6425",
  },
  {
    id: "04",
    title: "Field Notes / 04",
    subtitle: "A living archive for a new kind of independent publication.",
    tags: ["Editorial", "Platform", "Typography"],
    year: "2024",
    color: "#8ad7d0",
    bgFrom: "#123234",
    bgTo: "#2d7773",
  },
  {
    id: "05",
    title: "North / 05",
    subtitle: "A quiet digital home for a studio with a lot to say.",
    tags: ["Strategy", "Design system", "Build"],
    year: "2024",
    color: "#b6b3ff",
    bgFrom: "#20203b",
    bgTo: "#53518b",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELIX GEOMETRY
   
   Each card sits on a helical path:
     x = sin(θ) × R        — horizontal arc
     y = offset  × Δy      — vertical spiral step
     z = (cos(θ) - 1) × R  — depth (0 at center, negative at sides)
     rotateY = -θ           — face toward center
   
   This produces a TRUE 3D spiral, not a flat carousel.
   ═══════════════════════════════════════════════════════════════════════════ */

const CARD_W   = 560;
const CARD_H   = 350;
const ANGLE    = 45;    // degrees between cards
const RADIUS   = 580;   // helix radius px
const Y_STEP   = 50;    // vertical offset per card

function computeHelix(offset: number) {
  const deg = offset * ANGLE;
  const rad = (deg * Math.PI) / 180;

  const x      = Math.sin(rad) * RADIUS;
  const z      = (Math.cos(rad) - 1) * RADIUS;
  const y      = offset * Y_STEP;
  const rotY   = -deg;
  const dist   = Math.abs(offset);
  const scale  = Math.max(0.5, 1 - dist * 0.15);
  const opa    = Math.max(0, 1 - dist * 0.35);
  const zIdx   = 200 - Math.round(dist * 40); // center = highest

  return { x, y, z, rotY, scale, opa, zIdx };
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SpiralWorks() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);
  const cardsRef  = useRef<(HTMLDivElement | null)[]>([]);
  const infoRef   = useRef<HTMLDivElement>(null);
  const countRef  = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  /* ── Position every card imperatively (zero re-renders) ── */
  const layout = useCallback((rawIdx: number) => {
    PROJECTS.forEach((_, i) => {
      const el = cardsRef.current[i];
      if (!el) return;
      const off = i - rawIdx;
      const { x, y, z, rotY, scale, opa, zIdx } = computeHelix(off);
      el.style.transform =
        `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
      el.style.opacity   = String(opa);
      el.style.zIndex    = String(zIdx);
    });
  }, []);

  useEffect(() => {
    layout(0); // initial position

    const pin = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: `+=${PROJECTS.length * 100}vh`,
      pin: stageRef.current,
      scrub: 1.2,
      onUpdate(self) {
        const raw = self.progress * (PROJECTS.length - 1);
        layout(raw);

        const idx = Math.round(raw);
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);

          // Animate project info swap
          if (infoRef.current) {
            gsap.fromTo(
              infoRef.current.querySelectorAll("[data-reveal]"),
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.04, duration: 0.45, ease: "power3.out", overwrite: true }
            );
          }

          // Counter
          if (countRef.current) {
            countRef.current.textContent =
              `${String(idx + 1).padStart(2, "0")} / ${String(PROJECTS.length).padStart(2, "0")}`;
          }
        }
      },
    });

    return () => pin.kill();
  }, [layout]);

  const proj = PROJECTS[active];

  return (
    <div ref={wrapRef} id="works">
      {/* ── Pinned stage (full viewport) ── */}
      <div
        ref={stageRef}
        className="relative w-screen h-screen overflow-hidden"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 48%" }}
      >
        {/* Label */}
        <p className="absolute top-10 left-8 md:left-14 z-40 text-[9px] font-mono uppercase tracking-[0.55em] text-white/15 select-none">
          Works
        </p>

        {/* Counter */}
        <span
          ref={countRef}
          className="absolute top-10 right-8 md:right-14 z-40 text-[9px] font-mono text-white/15 tabular-nums select-none"
        >
          01 / {String(PROJECTS.length).padStart(2, "0")}
        </span>

        {/* ── Cards ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              data-cursor="VIEW"
              className="absolute pointer-events-auto"
              style={{
                width: CARD_W,
                height: CARD_H,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
                transition: "none",
              }}
            >
              <div
                className="w-full h-full rounded-xl overflow-hidden relative"
                style={{
                  background: `linear-gradient(145deg, ${p.bgFrom}, ${p.bgTo})`,
                  border: `1px solid rgba(255,255,255,0.05)`,
                  boxShadow: i === active
                    ? `0 8px 80px -16px ${p.color}50, inset 0 1px 0 rgba(255,255,255,0.06)`
                    : `0 4px 30px -8px rgba(0,0,0,0.6)`,
                }}
              >
                {/* Grid texture */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(${p.color}08 1px, transparent 1px),
                      linear-gradient(90deg, ${p.color}08 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                  }}
                />

                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

                {/* Top */}
                <div className="absolute top-4 inset-x-5 flex justify-between text-[8px] font-mono uppercase tracking-[0.3em]">
                  <span style={{ color: `${p.color}77` }}>{p.year}</span>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ border: `1px solid ${p.color}25`, color: `${p.color}99` }}
                  >
                    {p.id}
                  </span>
                </div>

                {/* Center orb */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `1px solid ${p.color}20`,
                        boxShadow: `0 0 50px ${p.color}12`,
                        animation: "pulse 3s ease-in-out infinite",
                      }}
                    />
                    <div
                      className="absolute inset-4 rounded-full"
                      style={{ background: `radial-gradient(circle, ${p.color}44, transparent)` }}
                    />
                  </div>
                </div>

                {/* Bottom */}
                <div className="absolute bottom-4 inset-x-5">
                  <h3
                    className="text-base font-semibold tracking-tight mb-0.5"
                    style={{ textShadow: `0 0 20px ${p.color}44` }}
                  >
                    {p.title}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[7px] font-mono uppercase tracking-wider text-white/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress rail ── */}
        <div className="absolute right-8 md:right-14 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2">
          {PROJECTS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: 2,
                height: i === active ? 24 : 4,
                background: i === active ? "#fff" : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>

        {/* ── Project info overlay ── */}
        <div
          ref={infoRef}
          className="absolute bottom-0 inset-x-0 z-40 px-8 md:px-14 pb-12 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
          }}
        >
          <div className="overflow-hidden mb-1">
            <p
              data-reveal
              className="text-[8px] font-mono uppercase tracking-[0.4em]"
              style={{ color: `${proj.color}88` }}
            >
              {proj.year} — {proj.tags.join(" · ")}
            </p>
          </div>
          <div className="overflow-hidden mb-1">
            <h2 data-reveal className="text-3xl md:text-5xl font-bold tracking-tight leading-none">
              {proj.title}
            </h2>
          </div>
          <div className="overflow-hidden">
            <p data-reveal className="text-sm text-white/30 max-w-md">
              {proj.subtitle}
            </p>
          </div>
        </div>

        {/* ── Decorative spiral glyph ── */}
        <div className="absolute left-8 md:left-14 top-1/2 -translate-y-1/2 z-30 pointer-events-none opacity-20">
          <svg width="12" height="90" viewBox="0 0 12 90">
            <path
              d="M6 2C12 16,0 30,6 44C12 58,0 72,6 88"
              stroke="currentColor"
              strokeWidth="0.8"
              fill="none"
              strokeDasharray="2 4"
            />
            <circle cx="6" cy="44" r="2" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
