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
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Eye,
  Plus,
  TrendingUp,
  Clock,
  MapPin
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  short_description?: string;
  event_date_start?: string;
  event_time_start?: string;
  location?: string;
  status: "ativo" | "inativo";
  max_participants?: number;
  _count?: {
    inscricoes: number;
  };
  category?: string;
}

export default function CoordPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchEvents();
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
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não definida";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    return timeString;
  };

  const getStatusColor = (status: string) => {
    return status === "ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getCategoryColor = (category?: string) => {
    const colors: { [key: string]: string } = {
      "acampamento": "bg-blue-100 text-blue-800",
      "retiro": "bg-purple-100 text-purple-800",
      "encontro": "bg-orange-100 text-orange-800",
      "formacao": "bg-green-100 text-green-800",
      "default": "bg-gray-100 text-gray-800"
    };
    return colors[category || "default"];
  };

  // Estatísticas para os gráficos
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === "ativo").length;
  const totalInscricoes = events.reduce((sum, e) => sum + (e._count?.inscricoes || 0), 0);
  const avgInscricoes = totalEvents > 0 ? Math.round(totalInscricoes / totalEvents) : 0;

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["COORD", "CONCELHO", "ADMIN"]}>
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
    <ProtectedRoute allowedRoles={["COORD", "CONCELHO", "ADMIN"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  🎯 Área de Coordenação
                </h1>
                <p className="text-gray-600">
                  Bem-vindo, <strong>{user.email}</strong> - {user.role}
                </p>
              </div>
              <Button onClick={() => router.push("/admin/eventos/novo")}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{totalEvents}</p>
                    <p className="text-sm text-blue-700">Total de Eventos</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{activeEvents}</p>
                    <p className="text-sm text-green-700">Eventos Ativos</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{totalInscricoes}</p>
                    <p className="text-sm text-purple-700">Total Inscrições</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-orange-900">{avgInscricoes}</p>
                    <p className="text-sm text-orange-700">Média por Evento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Eventos */}
          <div className="bg-white rounded-lg shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Eventos Cadastrados
              </CardTitle>
              <CardDescription>
                Gerencie todos os eventos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
                  <p className="text-gray-500 mb-4">Comece criando seu primeiro evento</p>
                  <Button onClick={() => router.push("/admin/eventos/novo")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Evento
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {events.map((event) => (
                    <div 
                      key={event.id} 
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/coord/${event.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {event.title}
                            </h3>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status === "ativo" ? "Ativo" : "Inativo"}
                            </Badge>
                            {event.category && (
                              <Badge className={getCategoryColor(event.category)}>
                                {event.category}
                              </Badge>
                            )}
                          </div>
                          
                          {event.short_description && (
                            <p className="text-gray-600 mb-3">{event.short_description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {event.event_date_start && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(event.event_date_start)}
                              </div>
                            )}
                            {event.event_time_start && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(event.event_time_start)}
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 ml-6">
                          {/* Estatísticas de Inscrições */}
                          <div className="text-center">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-2xl font-bold text-gray-900">
                                {event._count?.inscricoes || 0}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Inscritos</p>
                            {event.max_participants && (
                              <p className="text-xs text-gray-400">
                                / {event.max_participants} max
                              </p>
                            )}
                          </div>
                          
                          {/* Barra de Progresso */}
                          {event.max_participants && (
                            <div className="w-20">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${Math.min(((event._count?.inscricoes || 0) / event.max_participants) * 100, 100)}%` 
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 text-center">
                                {Math.round(((event._count?.inscricoes || 0) / event.max_participants) * 100)}%
                              </p>
                            </div>
                          )}
                          
                          {/* Ações */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/coord/${event.id}`);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/eventos/${event.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>

          {/* Gráficos Simples */}
          {events.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Gráfico de Eventos por Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Eventos por Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ativos</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${totalEvents > 0 ? (activeEvents / totalEvents) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{activeEvents}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Inativos</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${totalEvents > 0 ? ((totalEvents - activeEvents) / totalEvents) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{totalEvents - activeEvents}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Inscrições */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Top 5 Eventos por Inscrições
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events
                      .sort((a, b) => (b._count?.inscricoes || 0) - (a._count?.inscricoes || 0))
                      .slice(0, 5)
                      .map((event, index) => (
                        <div key={event.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium truncate max-w-32">
                              {event.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ 
                                  width: `${totalInscricoes > 0 ? ((event._count?.inscricoes || 0) / Math.max(...events.map(e => e._count?.inscricoes || 0))) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8 text-right">
                              {event._count?.inscricoes || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
