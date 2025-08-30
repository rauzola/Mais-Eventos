import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-vercel";
import { checkConnection } from "@/lib/prisma-config";

export async function GET() {
  try {
    // Verifica a conexão com o banco
    const isConnected = await checkConnection(prisma);
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Database connection failed",
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    // Testa uma query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({
      status: "healthy",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      database: "connected",
      test: result
    });
  } catch (error) {
    console.error("Health check error:", error);
    
    return NextResponse.json(
      { 
        status: "error", 
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
