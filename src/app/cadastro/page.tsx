// /app/cadastro/route.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/Register";

export default async function Cadastro() {
  // Verifica se o cookie de autenticação existe
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-session");

  if (authCookie?.value) {
    // Se o usuário já estiver autenticado, redireciona para /autenticado
    redirect("/autenticado");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
