"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Search, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type EventItem = {
  id: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  organizer_name?: string | null;
  image_url?: string | null;
  price?: number | null;
  status?: "ativo" | "inativo";
  event_date_start?: string | null;
  event_time_start?: string | null;
};

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const loadData = async () => {
    try {
      const res = await fetch("/api/events?status=ativo", { cache: "no-store" });
      const data = await res.json();
      const list = (data?.events || []) as EventItem[];
      setEvents(list);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
    setLoading(false);
  };

  const filterEvents = useCallback(() => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter((event) =>
        (event.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => (event.category || "").toLowerCase() === categoryFilter);
    }

    if (priceFilter === "free") {
      filtered = filtered.filter((event) => (event.price || 0) === 0);
    } else if (priceFilter === "paid") {
      filtered = filtered.filter((event) => (event.price || 0) > 0);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, categoryFilter, priceFilter]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const formatSafeDate = (dateString?: string | null) => {
    if (!dateString) return "Data não definida";
    try {
      const dateOnly = dateString.split("T")[0];
      const date = parseISO(dateOnly);
      return isValid(date) ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Data inválida";
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const categoryColors: Record<string, string> = {
    acampamento: "bg-green-500",
    retiro: "bg-blue-500",
    encontro: "bg-purple-500",
    formacao: "bg-indigo-500",
    oracao: "bg-yellow-500",
    celebracao: "bg-pink-500",
    servico: "bg-orange-500",
    jovens: "bg-cyan-500",
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">Carregando...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Eventos</h1>
            <p className="text-xl text-white/90 mb-8">Encontre experiências espirituais transformadoras</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filtros */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Pesquisar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="acampamento">Acampamento</SelectItem>
                  <SelectItem value="retiro">Retiro</SelectItem>
                  <SelectItem value="encontro">Encontro</SelectItem>
                  <SelectItem value="formacao">Formação</SelectItem>
                  <SelectItem value="oracao">Oração</SelectItem>
                  <SelectItem value="celebracao">Celebração</SelectItem>
                  <SelectItem value="servico">Serviço</SelectItem>
                  <SelectItem value="jovens">Jovens</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-32 h-12">
                  <SelectValue placeholder="Preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grid de Eventos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
              <div className="relative">
                {event.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.image_url}
                    alt={event.title || "Evento"}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`${categoryColors[event.category || ""] || "bg-gray-500"} w-full h-48 flex items-center justify-center`}>
                    <Calendar className="w-16 h-16 text-white/50" />
                  </div>
                )}
                <div className={`${categoryColors[event.category || ""] || "bg-gray-500"} absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium`}>
                  {event.category || "evento"}
                </div>
                {(event.price || 0) === 0 ? (
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white">Gratuito</Badge>
                ) : (
                  <Badge className="absolute top-4 right-4 bg-blue-500 text-white">R$ {(event.price || 0).toFixed(2)}</Badge>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </CardTitle>
                {event.organizer_name && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Por: {event.organizer_name}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">{event.short_description}</p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatSafeDate(event.event_date_start || null)}
                  </div>
                  {event.event_time_start && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.event_time_start}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <Link href={`/eventos/${event.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mt-4">
                    Ver Detalhes e Inscrever-se
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-500">Tente ajustar seus filtros de pesquisa</p>
          </div>
        )}
      </div>
    </div>
  );
}
