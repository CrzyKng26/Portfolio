import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SceneLoader from "@/components/canvas/SceneLoader";
import CustomCursorLoader from "@/components/CustomCursorLoader";
import PreloaderLoader from "@/components/PreloaderLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GPTASTRA — Creative developer",
  description: "A digital portfolio for thoughtful identities, interactive systems, and motion-led experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        {/* Client-only loaders — SSR stays clean */}
        <SceneLoader />
        <CustomCursorLoader />
        <PreloaderLoader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
