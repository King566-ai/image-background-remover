import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['regulation-bikini-trustees-placement.trycloudflare.com'],
};

export default nextConfig;
