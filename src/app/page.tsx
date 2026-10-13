import Hero from "@/components/Hero";
import About from "@/components/About";
import SpiralWorks from "@/components/SpiralWorks";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Marquee from "@/components/Marquee";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top" className="w-full flex flex-col">
        <Hero />
        <Marquee className="py-5 border-y border-white/5" />
        <SpiralWorks />
        <About />
        <Marquee reverse className="py-5 border-y border-white/5" />
        <Contact />
      </main>
    </>
  );
}
