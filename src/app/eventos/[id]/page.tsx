import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Heart, FileText, CreditCard, AlertCircle, Users, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma-vercel";

type DbEvent = {
  id: string;
  title: string;
  short_description: string | null;
  description: string | null;
  category: string | null;
  location: string | null;
  organizer_name: string | null;
  organizer_contact?: string | null;
  image_url: string | null;
  price: number;
  status: "ativo" | "inativo";
  event_date_start: Date | null;
  event_time_start: string | null;
  // Campos opcionais (se não existirem no schema atual virão como undefined)
  target_audience?: string | null;
  event_date_end?: Date | null;
  event_time_end?: string | null;
  instructions?: string | null;
  required_items?: string[] | null;
  payment_info?: string | null;
  cancellation_policy?: string | null;
  max_participants?: number | null;
  transportation?: string | null;
  meals_included?: boolean | null;
  accommodation_included?: boolean | null;
};

type ApiEvent = {
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
};

async function getEvent(id: string): Promise<ApiEvent | null> {
  const ev = (await (prisma as unknown as { event: { findUnique(args: { where: { id: string } }): Promise<DbEvent | null> } }).event.findUnique({ where: { id } })) as DbEvent | null;
  if (!ev) return null;
  return {
    id: ev.id,
    title: ev.title,
    short_description: ev.short_description ?? null,
    description: ev.description ?? null,
    category: ev.category ?? null,
    location: ev.location ?? null,
    organizer_name: ev.organizer_name ?? null,
    organizer_contact: ev.organizer_contact ?? null,
    image_url: ev.image_url ?? null,
    price: Number(ev.price ?? 0),
    status: ev.status ?? "ativo",
    event_date_start: ev.event_date_start ? new Date(ev.event_date_start).toISOString() : null,
    event_time_start: ev.event_time_start ?? null,
    target_audience: ev.target_audience ?? null,
    event_date_end: ev.event_date_end ? new Date(ev.event_date_end).toISOString() : null,
    event_time_end: ev.event_time_end ?? null,
    instructions: ev.instructions ?? null,
    required_items: ev.required_items ?? null,
    payment_info: ev.payment_info ?? null,
    cancellation_policy: ev.cancellation_policy ?? null,
    max_participants: ev.max_participants ?? null,
    transportation: ev.transportation ?? null,
    meals_included: ev.meals_included ?? null,
    accommodation_included: ev.accommodation_included ?? null,
  };
}

function formatDate(date?: string | null) {
  if (!date) return "Data não definida";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Data inválida";
  return d.toLocaleDateString();
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-700">Evento não encontrado.</div>
    );
  }

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

  const audienceLabels: Record<string, string> = {
    todos: "Todos",
    jovens: "Jovens",
    adultos: "Adultos",
    familias: "Famílias",
    casais: "Casais",
    servos: "Servos",
    lideranca: "Liderança",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero do Evento */}
      <div className="relative">
        {event.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.image_url} alt={event.title} className="h-96 w-full object-cover" />
        ) : (
          <div className={`h-96 w-full ${categoryColors[event.category || ""] || "bg-blue-200"}`} />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-6 left-6">
          <Link href="/eventos">
            <Button variant="outline" size="icon" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              {event.category && (
                <Badge className={`${categoryColors[event.category] || "bg-gray-500"} text-white border-0`}>
                  {event.category}
                </Badge>
              )}
              {event.target_audience && (
                <Badge className="bg-indigo-500 text-white border-0">
                  {audienceLabels[event.target_audience] || event.target_audience}
                </Badge>
              )}
              <Badge className={event.price === 0 ? "bg-green-500 text-white border-0" : "bg-blue-500 text-white border-0"}>
                {event.price === 0 ? "Gratuito" : `R$ ${event.price.toFixed(2)}`}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(event.event_date_start)}</span>
              </div>
              {event.event_time_start && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>
                    {event.event_time_start}
                    {event.event_time_end ? ` - ${event.event_time_end}` : ""}
                  </span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Sobre o Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.description && (
                <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
              )}
              {event.instructions && (
                <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Instruções Gerais:</h4>
                  <p className="text-blue-700 whitespace-pre-line">{event.instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {event.required_items && event.required_items.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Itens Obrigatórios para Levar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-2">
                  {event.required_items.map((item, i) => (
                    <div key={`${item}-${i}`} className="flex items-center gap-2 p-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {event.price > 0 && event.payment_info && (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  Informações de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800 whitespace-pre-line">{event.payment_info}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {event.cancellation_policy && (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Política de Cancelamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{event.cancellation_policy}</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Organização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{event.organizer_name || "Projeto Mais Vida"}</p>
                    <p className="text-gray-600">Igreja Católica de Maringá</p>
                  </div>
                </div>
                {event.organizer_contact && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <span>{event.organizer_contact}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inscrições</span>
                <Heart className="w-5 h-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-gray-600">
                  {event.max_participants ? `de ${event.max_participants} vagas` : "pessoas inscritas"}
                </p>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Inscrever-se Agora
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Início</span>
                <span className="font-semibold">{formatDate(event.event_date_start)}</span>
              </div>
              {event.event_time_start && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Horário</span>
                  <span className="font-semibold">
                    {event.event_time_start}
                    {event.event_time_end ? ` - ${event.event_time_end}` : ""}
                  </span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Local</span>
                  <span className="font-semibold text-right text-sm">{event.location}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Valor</span>
                <span className="font-semibold">{event.price === 0 ? "Gratuito" : `R$ ${event.price.toFixed(2)}`}</span>
              </div>
              {event.target_audience && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Público</span>
                  <span className="font-semibold">{audienceLabels[event.target_audience] || event.target_audience}</span>
                </div>
              )}
              {typeof event.max_participants === "number" && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vagas</span>
                  <span className="font-semibold">{event.max_participants}</span>
                </div>
              )}
              {event.transportation && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Transporte:</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{event.transportation}</p>
                </div>
              )}
              <div className="flex gap-2">
                {event.meals_included && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">Alimentação Inclusa</Badge>
                )}
                {event.accommodation_included && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Acomodação Inclusa</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


