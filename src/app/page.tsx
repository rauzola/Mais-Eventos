import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma-vercel";

export default async function Home() {
  try {
    // Verifica se o usuário está autenticado
    const cookieStore = await cookies();
    const authSession = cookieStore.get("auth-session");

    if (!authSession?.value) {
      redirect("/login");
    }

    // Verifica se a sessão é válida
    const session = await prisma.sessions.findFirst({
      where: {
        token: authSession.value,
        valid: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      redirect("/login");
    }

    // Se chegou aqui, o usuário está autenticado
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Bem-vindo ao Mais Eventos!
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Você está logado com sucesso.
          </p>
          <div className="text-center">
            <a
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ir para o Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro na página inicial:", error);
    redirect("/login");
  }
}
