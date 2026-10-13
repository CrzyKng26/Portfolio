import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep this copied portfolio isolated from the parent workspace lockfile.
  turbopack: { root: process.cwd() },
  distDir: "build-external",
};

export default nextConfig;
