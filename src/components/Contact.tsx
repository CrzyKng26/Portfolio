"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-contact-reveal]", { y: 48, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="flex min-h-[88vh] flex-col justify-between px-6 pb-10 pt-32 md:px-14 md:pb-14 md:pt-40">
      <div>
        <p data-contact-reveal className="eyebrow mb-16 opacity-0">Have a good one?</p>
        <h2 data-contact-reveal className="display-text max-w-6xl text-[clamp(4rem,11vw,11rem)] font-semibold leading-[0.8] opacity-0">
          Let&apos;s make <span className="text-white/25">something</span> <span className="text-[var(--acid)]">real.</span>
        </h2>
        <a data-contact-reveal data-cursor="MAIL" href="mailto:hello@gptastra.studio" className="mt-16 inline-flex items-center gap-4 border-b border-white/20 pb-3 text-lg text-white/75 opacity-0 transition-colors duration-300 hover:border-[var(--acid)] hover:text-[var(--acid)] md:text-2xl">
          hello@gptastra.studio <span aria-hidden="true">↗</span>
        </a>
      </div>
      <footer className="mt-32 grid gap-10 border-t border-white/15 pt-6 md:grid-cols-3">
        <div><p className="eyebrow mb-3">Elsewhere</p><div className="flex gap-6 text-sm text-white/55"><a href="#" className="transition-colors hover:text-white">Instagram</a><a href="#" className="transition-colors hover:text-white">LinkedIn</a><a href="#" className="transition-colors hover:text-white">Are.na</a></div></div>
        <p className="eyebrow self-end md:text-center">Designing from anywhere</p>
        <p className="eyebrow self-end md:text-right">© {new Date().getFullYear()} GPTASTRA</p>
      </footer>
    </section>
  );
}
