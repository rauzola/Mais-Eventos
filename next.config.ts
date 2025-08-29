import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações básicas para Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
