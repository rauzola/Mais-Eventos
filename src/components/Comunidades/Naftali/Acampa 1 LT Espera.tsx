// /components/Comunidades/Naftali/Servos.tsx

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, RefreshCw, ToggleLeft, ToggleRight, Download } from "lucide-react";
import * as XLSX from 'xlsx';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CACHE_KEY = "comunidade-naftali-acampa1-lista-espera-cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos em milissegundos

interface Campista {
  id: string;
  ativo: boolean;
  nome: string;
  email: string;
  comprovanteUrl: string;
  cpf: string;
  nascimento: Date;
  estadoCivil: string;
  camiseta: string;
  profissao: string;
  telefone: string;
  contatoEmergencia: string;
  telefoneEmergencia: string;
  cidade: string;
  doenca: boolean;
  especificarDoenca?: string;
  aptoAtividades: boolean;
  alergia: boolean;
  especificarAlergia?: string;
  medicacaoContinua: boolean;
  quaisMedicamentos?: string;
  restricaoAlimentar: boolean;
  especificarRestricao?: string;
  planoSaude: boolean;
  operadoraPlano?: string;
  numeroPlano?: string;
  responsabilidade: boolean;
  autorizo: boolean;
  createdAt: Date;
}

export function ComunidadeNaftaliAcampa1LTespera() {
  const [campistas, setCampistas] = useState<Campista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const processarDados = (data: Campista[]) => {
    let contador = 0;
    
    // Ordenar por data de criação ascendente (mais antigo primeiro)
    const ordenados = [...data].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // Atribuir números sequenciais apenas aos ativos
    return ordenados.map(campista => ({
      ...campista,
      numeroInscricao: campista.ativo ? ++contador : undefined
    }));
  };

  const loadFromCache = () => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        return { data: processarDados(data), timestamp };
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }
    return null;
  };

  const saveToCache = (data: Campista[]) => {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    setLastFetchTime(cacheData.timestamp);
  };

  const fetchCampistas = async (force = false) => {
    const now = Date.now();
    const cache = loadFromCache();
    
    // Bloquear requisições se ainda estiver no período de cache
    if (!force && cache && now - cache.timestamp < CACHE_DURATION) {
      setCampistas(cache.data);
      setLastFetchTime(cache.timestamp);
      setIsLoading(false);
      return;
    }

    // Impedir requisições forçadas durante o período de cache
    if (force && now - lastFetchTime < CACHE_DURATION) {
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('Acampa1CampistaFichaDeEsperaCarnaval2025')
        .select('*')
        .order('createdAt', { ascending: true });

      if (error) throw error;
      
      const dadosProcessados = processarDados(data as Campista[]);
      setCampistas(dadosProcessados);
      saveToCache(data as Campista[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      if (!cache) setCampistas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (campistaId: string, currentStatus: boolean) => {
    if (updatingStatus === campistaId) return;
    
    setUpdatingStatus(campistaId);
    
    try {
      const { error } = await supabase
        .from('Acampa2CampistaCarnaval2025')
        .update({ ativo: !currentStatus })
        .eq('id', campistaId);

      if (error) throw error;

      // Atualizar o estado local
      setCampistas(prev => 
        prev.map(campista => 
          campista.id === campistaId 
            ? { ...campista, ativo: !currentStatus }
            : campista
        )
      );

      // Limpar cache para forçar nova busca na próxima atualização
      localStorage.removeItem(CACHE_KEY);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = CACHE_DURATION - (Date.now() - lastFetchTime);
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastFetchTime]);

  useEffect(() => {
    fetchCampistas();
  }, []);

  const formatBoolean = (value: boolean) => (
    <span className="font-medium">{value ? 'Sim' : 'Não'}</span>
  );

  const formatDate = (date: Date) => 
    new Date(date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  
  const formatDateTime = (date: Date) => {
    const utcDate = typeof date === 'string' ? new Date(date + 'Z') : new Date(date);
    
    return utcDate.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const activeSorted = campistas.filter(c => c.ativo);
  const numberingMap = new Map(activeSorted.map((c, i) => [c.id, i + 1]));
  const activeCount = activeSorted.length;

  const downloadExcel = () => {
    // Criar dados para o Excel
    const excelData = campistas.map((campista) => {
      const numero = campista.ativo ? numberingMap.get(campista.id) : '-';
      return {
        'Nº': numero,
        'Status': campista.ativo ? 'Ativo' : 'Inativo',
        'Nome': campista.nome,
        'Email': campista.email,
        'CPF': campista.cpf,
        'Nascimento': formatDate(campista.nascimento),
        'Estado Civil': campista.estadoCivil,
        'Camiseta': campista.camiseta,
        'Profissão': campista.profissao,
        'Telefone': campista.telefone,
        'Contato Emergência': campista.contatoEmergencia,
        'Telefone Emergência': campista.telefoneEmergencia,
        'Cidade': campista.cidade,
        'Doença': campista.doenca ? 'Sim' : 'Não',
        'Especificar Doença': campista.especificarDoenca || '-',
        'Apto Atividades': campista.aptoAtividades ? 'Sim' : 'Não',
        'Alergia': campista.alergia ? 'Sim' : 'Não',
        'Especificar Alergia': campista.especificarAlergia || '-',
        'Medicação Contínua': campista.medicacaoContinua ? 'Sim' : 'Não',
        'Medicamentos': campista.quaisMedicamentos || '-',
        'Restrição Alimentar': campista.restricaoAlimentar ? 'Sim' : 'Não',
        'Especificar Restrição': campista.especificarRestricao || '-',
        'Plano Saúde': campista.planoSaude ? 'Sim' : 'Não',
        'Operadora Plano': campista.operadoraPlano || '-',
        'Número Plano': campista.numeroPlano || '-',
        'Responsabilidade': campista.responsabilidade ? 'Sim' : 'Não',
        'Autorização': campista.autorizo ? 'Sim' : 'Não',
        'Data Inscrição': formatDateTime(campista.createdAt)
      };
    });

    // Criar workbook
    const wb = XLSX.utils.book_new();
    
    // Criar worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Definir largura das colunas
    const colWidths = [
      { wch: 8 },   // Nº
      { wch: 12 },  // Status
      { wch: 25 },  // Nome
      { wch: 30 },  // Email
      { wch: 15 },  // CPF
      { wch: 12 },  // Nascimento
      { wch: 15 },  // Estado Civil
      { wch: 10 },  // Camiseta
      { wch: 20 },  // Profissão
      { wch: 15 },  // Telefone
      { wch: 25 },  // Contato Emergência
      { wch: 15 },  // Telefone Emergência
      { wch: 20 },  // Cidade
      { wch: 8 },   // Doença
      { wch: 25 },  // Especificar Doença
      { wch: 8 },   // Apto
      { wch: 8 },   // Alergia
      { wch: 25 },  // Especificar Alergia
      { wch: 8 },   // Medicação
      { wch: 25 },  // Medicamentos
      { wch: 8 },   // Restrição
      { wch: 25 },  // Especificar Restrição
      { wch: 8 },   // Plano
      { wch: 20 },  // Operadora
      { wch: 15 },  // Número Plano
      { wch: 12 },  // Responsabilidade
      { wch: 12 },  // Autorização
      { wch: 20 },  // Data Inscrição
    ];
    ws['!cols'] = colWidths;

    // Definir altura das linhas
    ws['!rows'] = [{ hpt: 25 }]; // Altura do header

    // Aplicar estilos ao header
    const headerRange = XLSX.utils.decode_range(ws['!ref']!);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F46E5" } }, // Indigo
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "E5E7EB" } },
          bottom: { style: "thin", color: { rgb: "E5E7EB" } },
          left: { style: "thin", color: { rgb: "E5E7EB" } },
          right: { style: "thin", color: { rgb: "E5E7EB" } }
        }
      };
    }

    // Aplicar estilos aos dados
    for (let row = 1; row <= excelData.length; row++) {
      for (let col = 0; col < Object.keys(excelData[0]).length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) continue;

        const cellValue = ws[cellAddress].v;
        const header = Object.keys(excelData[0])[col];
        
        // Estilos base
        ws[cellAddress].s = {
          font: { sz: 11 },
          alignment: { vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "F1F5F9" } },
            bottom: { style: "thin", color: { rgb: "F1F5F9" } },
            left: { style: "thin", color: { rgb: "F1F5F9" } },
            right: { style: "thin", color: { rgb: "F1F5F9" } }
          }
        };

        // Estilos específicos por coluna
        if (header === 'Nº') {
          ws[cellAddress].s.fill = { fgColor: { rgb: "E0E7FF" } }; // Azul claro
          ws[cellAddress].s.font = { ...ws[cellAddress].s.font, bold: true, color: { rgb: "3730A3" } };
          ws[cellAddress].s.alignment = { ...ws[cellAddress].s.alignment, horizontal: "center" };
        } else if (header === 'Status') {
          if (cellValue === 'Ativo') {
            ws[cellAddress].s.fill = { fgColor: { rgb: "DCFCE7" } }; // Verde claro
            ws[cellAddress].s.font = { ...ws[cellAddress].s.font, color: { rgb: "166534" } };
          } else {
            ws[cellAddress].s.fill = { fgColor: { rgb: "FEF2F2" } }; // Vermelho claro
            ws[cellAddress].s.font = { ...ws[cellAddress].s.font, color: { rgb: "DC2626" } };
          }
          ws[cellAddress].s.alignment = { ...ws[cellAddress].s.alignment, horizontal: "center" };
        } else if (['CPF', 'Telefone', 'Telefone Emergência'].includes(header)) {
          ws[cellAddress].s.font = { ...ws[cellAddress].s.font, name: "Courier New" };
        } else if (['Doença', 'Apto Atividades', 'Alergia', 'Medicação Contínua', 'Restrição Alimentar', 'Plano Saúde', 'Responsabilidade', 'Autorização'].includes(header)) {
          ws[cellAddress].s.alignment = { ...ws[cellAddress].s.alignment, horizontal: "center" };
          if (cellValue === 'Sim') {
            ws[cellAddress].s.font = { ...ws[cellAddress].s.font, color: { rgb: "059669" } };
          } else {
            ws[cellAddress].s.font = { ...ws[cellAddress].s.font, color: { rgb: "DC2626" } };
          }
        }

        // Linhas alternadas
        if (row % 2 === 0) {
          ws[cellAddress].s.fill = { fgColor: { rgb: "F8FAFC" } };
        }
      }
    }

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Comunidade Naftali");

    // Gerar e baixar arquivo Excel
    const fileName = `comunidade_naftali_servos${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Criar blob e baixar o arquivo
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Criar link de download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    // Adicionar ao DOM, clicar e remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpar URL
    URL.revokeObjectURL(url);
  };


  return (
    <Card className="border shadow-xl rounded-xl overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b px-6 py-5">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Comunidade Naftali
          </CardTitle>
          <p className="text-sm text-slate-600">
            Acampa 2 - Inscrições Servos 2025
          </p>
          <div className="flex items-center gap-6 mt-3 flex-wrap">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activeCount
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {activeCount} inscrições ativas
              </span>
            </div>
            {timeLeft > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-md text-xs font-medium border border-amber-100 whitespace-nowrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Próxima atualização: {formatTime(timeLeft)}
              </div>
            )}
            <Button
              size="sm"
              onClick={() => fetchCampistas(true)}
              disabled={timeLeft > 0 || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 shadow-sm whitespace-nowrap"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Carregando..." : "Atualizar"}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={downloadExcel}
                    disabled={campistas.length === 0 || isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-sm whitespace-nowrap"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </TooltipTrigger>
                                 <TooltipContent>
                   <p>Baixar tabela em formato Excel (.xlsx)</p>
                 </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-center text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-20">
              <TableRow className="border-b border-slate-200">
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center bg-slate-100 sticky left-0 z-30">Nº</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Nome</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">CPF</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Nascimento</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Estado Civil</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Camiseta</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Profissão</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Telefone</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Contato Emergência</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Tel. Emergência</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Cidade</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center">Doença</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Especificar Doença</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center">Apto</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center">Alergia</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Especificar Alergia</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center">Medicação</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Medicamentos</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center">Restrição</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Especificar Restrição</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center">Plano</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Operadora</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Número Plano</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center">Responsabilidade</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center">Autorização</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Comprovante</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Data Inscrição</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && campistas.length === 0 ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="border-b border-slate-100 animate-pulse">
                    {Array(29).fill(0).map((_, cellIndex) => (
                      <TableCell key={`skeleton-cell-${cellIndex}`} className="py-3 px-4">
                        <div className="h-4 bg-slate-100 rounded w-16"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                campistas.map(campista => {
                  const numero = campista.ativo
                    ? numberingMap.get(campista.id)
                    : '-';
                  return (
                    <TableRow 
                      key={campista.id} 
                      className={`border-b border-slate-100 hover:bg-slate-50 even:bg-slate-50`}
                    >
                      <TableCell className="py-3 px-4 font-medium text-center sticky left-0 bg-inherit z-10">
                        <div className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                          campista.ativo 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-slate-100 text-slate-500'
                        }`}>
                          {numero}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                              campista.ativo
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            {campista.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleStatus(campista.id, campista.ativo)}
                                  disabled={updatingStatus === campista.id}
                                  className={`h-7 px-2 text-xs transition-all duration-200 ${
                                    campista.ativo
                                      ? 'border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300'
                                      : 'border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300'
                                  }`}
                                >
                                  {updatingStatus === campista.id ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : campista.ativo ? (
                                    <ToggleLeft className="h-3 w-3" />
                                  ) : (
                                    <ToggleRight className="h-3 w-3" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {updatingStatus === campista.id 
                                    ? 'Atualizando...' 
                                    : campista.ativo 
                                      ? 'Clique para deixa Inativo' 
                                      : 'Clique para Ativo'
                                  }
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 font-medium">{campista.nome}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700">{campista.email}</TableCell>
                      <TableCell className="py-3 px-4 font-mono text-xs">{campista.cpf}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700">{formatDate(campista.nascimento)}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700">{campista.estadoCivil}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700">{campista.camiseta}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700">{campista.profissao}</TableCell>
                      <TableCell className="py-3 px-4 font-mono text-xs">{campista.telefone}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700">{campista.contatoEmergencia}</TableCell>
                      <TableCell className="py-3 px-4 font-mono text-xs">{campista.telefoneEmergencia}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700">{campista.cidade}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{formatBoolean(campista.doenca)}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700 max-w-[200px] truncate">{campista.especificarDoenca || '-'}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{formatBoolean(campista.aptoAtividades)}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{formatBoolean(campista.alergia)}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700 max-w-[200px] truncate">{campista.especificarAlergia || '-'}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{formatBoolean(campista.medicacaoContinua)}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700 max-w-[200px] truncate">{campista.quaisMedicamentos || '-'}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{formatBoolean(campista.restricaoAlimentar)}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700 max-w-[200px] truncate">{campista.especificarRestricao || '-'}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{formatBoolean(campista.planoSaude)}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700">{campista.operadoraPlano || '-'}</TableCell>
                      <TableCell className="py-3 px-4 text-slate-700 font-mono text-xs">{campista.numeroPlano || '-'}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{formatBoolean(campista.responsabilidade)}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{formatBoolean(campista.autorizo)}</TableCell>
                      <TableCell className="py-3 px-4">
                        {campista.comprovanteUrl ? (
                          <a href={campista.comprovanteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 py-1 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-colors duration-200 text-xs font-medium">
                            <Eye size={14} />
                            <span>Visualizar</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-slate-700">{formatDateTime(campista.createdAt)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          
          {!isLoading && campistas.length === 0 && (
            <div className="p-16 flex flex-col items-center justify-center text-slate-500 border-t">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-slate-300"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <p className="text-lg font-medium">Nenhum inscrito encontrado</p>
              <p className="text-sm text-slate-400 mt-1">Os registros de inscrições aparecerão aqui</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}