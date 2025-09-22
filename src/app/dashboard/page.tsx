import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma-vercel";
import { LogoutButton } from "@/components/LogoutButton";

// Force dynamic rendering since this page uses cookies
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  try {
    // Verifica se o usuário está autenticado
    const cookieStore = await cookies();
    const authSession = cookieStore.get("auth-session");

    if (!authSession?.value) {
      // Se não estiver autenticado, redireciona para o login
      redirect("/login");
    }

    // Busca informações do usuário
    const session = await prisma.sessions.findFirst({
      where: {
        token: authSession.value,
        valid: true,
        expiresAt: { gt: new Date() }
      },
      include: {
        User: true
      }
    });

    if (!session) {
      // Sessão inválida, redireciona para login
      redirect("/login");
    }

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
          
          <div className="mt-8">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro no dashboard:", error);
    redirect("/login");
  }
}
