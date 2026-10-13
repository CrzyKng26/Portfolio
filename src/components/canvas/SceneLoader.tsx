"use client";
/**
 * SceneLoader — Client Component wrapper.
 * ssr:false is only valid inside a Client Component, so this file
 * carries the "use client" directive. The outer layout stays an RSC.
 */
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
});

export default function SceneLoader() {
  return <Scene />;
}
