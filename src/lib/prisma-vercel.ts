import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Cleanup function for Vercel
export async function cleanupPrisma() {
  if (process.env.NODE_ENV === "production") {
    await prisma.$disconnect();
  }
}

// Handle process termination
process.on("beforeExit", async () => {
  await cleanupPrisma();
});

process.on("SIGINT", async () => {
  await cleanupPrisma();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await cleanupPrisma();
  process.exit(0);
});
