import { PrismaClient } from "@prisma/client";

// Configuração específica para Vercel
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
      },
    },
    log: ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Função para limpar conexões
export async function cleanupPrisma() {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao desconectar Prisma:", error);
  }
}

// Cleanup automático para Vercel
if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", cleanupPrisma);
  process.on("SIGINT", cleanupPrisma);
  process.on("SIGTERM", cleanupPrisma);
}
