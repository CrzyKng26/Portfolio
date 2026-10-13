"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleLines = titleRef.current?.querySelectorAll("[data-line]");
      gsap.fromTo(titleLines ?? [], { yPercent: 110, rotate: 2 }, {
        yPercent: 0, rotate: 0, stagger: 0.11, duration: 1.35, delay: 1.8, ease: "power4.out",
      });
      gsap.fromTo(metaRef.current, { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, delay: 2.35, ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[92vh] overflow-hidden px-6 pb-10 pt-28 md:px-14 md:pb-14 md:pt-36">
      <div className="pointer-events-none absolute -right-24 top-24 h-[42vw] w-[42vw] rounded-full bg-[#d9ff70]/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[38vw] w-[38vw] rounded-full bg-[#ff745b]/[0.08] blur-[140px]" />

      <div className="relative z-10 flex min-h-[calc(92vh-11rem)] flex-col justify-end">
        <div className="mb-10 flex items-center gap-4 md:mb-16">
          <span className="h-2 w-2 rounded-full bg-[var(--acid)] shadow-[0_0_18px_var(--acid)]" />
          <p className="eyebrow">Independent creative developer / 2026</p>
        </div>

        <h1 ref={titleRef} className="display-text max-w-[1150px] overflow-hidden text-[clamp(4.6rem,14vw,13.2rem)] font-semibold leading-[0.78]">
          <span className="block overflow-hidden"><span data-line className="block">Ideas</span></span>
          <span className="block overflow-hidden"><span data-line className="block text-white/25">into</span></span>
          <span className="block overflow-hidden"><span data-line className="block">orbit<span className="text-[var(--coral)]">.</span></span></span>
        </h1>

        <div ref={metaRef} className="mt-14 grid grid-cols-1 gap-8 border-t border-white/15 pt-5 opacity-0 md:grid-cols-[1.3fr_0.7fr_0.7fr] md:gap-4">
          <p className="max-w-md text-sm leading-6 text-white/55 md:text-base md:leading-7">
            GPTASTRA is a one-person practice for brands, products, and worlds that deserve a little more imagination.
          </p>
          <div><p className="eyebrow mb-2">Based in</p><p className="text-sm text-white/70">Earth / available everywhere</p></div>
          <div><p className="eyebrow mb-2">Currently</p><p className="text-sm text-white/70">Taking on a few good ideas</p></div>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 flex items-center gap-3 md:right-14">
        <span className="eyebrow">Scroll to explore</span>
        <span className="relative h-8 w-4 rounded-full border border-white/25"><span className="absolute left-1/2 top-1 h-1.5 w-px -translate-x-1/2 bg-[var(--acid)]" style={{ animation: "scrollDot 1.8s ease-in-out infinite" }} /></span>
      </div>
      <div className="absolute bottom-0 inset-x-0 hairline" />
    </section>
  );
}
