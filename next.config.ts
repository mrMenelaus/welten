import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "nmsr.nickac.dev" },
      { hostname: "nxq44gfls2.ufs.sh" },
    ],
  },
};

export default nextConfig;
