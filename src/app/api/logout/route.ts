// app/api/logout/route.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-session"); // Apaga o cookie de sessão
  cookieStore.delete("auth-email"); // Apaga o cookie de sessão
  cookieStore.delete("auth-nome-completo"); // Apaga o cookie de sessão
  redirect("/login"); // Redireciona para a página de login
}