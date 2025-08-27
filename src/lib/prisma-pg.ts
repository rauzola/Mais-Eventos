import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

function createPrismaClient() {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_URL,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  // Configurações específicas para produção/Vercel
  if (process.env.NODE_ENV === "production") {
    // Desabilita prepared statements para evitar o erro
    client.$connect();
    
    // Cleanup na desconexão
    process.on("beforeExit", async () => {
      await client.$disconnect();
    });
  }

  return client;
}

export function PrismaGetInstance(): PrismaClient {
  return prisma;
}

// Função para limpar conexões (útil para Vercel)
export async function cleanupPrisma() {
  if (process.env.NODE_ENV === "production") {
    await prisma.$disconnect();
  }
}
