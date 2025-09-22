"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProtectedRoute from "@/components/ProtectedRoute";
import { 
  Users, 
  Calendar, 
  ArrowLeft,
  Search,
  Download,
  Check,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Shirt,
  Briefcase,
  AlertTriangle,
  FileText,
  Filter,
  EyeOff,
  Grid3X3,
  Table,
  MoreVertical
} from "lucide-react";

interface User {
  id: string;
  email: string;
  nomeCompleto: string | null;
  cpf: string | null;
  telefone: string | null;
  cidade: string | null;
  dataNascimento: Date | null;
  estadoCivil: string | null;
  tamanhoCamiseta: string | null;
  profissao: string | null;
  contatoEmergencia: string | null;
  telefoneEmergencia: string | null;
  portadorDoenca: string | null;
  alergiaIntolerancia: string | null;
  medicacaoUso: string | null;
  restricaoAlimentar: string | null;
  operadora: string | null;
  numeroPlano: string | null;
  termo1: boolean;
  termo2: boolean;
  termo3: boolean;
  role: string;
}

interface Inscricao {
  id: string;
  status: "pendente" | "confirmada" | "cancelada" | "inativo";
  dataInscricao: string;
  dataConfirmacao: string | null;
  observacoes: string | null;
  comprovantePagamento: string | null;
  valorPago: number | null;
  formaPagamento: string | null;
  ativo: boolean;
  frente: string;
  arquivoUrl: string | null;
  nomeArquivo: string | null;
  tipoArquivo: string | null;
  tamanhoArquivo: number | null;
  dadosAdicionais: Record<string, unknown> | null;
  user: User;
}

interface Event {
  id: string;
  title: string;
  event_date_start: string | null;
  location: string | null;
  max_participants: number | null;
}

interface Stats {
  total: number;
  confirmadas: number;
  pendentes: number;
  canceladas: number;
  inativo: number;
  porFrente: Record<string, number>;
}

export default function CoordEventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [inscricoesFiltradas, setInscricoesFiltradas] = useState<Inscricao[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [frenteFilter, setFrenteFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const fetchEventDetails = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/inscricoes/evento/${eventId}`);
      
      if (response.ok) {
        const data = await response.json();
        setEvent(data.event);
        setInscricoes(data.inscricoes);
        setStats(data.stats);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao carregar dados do evento");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do evento:", error);
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const applyFilters = useCallback(() => {
    let filtered = inscricoes;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(inscricao => 
        inscricao.user.nomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inscricao.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inscricao.user.cpf?.includes(searchTerm) ||
        inscricao.user.telefone?.includes(searchTerm)
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(inscricao => inscricao.status === statusFilter);
    }

    // Filtro por frente
    if (frenteFilter !== "all") {
      filtered = filtered.filter(inscricao => inscricao.frente === frenteFilter);
    }

    setInscricoesFiltradas(filtered);
  }, [inscricoes, searchTerm, statusFilter, frenteFilter]);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [fetchEventDetails, eventId]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const updateInscricaoStatus = async (inscricaoId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inscricoes/evento/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inscricaoId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        // Recarregar os dados
        fetchEventDetails();
      } else {
        console.error("Erro ao atualizar status da inscrição");
      }
    } catch (error) {
      console.error("Erro ao atualizar status da inscrição:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data não definida";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    const colors = {
      confirmada: "bg-green-100 text-green-800",
      pendente: "bg-yellow-100 text-yellow-800",
      cancelada: "bg-red-100 text-red-800",
      inativo: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      confirmada: "Confirmada",
      pendente: "Pendente",
      cancelada: "Cancelada",
      inativo: "Inativo",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getFrenteLabel = (frente: string) => {
    const labels = {
      campista: "Campista",
      anjonoturno: "Anjo Noturno",
      animacao: "Animação",
      assessores: "Assessores",
      coordenacao: "Coordenação",
      cozinha: "Cozinha",
      estrutura: "Estrutura",
      externa: "Externa",
      intercessao: "Intercessão",
      musicaEanimacao: "Música e Animação",
      primeiros_socorros: "Primeiros Socorros",
    };
    return labels[frente as keyof typeof labels] || frente;
  };

  const getEstadoCivilLabel = (estadoCivil: string | null) => {
    if (!estadoCivil) return "Não informado";
    const labels = {
      SOLTEIRO: "Solteiro",
      CASADO: "Casado",
      DIVORCIADO: "Divorciado",
      VIUVO: "Viúvo",
      UNIAO_ESTAVEL: "União Estável",
    };
    return labels[estadoCivil as keyof typeof labels] || estadoCivil;
  };

  const getTamanhoCamisetaLabel = (tamanho: string | null) => {
    if (!tamanho) return "Não informado";
    return tamanho;
  };

  const isInactiveOrCancelled = (status: string) => {
    return status === "inativo" || status === "cancelada";
  };


  const exportToCSV = () => {
    const headers = [
      "Nome",
      "Email",
      "CPF",
      "Data Nascimento",
      "Estado Civil",
      "Tamanho Camiseta",
      "Profissão",
      "Telefone",
      "Contato Emergência",
      "Telefone Emergência",
      "Cidade",
      "Portador Doença",
      "Alergia/Intolerância",
      "Medicação",
      "Restrição Alimentar",
      "Operadora",
      "Número Plano",
      "Arquivo URL",
      "Nome Arquivo",
      "Status",
      "Frente",
      "Data Inscrição",
      "Data Confirmação",
    ];

    const csvContent = [
      headers.join(","),
      ...inscricoesFiltradas.map(inscricao => [
        inscricao.user.nomeCompleto || "",
        inscricao.user.email,
        inscricao.user.cpf || "",
        inscricao.user.dataNascimento ? formatDate(inscricao.user.dataNascimento.toString()) : "",
        getEstadoCivilLabel(inscricao.user.estadoCivil),
        inscricao.user.tamanhoCamiseta || "",
        inscricao.user.profissao || "",
        inscricao.user.telefone || "",
        inscricao.user.contatoEmergencia || "",
        inscricao.user.telefoneEmergencia || "",
        inscricao.user.cidade || "",
        inscricao.user.portadorDoenca || "",
        inscricao.user.alergiaIntolerancia || "",
        inscricao.user.medicacaoUso || "",
        inscricao.user.restricaoAlimentar || "",
        inscricao.user.operadora || "",
        inscricao.user.numeroPlano || "",
        inscricao.arquivoUrl || "",
        inscricao.nomeArquivo || "",
        getStatusLabel(inscricao.status),
        getFrenteLabel(inscricao.frente),
        formatDateTime(inscricao.dataInscricao),
        inscricao.dataConfirmacao ? formatDateTime(inscricao.dataConfirmacao) : "",
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inscricoes_${event?.title || eventId}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["COORD", "CONCELHO", "ADMIN"]}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando inscrições...</p>
            <p className="text-sm text-gray-500 mt-2">Evento ID: {eventId}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={["COORD", "CONCELHO", "ADMIN"]}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar evento</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-4">
              <Button onClick={() => fetchEventDetails()}>
                Tentar Novamente
              </Button>
              <Button onClick={() => router.push("/coord")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Coordenação
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute allowedRoles={["COORD", "CONCELHO", "ADMIN"]}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Evento não encontrado</h2>
            <Button onClick={() => router.push("/coord")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Coordenação
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["COORD", "CONCELHO", "ADMIN"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => router.push("/coord")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Coordenação
              </Button>
              <div className="flex gap-2">
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Cards
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-l-none"
                  >
                    <Table className="w-4 h-4 mr-2" />
                    Tabela
                  </Button>
                </div>
                <Button onClick={exportToCSV} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </div>

            <div className="border-b pb-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {event.event_date_start && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(event.event_date_start)}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </div>
                )}
                {event.max_participants && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Máximo: {event.max_participants} participantes
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  <p className="text-sm text-blue-700">Total</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-900">{stats.confirmadas}</p>
                  <p className="text-sm text-green-700">Confirmadas</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-900">{stats.pendentes}</p>
                  <p className="text-sm text-yellow-700">Pendentes</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-900">{stats.canceladas}</p>
                  <p className="text-sm text-red-700">Canceladas</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.inativo}</p>
                  <p className="text-sm text-gray-700">Inativo</p>
                </div>
              </div>
            )}
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Filtros</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email, CPF ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={frenteFilter} onValueChange={setFrenteFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por frente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as frentes</SelectItem>
                  <SelectItem value="campista">Campista</SelectItem>
                  <SelectItem value="anjonoturno">Anjo Noturno</SelectItem>
                  <SelectItem value="animacao">Animação</SelectItem>
                  <SelectItem value="assessores">Assessores</SelectItem>
                  <SelectItem value="coordenacao">Coordenação</SelectItem>
                  <SelectItem value="cozinha">Cozinha</SelectItem>
                  <SelectItem value="estrutura">Estrutura</SelectItem>
                  <SelectItem value="externa">Externa</SelectItem>
                  <SelectItem value="intercessao">Intercessão</SelectItem>
                  <SelectItem value="musicaEanimacao">Música e Animação</SelectItem>
                  <SelectItem value="primeiros_socorros">Primeiros Socorros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de Inscrições */}
          <div className="bg-white rounded-lg shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Inscrições ({inscricoesFiltradas.length})
              </CardTitle>
              <CardDescription>
                Lista de todos os participantes inscritos no evento
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {inscricoesFiltradas.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {inscricoes.length === 0 ? "Nenhuma inscrição encontrada" : "Nenhuma inscrição corresponde aos filtros"}
                  </h3>
                  <p className="text-gray-500">
                    {inscricoes.length === 0 
                      ? "Aguarde as primeiras inscrições para este evento"
                      : "Tente ajustar os filtros para ver mais resultados"
                    }
                  </p>
                </div>
              ) : viewMode === "table" ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nascimento</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Civil</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camiseta</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profissão</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato Emergência</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tel. Emergência</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portador Doença</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alergia/Intolerância</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicação</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restrição Alimentar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operadora</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número Plano</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprovante</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Inscrição</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inscricoesFiltradas.map((inscricao, index) => (
                        <tr key={inscricao.id} className={`hover:bg-gray-50 ${isInactiveOrCancelled(inscricao.status) ? 'bg-red-50' : ''}`}>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>{index + 1}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(inscricao.status)}>
                              {getStatusLabel(inscricao.status)}
                            </Badge>
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.nomeCompleto || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.email}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.cpf || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.dataNascimento ? formatDate(inscricao.user.dataNascimento.toString()) : "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {getEstadoCivilLabel(inscricao.user.estadoCivil)}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {getTamanhoCamisetaLabel(inscricao.user.tamanhoCamiseta)}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.profissao || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.telefone || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.contatoEmergencia || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.telefoneEmergencia || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.cidade || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.portadorDoenca || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.alergiaIntolerancia || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.medicacaoUso || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.restricaoAlimentar || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.operadora || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.user.numeroPlano || "Não informado"}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {inscricao.arquivoUrl ? (
                              <a 
                                href={inscricao.arquivoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                Visualizar Comprovante
                              </a>
                            ) : (
                              "Não enviado"
                            )}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {getFrenteLabel(inscricao.frente)}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatDateTime(inscricao.dataInscricao)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => updateInscricaoStatus(inscricao.id, "pendente")}
                                  className="text-blue-600"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  Pendente
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateInscricaoStatus(inscricao.id, "confirmada")}
                                  className="text-green-600"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Confirmada
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateInscricaoStatus(inscricao.id, "cancelada")}
                                  className="text-red-600"
                                >
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Cancelada
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateInscricaoStatus(inscricao.id, "inativo")}
                                  className="text-gray-600"
                                >
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Inativo
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                ) : (
                  <div className="space-y-6 p-6">
                    {inscricoesFiltradas.map((inscricao) => (
                      <div key={inscricao.id} className={`bg-white rounded-xl shadow-lg border transition-all duration-200 hover:shadow-xl ${isInactiveOrCancelled(inscricao.status) ? 'border-red-200 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                        {/* Header do Card */}
                        <div className={`p-6 border-b ${isInactiveOrCancelled(inscricao.status) ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`p-2 rounded-full ${isInactiveOrCancelled(inscricao.status) ? 'bg-red-100' : 'bg-blue-100'}`}>
                                    <User className={`w-5 h-5 ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-blue-600'}`} />
                                  </div>
                                  <h3 className={`text-xl font-bold ${isInactiveOrCancelled(inscricao.status) ? 'text-red-700' : 'text-gray-900'}`}>
                                    {inscricao.user.nomeCompleto || "Nome não informado"}
                                  </h3>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge className={`${getStatusColor(inscricao.status)} font-medium`}>
                                  {getStatusLabel(inscricao.status)}
                                </Badge>
                                <Badge variant="outline" className="font-medium">
                                  {getFrenteLabel(inscricao.frente)}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Botão de Ações */}
                            <div className="ml-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => updateInscricaoStatus(inscricao.id, "pendente")}
                                    className="text-blue-600"
                                  >
                                    <Clock className="w-4 h-4 mr-2" />
                                    Pendente
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => updateInscricaoStatus(inscricao.id, "confirmada")}
                                    className="text-green-600"
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Confirmada
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => updateInscricaoStatus(inscricao.id, "cancelada")}
                                    className="text-red-600"
                                  >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Cancelada
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => updateInscricaoStatus(inscricao.id, "inativo")}
                                    className="text-gray-600"
                                  >
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Inativo
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>

                        {/* Conteúdo do Card */}
                        <div className="p-6 space-y-8">
                          {/* Dados Pessoais */}
                          <div>
                            <h4 className={`text-sm font-semibold mb-4 flex items-center ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                              <User className="w-4 h-4 mr-2" />
                              Dados Pessoais
                            </h4>
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-600'}`}>
                              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                <span className="font-medium w-20">Email:</span>
                                <span className="ml-2">{inscricao.user.email}</span>
                              </div>
                              {inscricao.user.cpf && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <FileText className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">CPF:</span>
                                  <span className="ml-2">{inscricao.user.cpf}</span>
                                </div>
                              )}
                              {inscricao.user.dataNascimento && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Nascimento:</span>
                                  <span className="ml-2">{formatDate(inscricao.user.dataNascimento.toString())}</span>
                                </div>
                              )}
                              {inscricao.user.estadoCivil && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <User className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Estado Civil:</span>
                                  <span className="ml-2">{getEstadoCivilLabel(inscricao.user.estadoCivil)}</span>
                                </div>
                              )}
                              {inscricao.user.tamanhoCamiseta && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <Shirt className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Camiseta:</span>
                                  <span className="ml-2">{getTamanhoCamisetaLabel(inscricao.user.tamanhoCamiseta)}</span>
                                </div>
                              )}
                              {inscricao.user.profissao && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Profissão:</span>
                                  <span className="ml-2">{inscricao.user.profissao}</span>
                                </div>
                              )}
                              {inscricao.user.telefone && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Telefone:</span>
                                  <span className="ml-2">{inscricao.user.telefone}</span>
                                </div>
                              )}
                              {inscricao.user.contatoEmergencia && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <AlertTriangle className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Contato Emergência:</span>
                                  <span className="ml-2">{inscricao.user.contatoEmergencia}</span>
                                </div>
                              )}
                              {inscricao.user.telefoneEmergencia && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Tel. Emergência:</span>
                                  <span className="ml-2">{inscricao.user.telefoneEmergencia}</span>
                                </div>
                              )}
                              {inscricao.user.cidade && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Cidade:</span>
                                  <span className="ml-2">{inscricao.user.cidade}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Ficha de Saúde */}
                          <div>
                            <h4 className={`text-sm font-semibold mb-4 flex items-center ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Ficha de Saúde
                            </h4>
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-600'}`}>
                              {inscricao.user.portadorDoenca && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <AlertTriangle className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Portador Doença:</span>
                                  <span className="ml-2">{inscricao.user.portadorDoenca}</span>
                                </div>
                              )}
                              {inscricao.user.alergiaIntolerancia && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <AlertTriangle className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-24">Alergia/Intolerância:</span>
                                  <span className="ml-2">{inscricao.user.alergiaIntolerancia}</span>
                                </div>
                              )}
                              {inscricao.user.medicacaoUso && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <FileText className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Medicação:</span>
                                  <span className="ml-2">{inscricao.user.medicacaoUso}</span>
                                </div>
                              )}
                              {inscricao.user.restricaoAlimentar && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <AlertTriangle className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Restrição Alimentar:</span>
                                  <span className="ml-2">{inscricao.user.restricaoAlimentar}</span>
                                </div>
                              )}
                              {inscricao.user.operadora && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <FileText className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Operadora:</span>
                                  <span className="ml-2">{inscricao.user.operadora}</span>
                                </div>
                              )}
                              {inscricao.user.numeroPlano && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <FileText className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Número Plano:</span>
                                  <span className="ml-2">{inscricao.user.numeroPlano}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Informações da Inscrição */}
                          <div>
                            <h4 className={`text-sm font-semibold mb-4 flex items-center ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                              <Clock className="w-4 h-4 mr-2" />
                              Informações da Inscrição
                            </h4>
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-600'}`}>
                              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                <Clock className="w-4 h-4 mr-3 text-gray-400" />
                                <span className="font-medium w-20">Data Inscrição:</span>
                                <span className="ml-2">{formatDateTime(inscricao.dataInscricao)}</span>
                              </div>
                              {inscricao.dataConfirmacao && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <Check className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-20">Data Confirmação:</span>
                                  <span className="ml-2">{formatDateTime(inscricao.dataConfirmacao)}</span>
                                </div>
                              )}
                              {inscricao.arquivoUrl && (
                                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                                  <FileText className="w-4 h-4 mr-3 text-gray-400" />
                                  <span className="font-medium w-24">Comprovante:</span>
                                  <a 
                                    href={inscricao.arquivoUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 hover:text-blue-800 underline font-medium"
                                  >
                                    Visualizar Comprovante
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {inscricao.observacoes && (
                            <div className={`p-4 rounded-lg border ${isInactiveOrCancelled(inscricao.status) ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                              <h4 className={`text-sm font-semibold mb-2 flex items-center ${isInactiveOrCancelled(inscricao.status) ? 'text-red-600' : 'text-gray-900'}`}>
                                <FileText className="w-4 h-4 mr-2" />
                                Observações
                              </h4>
                              <p className={`text-sm ${isInactiveOrCancelled(inscricao.status) ? 'text-red-700' : 'text-gray-700'}`}>
                                {inscricao.observacoes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </CardContent>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
