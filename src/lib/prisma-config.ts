import { PrismaClient } from "@prisma/client";

// Função para criar instância do Prisma com configurações otimizadas
export function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    // Configurações de log baseadas no ambiente
    log: process.env.NODE_ENV === "development" 
      ? ["query", "error", "warn"]
      : ["error"],
    
    // Configurações de datasource
    datasources: {
      db: {
        url: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
      },
    },
  });
}

// Função para limpar conexões de forma segura
export async function safeDisconnect(client: PrismaClient): Promise<void> {
  try {
    await client.$disconnect();
  } catch (error) {
    console.error("Erro ao desconectar Prisma:", error);
  }
}

// Função para verificar saúde da conexão
export async function checkConnection(client: PrismaClient): Promise<boolean> {
  try {
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Erro na verificação de conexão:", error);
    return false;
  }
}
