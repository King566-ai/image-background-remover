import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 使用 Cloudflare Pages 适配器，不需要 output: 'export'
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['regulation-bikini-trustees-placement.trycloudflare.com'],
};

export default nextConfig;
