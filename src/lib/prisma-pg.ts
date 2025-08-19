import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
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
