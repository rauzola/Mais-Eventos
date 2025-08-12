"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Faz a requisição de logout
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redireciona para a página de login
        router.push("/login");
        router.refresh(); // Força a atualização do cache
      } else {
        console.error("Erro no logout:", response.statusText);
        // Em caso de erro, ainda redireciona para login
        router.push("/login");
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      // Em caso de erro, redireciona para login
      router.push("/login");
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
    >
      Sair
    </button>
  );
}
