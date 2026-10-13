"use client";
import dynamic from "next/dynamic";
const Preloader = dynamic(() => import("./Preloader"), { ssr: false, loading: () => null });
export default function PreloaderLoader() {
  return <Preloader />;
}
