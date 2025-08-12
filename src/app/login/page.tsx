import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login";

export default async function Login() {
  // Verifica se o cookie de autenticação existe
  const cookieStore = await cookies();
  const authSession = cookieStore.get("auth-session");

  if (authSession?.value) {
    // Se o usuário já estiver autenticado, redireciona para o dashboard
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
