"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const topRef     = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const countRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const counter = { val: 0 };

    const tl = gsap.timeline({
      onComplete() {
        document.body.style.overflow = "";
        // Remove from DOM flow after animation
        if (wrapRef.current) wrapRef.current.style.display = "none";
      },
    });

    // Count 0 → 100
    tl.to(counter, {
      val: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate() {
        if (countRef.current)
          countRef.current.textContent = String(Math.floor(counter.val));
      },
    });

    tl.to({}, { duration: 0.15 }); // beat

    // Curtain split
    tl.to(topRef.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "open");
    tl.to(bottomRef.current, { yPercent: 100, duration: 0.8, ease: "power4.inOut" }, "open");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[10000]" style={{ pointerEvents: "none" }}>
      {/* Top panel */}
      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-black flex items-end justify-center pb-1"
      >
        <span
          ref={countRef}
          className="font-mono text-[15vw] font-bold leading-none tracking-tighter text-white/80 select-none"
        >
          0
        </span>
      </div>
      {/* Bottom panel */}
      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-black"
      />
    </div>
  );
}
