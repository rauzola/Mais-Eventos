import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma-vercel";
import { LogoutButton } from "@/components/LogoutButton";

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

    type SessionWithUser = typeof session & { User: { role?: string } };
    const userRole = (session as SessionWithUser)?.User?.role || undefined;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Dashboard
            </h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Bem-vindo!
              </h2>
              <p className="text-blue-800">
                Você está logado como: <strong>{session.User.email}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Status da Sessão
                </h3>
                <p className="text-green-800">
                  Sua sessão está ativa e válida até: <br />
                  <strong>{session.expiresAt.toLocaleString('pt-BR')}</strong>
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Informações da Conta
                </h3>
                <p className="text-purple-800">
                  ID do usuário: <strong>{session.User.id}</strong><br />
                  Criado em: <strong>{session.User.createdAt.toLocaleDateString('pt-BR')}</strong><br />
                  Permissão: <strong>{userRole ?? "USER"}</strong>
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro no dashboard:", error);
    redirect("/login");
  }
}
