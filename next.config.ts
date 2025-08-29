import type { NextConfig } from "next/types";

const nextConfig: NextConfig = {
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
