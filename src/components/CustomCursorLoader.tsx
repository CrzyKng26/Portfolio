"use client";
import dynamic from "next/dynamic";
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false, loading: () => null });
export default function CustomCursorLoader() {
  return <CustomCursor />;
}
