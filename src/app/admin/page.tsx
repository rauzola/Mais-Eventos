"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/LogoutButton";
import ProtectedRoute from "@/components/ProtectedRoute";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🏠 Dashboard Administrativo
            </h1>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Bem-vindo!
              </h2>
              <p className="text-blue-800">
                Você está logado como: <strong>{user.email}</strong>
              </p>
              <p className="text-blue-800 mt-1">
                Permissão: <strong>{user.role}</strong>
              </p>
            </div>
          </div>

          {/* Menu de Navegação */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Seção: Administração */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-900">
                  ⚙️ Administração
                </CardTitle>
                <CardDescription>
                  Funcionalidades administrativas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/admin")}
                >
                  🏠 Dashboard Admin
                </Button>
                {user.role === "ADMIN" && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/admin/usuarios")}
                  >
                    👥 Gerenciar Usuários
                  </Button>
                )}
              </CardContent>
            </Card>

         
            {/* Seção: Navegação Geral */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-900">🧭 Navegação</CardTitle>
                <CardDescription>Outras páginas do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/")}
                >
                  🏠 Página Inicial
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard")}
                >
                  ℹ️ Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Seção: Informações do Sistema */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-gray-900">ℹ️ Informações</CardTitle>
                <CardDescription>Dados da conta e sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p>
                    <strong>ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Criado:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-center">
                  <LogoutButton />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500">
            <p>Sistema de Autenticação e Autorização - Versão 1.0</p>
            <p className="text-sm mt-1">© 2025 Raul Sigoli</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
