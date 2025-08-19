"use client";

import useSWR from "swr";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ProtectedRoute from "@/components/ProtectedRoute";

type Role = "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN";

interface UserDTO {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function UsuariosPage() {
  const { data, error, isLoading, mutate } = useSWR<{ users: UserDTO[] }>("/api/users", fetcher);
  const [saving, setSaving] = useState<string | null>(null);

  const roles: Role[] = useMemo(() => ["USER", "STAFF", "COORD", "CONCELHO", "ADMIN"], []);

  const handleChangeRole = useCallback(
    async (userId: string, role: Role) => {
      try {
        setSaving(userId);
        await axios.put("/api/users", { userId, role });
        await mutate();
      } catch {
        // noop - poderia exibir um toast
      } finally {
        setSaving(null);
      }
    },
    [mutate]
  );

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Usuários</CardTitle>
              </CardHeader>
              <CardContent>Carregando...</CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Usuários</CardTitle>
              </CardHeader>
              <CardContent>Erro ao carregar usuários.</CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen p-6">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-600">
                      <th className="py-2">Email</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Criado</th>
                      <th className="py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.users?.map((u: UserDTO) => (
                      <tr key={u.id} className="border-t">
                        <td className="py-2">{u.email}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-3">
                            <Label className="text-xs text-gray-500">Permissão</Label>
                            <select
                              className="w-[180px] border rounded px-2 py-1"
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value as Role)}
                              disabled={saving === u.id}
                            >
                              {roles.map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="py-2">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                        <td className="py-2">
                          <Button size="sm" variant="outline" disabled>
                            Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}


