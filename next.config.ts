import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "nmsr.nickac.dev" }],
  },
};

export default nextConfig;
