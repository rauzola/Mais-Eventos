import type { NextConfig } from "next/types";

const nextConfig: NextConfig = {
  // Configuração de imagens para permitir domínios externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configurações para otimizar performance na Vercel
  ...(process.env.NODE_ENV === "production" && {
    // Otimizações de build para produção
    compress: true,
    poweredByHeader: false,
    generateEtags: false,
  }),
  // Configurações de headers para melhorar performance
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
