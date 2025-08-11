"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, TrendingUp, Activity } from "lucide-react";
import { Acampa2Charts } from "./Acampa2Charts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface StatsData {
  campistasAtivos: number;
  campistasInativos: number;
  servosAtivos: number;
  servosInativos: number;
  totalCampistas: number;
  totalServos: number;
  totalGeral: number;
}

export function Acampa2Stats() {
  const [stats, setStats] = useState<StatsData>({
    campistasAtivos: 0,
    campistasInativos: 0,
    servosAtivos: 0,
    servosInativos: 0,
    totalCampistas: 0,
    totalServos: 0,
    totalGeral: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar dados dos campistas
      const { data: campistasData, error: campistasError } = await supabase
        .from('Acampa2CampistaCarnaval2025')
        .select('ativo');

      if (campistasError) throw campistasError;

      // Buscar dados dos servos
      const { data: servosData, error: servosError } = await supabase
        .from('Acampa2ServosCarnaval2025')
        .select('ativo');

      if (servosError) throw servosError;

      // Calcular estatísticas
      const campistasAtivos = campistasData?.filter(c => c.ativo).length || 0;
      const campistasInativos = campistasData?.filter(c => !c.ativo).length || 0;
      const servosAtivos = servosData?.filter(s => s.ativo).length || 0;
      const servosInativos = servosData?.filter(s => !s.ativo).length || 0;

      const totalCampistas = campistasData?.length || 0;
      const totalServos = servosData?.length || 0;

      setStats({
        campistasAtivos,
        campistasInativos,
        servosAtivos,
        servosInativos,
        totalCampistas,
        totalServos,
        totalGeral: totalCampistas + totalServos
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="font-medium">Erro ao carregar estatísticas</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Total Campistas
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalCampistas}</div>
            <p className="text-xs text-muted-foreground">
              {stats.campistasAtivos} ativos, {stats.campistasInativos} inativos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">
              Total Servos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalServos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.servosAtivos} ativos, {stats.servosInativos} inativos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Total Geral
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalGeral}</div>
            <p className="text-xs text-muted-foreground">
              Participantes inscritos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">
              Taxa de Ativos
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalGeral > 0 ? Math.round(((stats.campistasAtivos + stats.servosAtivos) / stats.totalGeral) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.campistasAtivos + stats.servosAtivos} ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Acampa2Charts stats={stats} />

      {/* Botão de atualização */}
      {/* <div className="flex justify-center">
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          Atualizar Estatísticas
        </button>
      </div> */}
    </div>
  );
}
