"use client";

const ITEMS = [
  "Creative development",
  "✳",
  "Identity systems",
  "✳",
  "Web experiences",
  "✳",
  "Motion & code",
  "✳",
  "Digital worlds",
  "✳",
  "Art direction",
  "✳",
];

interface MarqueeProps {
  reverse?: boolean;
  className?: string;
}

export default function Marquee({ reverse = false, className = "" }: MarqueeProps) {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <div
        className="marquee-inner"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-xs uppercase tracking-[0.25em] text-white/20 mr-6 shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
