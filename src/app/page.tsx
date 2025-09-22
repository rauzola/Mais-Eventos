import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma-vercel";

// Force dynamic rendering since this page uses cookies
export const dynamic = 'force-dynamic';

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
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🚧</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Em Construção
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              O gerenciamento de eventos está sendo desenvolvido.
            </p>
            <p className="text-gray-500">
              Em breve teremos novidades! 📅
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro na página inicial:", error);
    redirect("/login");
  }
}
