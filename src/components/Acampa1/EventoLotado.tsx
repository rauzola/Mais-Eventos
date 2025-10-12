"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  Heart, 
  Calendar,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

interface EventoLotadoProps {
  event?: {
    id: string;
    title: string;
    short_description?: string | null;
    description?: string | null;
    category?: string | null;
    location?: string | null;
    organizer_name?: string | null;
    organizer_contact?: string | null;
    image_url?: string | null;
    price: number;
    status: "ativo" | "inativo";
    event_date_start?: string | null;
    event_time_start?: string | null;
    target_audience?: string | null;
    event_date_end?: string | null;
    event_time_end?: string | null;
    instructions?: string | null;
    required_items?: string[] | null;
    payment_info?: string | null;
    cancellation_policy?: string | null;
    max_participants?: number | null;
    transportation?: string | null;
    meals_included?: boolean | null;
    accommodation_included?: boolean | null;
    confirmation_text?: string | null;
    participant_type?: string | null;
  };
  totalInscricoes: number;
}

export function EventoLotado({ event, totalInscricoes }: EventoLotadoProps) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Data não definida";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-600 mr-2" />
            <h1 className="text-2xl font-bold text-red-600">Projeto Mais Vida</h1>
          </div>
        </div>

        {/* Card Principal */}
        <Card className="border-2 border-red-200 shadow-xl bg-white">
          <CardHeader className="text-center bg-gradient-to-r from-red-600 to-orange-700 text-white rounded-t-lg py-8">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-white mr-3" />
              <CardTitle className="text-3xl font-bold">
                Evento Lotado!
              </CardTitle>
            </div>
            <CardDescription className="text-red-100 text-lg">
              {event?.title || "Acampamento de Novembro 2025"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {/* Status do Evento */}
            {/* <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-red-600 mr-2" />
                <span className="text-2xl font-bold text-red-800">
                  {totalInscricoes} / 50 Inscrições
                </span>
              </div>
              <p className="text-red-700 text-lg font-semibold">
                🚫 Infelizmente, as vagas para este evento estão esgotadas!
              </p>
            </div> */}

            {/* Informações do Evento */}
            {/* <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Informações do Evento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span><strong>Data de início:</strong> {formatDate(event?.event_date_start)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span><strong>Data de retorno:</strong> {formatDate(event?.event_date_end)}</span>
                </div>
                {event?.location && (
                  <div className="flex items-center md:col-span-2">
                    <span><strong>Local:</strong> {event.location}</span>
                  </div>
                )}
              </div>

              {event?.short_description && (
                <div className="mt-4">
                  <p className="text-gray-700">{event.short_description}</p>
                </div>
              )}
            </div> */}

            {/* Opção de Lista de Espera */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-600 mr-2" />
                  <h3 className="text-xl font-bold text-blue-800">
                    Lista de Espera Disponível!
                  </h3>
                </div>
                
                <p className="text-blue-700 mb-6">
                  Não desista! Você pode se inscrever na nossa lista de espera. 
                  Caso haja desistências, entraremos em contato na ordem de inscrição.
                </p>

                <div className="bg-white rounded-lg p-4 mb-6 border border-blue-300">
                  <h4 className="font-semibold text-gray-900 mb-2">Como funciona a Lista de Espera:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Sua inscrição fica em ordem de chegada
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Em caso de desistência, você é automaticamente promovido
                    </li>
                   
                   
                  </ul>
                </div>

                <Link href="/acampa/acampa-novembro-2025-campista-espera">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Inscrever-se na Lista de Espera
                  </Button>
                </Link>
              </div>
            </div>

            {/* Informações de Contato */}
            {/* <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Dúvidas ou Precisa de Ajuda?</h4>
              <p className="text-gray-700 mb-4">
                Entre em contato conosco através do WhatsApp:
              </p>
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 inline-block">
                <span className="text-green-800 font-semibold">
                  📱 {event?.organizer_contact || "44 99137-2331"}
                </span>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Projeto Mais Vida - Igreja Católica de Maringá
          </p>
          <p className="text-gray-500 text-xs mt-1">
            CNPJ: 04.585.680/0001-03
          </p>
        </div>
      </div>
    </div>
  );
}
