"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRINCIPLES = [
  ["01", "Make it felt", "A clear idea is good. A clear idea with a pulse is better."],
  ["02", "Stay curious", "The best direction usually lives one question beyond the brief."],
  ["03", "Keep it human", "Technology should open the door, never stand in it."],
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-about-reveal]", { y: 42, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen px-6 py-32 md:px-14 md:py-48">
      <div className="mx-auto max-w-[1280px]">
        <p data-about-reveal className="eyebrow mb-16 opacity-0">A little context</p>
        <div className="grid gap-16 md:grid-cols-[1.15fr_0.85fr] md:gap-24">
          <h2 data-about-reveal className="display-text max-w-4xl text-[clamp(3rem,7vw,7.4rem)] font-semibold leading-[0.86] opacity-0">
            Good work lives between <span className="text-white/25">a plan</span> and a happy accident<span className="text-[var(--coral)]">.</span>
          </h2>
          <div data-about-reveal className="self-end opacity-0">
            <p className="max-w-md text-base leading-7 text-white/55 md:text-lg md:leading-8">
              I partner with people who care about the details. Together we make identities, interfaces, and digital spaces that feel inevitable once they exist.
            </p>
            <p className="mt-8 max-w-md text-sm leading-6 text-white/35">
              Strategy, art direction, design, and development — one continuous loop from first sketch to final interaction.
            </p>
          </div>
        </div>

        <div className="mt-32 border-t border-white/15">
          {PRINCIPLES.map(([number, title, copy]) => (
            <div key={number} data-about-reveal className="grid grid-cols-[44px_1fr] gap-4 border-b border-white/10 py-7 opacity-0 md:grid-cols-[80px_1fr_1fr] md:gap-8">
              <span className="eyebrow text-white/35">{number}</span>
              <h3 className="text-lg text-white/80 md:text-xl">{title}</h3>
              <p className="col-start-2 max-w-sm text-sm leading-6 text-white/40 md:col-start-3">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
