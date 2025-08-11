import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["images.prismic.io", "images.unsplash.com", "placehold.co"], // Adicione o domínio do Prismic aqui
  },
};

export default nextConfig;
