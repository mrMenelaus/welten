import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "nmsr.nickac.dev" },
      { hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
