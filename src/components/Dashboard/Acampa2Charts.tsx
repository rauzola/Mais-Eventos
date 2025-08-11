"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  campistasAtivos: number;
  campistasInativos: number;
  servosAtivos: number;
  servosInativos: number;
}

const COLORS = {
  ativo: "#10B981",
  inativo: "#EF4444",
  campista: "#3B82F6",
  servo: "#8B5CF6"
};

interface Acampa2ChartsProps {
  stats: ChartData;
}

export function Acampa2Charts({ stats }: Acampa2ChartsProps) {
  // Dados para o gráfico de barras
  const barChartData = [
    {
      name: 'Campistas',
      Ativos: stats.campistasAtivos,
      Inativos: stats.campistasInativos,
    },
    {
      name: 'Servos',
      Ativos: stats.servosAtivos,
      Inativos: stats.servosInativos,
    }
  ];

  // Dados para o gráfico de pizza
  const pieChartData = [
    { name: 'Campistas Ativos', value: stats.campistasAtivos, color: COLORS.campista },
    { name: 'Campistas Inativos', value: stats.campistasInativos, color: '#93C5FD' },
    { name: 'Servos Ativos', value: stats.servosAtivos, color: COLORS.servo },
    { name: 'Servos Inativos', value: stats.servosInativos, color: '#C4B5FD' }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Gráfico de Barras */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Distribuição por Status
          </CardTitle>
          <p className="text-sm text-slate-600">
            Comparação entre campistas e servos ativos/inativos
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="Ativos" fill={COLORS.ativo} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Inativos" fill={COLORS.inativo} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Distribuição Geral
          </CardTitle>
          <p className="text-sm text-slate-600">
            Proporção de campistas e servos ativos/inativos
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                                 label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
