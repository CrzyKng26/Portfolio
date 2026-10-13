"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current?.querySelectorAll("[data-nav-item]") ?? [], { y: -14, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.8, delay: 1.85, ease: "power3.out",
      });
      ScrollTrigger.create({
        start: "top -60",
        onUpdate: () => { if (bgRef.current) bgRef.current.style.opacity = window.scrollY > 60 ? "1" : "0"; },
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between px-6 md:px-14">
      <div ref={bgRef} className="absolute inset-0 -z-10 border-b border-white/[0.08] bg-[#0a0a09]/75 opacity-0 backdrop-blur-xl transition-opacity duration-500" />
      <a data-nav-item href="#top" className="text-sm font-semibold tracking-[-0.04em] opacity-0">G/ASTRA<span className="text-[var(--coral)]">.</span></a>
      <div data-nav-item className="hidden items-center gap-9 opacity-0 md:flex">
        {["Works", "About", "Contact"].map((link) => <a key={link} href={`#${link.toLowerCase()}`} className="eyebrow text-white/45 transition-colors duration-300 hover:text-white">{link}</a>)}
      </div>
      <a data-nav-item href="mailto:hello@gptastra.studio" data-cursor="EMAIL" className="rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/70 opacity-0 transition-all duration-300 hover:border-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#0a0a09]">Start a project</a>
    </nav>
  );
}
