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

  return <LoginForm />;
}
