"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const outer = outerRef.current!;
    const inner = innerRef.current!;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outerX = mouseX;
    let outerY = mouseY;

    // Position inner dot exactly at cursor
    gsap.set([outer, inner], { xPercent: -50, yPercent: -50 });

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(inner, { x: mouseX, y: mouseY, duration: 0, ease: "none" });
    };

    // Outer ring follows with lerp
    const tick = () => {
      outerX += (mouseX - outerX) * 0.1;
      outerY += (mouseY - outerY) * 0.1;
      gsap.set(outer, { x: outerX, y: outerY });
    };
    gsap.ticker.add(tick);

    // Hover effects
    const onEnterLink = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const label = el.dataset.cursor ?? "";
      gsap.to(outer, { scale: 2.5, borderColor: "#fff", duration: 0.4, ease: "power3.out" });
      gsap.to(inner, { scale: 0, duration: 0.3 });
      if (labelRef.current) {
        labelRef.current.textContent = label || "VIEW";
        gsap.to(labelRef.current, { opacity: 1, duration: 0.3 });
      }
    };

    const onLeaveLink = () => {
      gsap.to(outer, { scale: 1, borderColor: "rgba(255,255,255,0.5)", duration: 0.4, ease: "power3.out" });
      gsap.to(inner, { scale: 1, duration: 0.3 });
      if (labelRef.current) gsap.to(labelRef.current, { opacity: 0, duration: 0.2 });
    };

    const onMouseDown = () => gsap.to(outer, { scale: 0.8, duration: 0.15 });
    const onMouseUp = () => gsap.to(outer, { scale: 1, duration: 0.15 });

    const addLinkListeners = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    addLinkListeners();

    // Re-add on DOM mutations (for dynamically added links)
    const observer = new MutationObserver(addLinkListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      gsap.ticker.remove(tick);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Outer ring with lag */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.5)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <span ref={labelRef} className="text-[7px] uppercase tracking-widest text-white opacity-0 select-none">
          VIEW
        </span>
      </div>
      {/* Inner dot - instant */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full bg-white"
        style={{ width: 5, height: 5, transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}
