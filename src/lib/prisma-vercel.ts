import { PrismaClient } from "@prisma/client";
import { createPrismaClient, safeDisconnect, checkConnection } from "./prisma-config";

// Configuração específica para Vercel com pool otimizado
const prismaClientSingleton = () => {
  return createPrismaClient();
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Função para limpar conexões
export async function cleanupPrisma() {
  await safeDisconnect(prisma);
}

// Cleanup automático para Vercel
if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", cleanupPrisma);
  process.on("SIGINT", cleanupPrisma);
  process.on("SIGTERM", cleanupPrisma);
  
  // Cleanup adicional para evitar vazamentos de memória
  setInterval(async () => {
    try {
      const isHealthy = await checkConnection(prisma);
      if (!isHealthy) {
        console.warn("Conexão do banco não está saudável, tentando reconectar...");
        await cleanupPrisma();
        // Recria a instância
        globalForPrisma.prisma = createPrismaClient();
      }
    } catch (error) {
      console.error("Erro na verificação de conexão:", error);
      await cleanupPrisma();
    }
  }, 300000); // Verifica a cada 5 minutos
}
