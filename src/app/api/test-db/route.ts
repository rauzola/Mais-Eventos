import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-vercel";

export async function GET() {
  try {
    console.log("Testando conexão com banco...");
    console.log("POSTGRES_URL configurada:", !!process.env.POSTGRES_URL);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    
    // Testar conexão simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("Conexão OK, resultado:", result);
    
    return NextResponse.json({ 
      status: "Conexão OK", 
      result,
      env: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error("Erro no teste de conexão:", error);
    
    let errorMessage = "Erro desconhecido";
    let errorCode = "UNKNOWN";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("Can't reach database server")) {
        errorCode = "CONNECTION_FAILED";
      } else if (error.message.includes("Authentication failed")) {
        errorCode = "AUTH_FAILED";
      } else if (error.message.includes("database does not exist")) {
        errorCode = "DB_NOT_FOUND";
      }
    }
    
    return NextResponse.json(
      { 
        error: "Erro de conexão", 
        code: errorCode,
        message: errorMessage,
        details: error instanceof Error ? error.message : "Erro desconhecido",
        env: {
          hasPostgresUrl: !!process.env.POSTGRES_URL,
          nodeEnv: process.env.NODE_ENV
        }
      },
      { status: 500 }
    );
  }
}
