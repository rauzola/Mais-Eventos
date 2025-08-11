import { useState, useEffect } from "react";

export interface Perfil {
  nome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  estado_civil: string;
  profissao: string;
  telefone_contato: string;
  contato_emergencia: string;
  telefone_contato_emergencia: string;
  tamanho_camiseta: string;
}

export function usePerfil() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar os dados da API
  useEffect(() => {
    async function fetchPerfil() {
      try {
        const response = await fetch("/api/perfil");
        if (!response.ok) throw new Error("Erro ao buscar perfil");

        const data = await response.json();
        setPerfil(data);
      } catch (err) {
        setError("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    }
    fetchPerfil();
  }, []);

  // Atualizar os dados na API
  async function atualizarPerfil(novosDados: Perfil) {
    try {
      const response = await fetch("/api/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novosDados),
      });

      if (!response.ok) throw new Error("Erro ao atualizar perfil");

      setPerfil(novosDados);
    } catch (err) {
      setError("Erro ao atualizar perfil");
    }
  }

  return { perfil, loading, error, atualizarPerfil };
}
