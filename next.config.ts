import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para produção
  output: 'standalone',
  
  // Configurações de build
  experimental: {
    // Desabilitar features experimentais em produção
  },
  
  // Configurações de servidor
  serverExternalPackages: [],
  
  // Configurações de webpack
  webpack: (config, { isServer }) => {
    // Otimizações para produção
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    return config;
  },
  
  // Configurações de TypeScript
  typescript: {
    // Ignorar erros de TypeScript durante o build (apenas para produção)
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // Configurações de ESLint
  eslint: {
    // Ignorar erros de ESLint durante o build (apenas para produção)
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // Configurações de imagens
  images: {
    unoptimized: true,
  },
  
  // Configurações de renderização
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
