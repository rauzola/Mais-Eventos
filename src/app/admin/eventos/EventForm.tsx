"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, CheckCircle, AlertCircle, Save } from "lucide-react";

type EventStatus = "ativo" | "cancelado" | "finalizado" | "lotado" | "inativo";

export type EventFormValues = {
  title: string;
  short_description?: string | null;
  description?: string | null;
  category?: string | null;
  target_audience?: string | null;
  location?: string | null;
  organizer_name?: string | null;
  organizer_contact?: string | null;
  image_url?: string | null;
  price?: number | null;
  status?: EventStatus;
  event_date_start?: string | null; // yyyy-MM-dd
  event_time_start?: string | null; // HH:mm
  event_date_end?: string | null;
  event_time_end?: string | null;
  max_participants?: number | null;
  payment_info?: string | null;
  required_items?: string[] | null;
  instructions?: string | null;
  cancellation_policy?: string | null;
  transportation?: string | null;
  meals_included?: boolean | null;
  accommodation_included?: boolean | null;
  confirmation_text?: string | null;
};

export function EventForm({
  initialValues,
  mode,
  eventId,
  onSuccess,
  onError,
}: {
  initialValues?: Partial<EventFormValues>;
  mode: "create" | "edit";
  eventId?: string;
  onSuccess?: (createdId?: string) => void;
  onError?: (message: string) => void;
}) {
  const [values, setValues] = React.useState<EventFormValues>({
    title: initialValues?.title ?? "",
    short_description: initialValues?.short_description ?? "",
    description: initialValues?.description ?? "",
    category: initialValues?.category ?? "",
    target_audience: initialValues?.target_audience ?? "",
    location: initialValues?.location ?? "",
    organizer_name: initialValues?.organizer_name ?? "",
    organizer_contact: initialValues?.organizer_contact ?? "",
    image_url: initialValues?.image_url ?? "",
    price: initialValues?.price ?? 0,
    status: initialValues?.status ?? "ativo",
    event_date_start: initialValues?.event_date_start ?? "",
    event_time_start: initialValues?.event_time_start ?? "",
    event_date_end: initialValues?.event_date_end ?? "",
    event_time_end: initialValues?.event_time_end ?? "",
    max_participants: initialValues?.max_participants ?? null,
    payment_info: initialValues?.payment_info ?? "",
    required_items: initialValues?.required_items ?? [],
    instructions: initialValues?.instructions ?? "",
    cancellation_policy: initialValues?.cancellation_policy ?? "",
    transportation: initialValues?.transportation ?? "",
    meals_included: initialValues?.meals_included ?? false,
    accommodation_included: initialValues?.accommodation_included ?? false,
    confirmation_text: initialValues?.confirmation_text ?? "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const router = useRouter();

  const handleChange = (field: keyof EventFormValues, val: string) => {
    setValues((prev) => ({ ...prev, [field]: val }));
  };

  const handleNumberChange = (field: keyof EventFormValues, val: string) => {
    const num = val === "" ? null : Number(val);
    setValues((prev) => ({ ...prev, [field]: (isNaN(Number(num)) ? null : (num as unknown as number | null)) }));
  };

  const handleBoolChange = (field: keyof EventFormValues, checked: boolean) => {
    setValues((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...values,
        short_description: values.short_description || null,
        description: values.description || null,
        category: values.category || null,
        target_audience: values.target_audience || null,
        location: values.location || null,
        organizer_name: values.organizer_name || null,
        organizer_contact: values.organizer_contact || null,
        image_url: values.image_url || null,
        price: Number(values.price || 0),
        event_date_start: values.event_date_start || null,
        event_time_start: values.event_time_start || null,
        event_date_end: values.event_date_end || null,
        event_time_end: values.event_time_end || null,
        max_participants: values.max_participants ?? null,
        payment_info: values.payment_info || null,
        required_items: (values.required_items ?? []) as string[],
        instructions: values.instructions || null,
        cancellation_policy: values.cancellation_policy || null,
        transportation: values.transportation || null,
        meals_included: Boolean(values.meals_included),
        accommodation_included: Boolean(values.accommodation_included),
        confirmation_text: values.confirmation_text || null,
      };

      console.log("Payload sendo enviado:", payload);
      console.log("confirmation_text:", payload.confirmation_text);

      const endpoint = mode === "create" ? "/api/events" : `/api/events/${eventId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data.error || "Falha ao salvar evento";
        onError?.(message);
        throw new Error(message);
      }
      const out = await res.json().catch(() => ({} as { event?: { id?: string } }));
      setSuccess("Evento salvo com sucesso.");
      const createdId = out?.event?.id;
      if (onSuccess) {
        onSuccess(createdId);
      } else if (mode === "create" && createdId) {
        router.push(`/eventos/${createdId}`);
      }
    } catch (err) {
      setError((err as Error).message);
      onError?.((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensagens */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Formulário Linear */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/40">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="w-5 h-5 text-blue-600" />
            Informações do Evento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 1. Título */}
          <div>
            <label className="block text-sm font-medium mb-2">Título do Evento *</label>
            <Input 
              value={values.title} 
              onChange={(e) => handleChange("title", e.target.value)} 
              placeholder="Ex: Acampamento de Novembro 2025 - Campistas" 
              required 
              className="w-full"
            />
          </div>

          {/* 2. Breve Descrição */}
          <div>
            <label className="block text-sm font-medium mb-2">Breve Descrição</label>
            <Input 
              value={values.short_description ?? ""} 
              onChange={(e) => handleChange("short_description", e.target.value)} 
              placeholder="Uma breve descrição do evento" 
              className="w-full"
            />
          </div>

          {/* 3. Descrição */}
          <div>
            <label className="block text-sm font-medium mb-2">Descrição Completa</label>
            <Textarea 
              rows={4} 
              value={values.description ?? ""} 
              onChange={(e) => handleChange("description", e.target.value)} 
              placeholder="Descreva detalhadamente o evento..." 
              className="w-full"
            />
          </div>

          {/* 4. Data de Início */}
          <div>
            <label className="block text-sm font-medium mb-2">Data de Início</label>
            <Input 
              type="date" 
              value={values.event_date_start ?? ""} 
              onChange={(e) => handleChange("event_date_start", e.target.value)} 
              className="w-full"
            />
          </div>

          {/* 5. Data de Retorno */}
          <div>
            <label className="block text-sm font-medium mb-2">Data de Retorno</label>
            <Input 
              type="date" 
              value={values.event_date_end ?? ""} 
              onChange={(e) => handleChange("event_date_end", e.target.value)} 
              className="w-full"
            />
          </div>

          {/* 6. Valor da Inscrição */}
          <div>
            <label className="block text-sm font-medium mb-2">Valor da Inscrição (R$)</label>
            <Input 
              type="number" 
              min="0" 
              step="0.01" 
              value={values.price === null || values.price === undefined ? "" : String(values.price)} 
              onChange={(e) => handleNumberChange("price", e.target.value)} 
              placeholder="350.00" 
              className="w-full"
            />
          </div>

          {/* 7. Texto para Confirmar Inscrição */}
          <div>
            <label className="block text-sm font-medium mb-2">Texto para Confirmar Inscrição</label>
            <Textarea 
              rows={4} 
              value={values.confirmation_text ?? ""} 
              onChange={(e) => handleChange("confirmation_text", e.target.value)} 
              placeholder="Texto que será exibido após a confirmação da inscrição..." 
              className="w-full"
            />
          </div>

          {/* 8. URL da Imagem */}
          <div>
            <label className="block text-sm font-medium mb-2">URL da Imagem</label>
            <Input 
              value={values.image_url ?? ""} 
              onChange={(e) => handleChange("image_url", e.target.value)} 
              placeholder="https://exemplo.com/imagem.jpg" 
              className="w-full"
            />
          </div>

          {/* Campos Adicionais (Opcionais) */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Informações Adicionais (Opcionais)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <Select value={values.category || ""} onValueChange={(v) => handleChange("category", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acampamento">🏕️ Acampamento</SelectItem>
                    <SelectItem value="retiro">⛪ Retiro</SelectItem>
                    <SelectItem value="encontro">🤝 Encontro</SelectItem>
                    <SelectItem value="formacao">📚 Formação</SelectItem>
                    <SelectItem value="oracao">🙏 Oração</SelectItem>
                    <SelectItem value="celebracao">🎉 Celebração</SelectItem>
                    <SelectItem value="servico">❤️ Serviço</SelectItem>
                    <SelectItem value="jovens">👥 Jovens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Público Alvo</label>
                <Select value={values.target_audience || ""} onValueChange={(v) => handleChange("target_audience", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o público" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">👨‍👩‍👧‍👦 Todos</SelectItem>
                    <SelectItem value="jovens">👦👧 Jovens</SelectItem>
                    <SelectItem value="adultos">🧑‍🦳 Adultos</SelectItem>
                    <SelectItem value="familias">👨‍👩‍👧‍👦 Famílias</SelectItem>
                    <SelectItem value="casais">💑 Casais</SelectItem>
                    <SelectItem value="servos">🙋‍♂️ Servos</SelectItem>
                    <SelectItem value="lideranca">👔 Liderança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Local do Evento</label>
                <Input value={values.location ?? ""} onChange={(e) => handleChange("location", e.target.value)} placeholder="Ex: Casa de Retiros São José, Maringá" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Organizador</label>
                <Input value={values.organizer_name ?? ""} onChange={(e) => handleChange("organizer_name", e.target.value)} placeholder="Ex: Pastoral da Juventude" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Contato do Organizador</label>
              <Input value={values.organizer_contact ?? ""} onChange={(e) => handleChange("organizer_contact", e.target.value)} placeholder="Ex: (44) 99999-9999 ou email@exemplo.com" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Máximo de Participantes</label>
                <Input type="number" min="1" value={values.max_participants === null || values.max_participants === undefined ? "" : String(values.max_participants)} onChange={(e) => handleNumberChange("max_participants", e.target.value)} placeholder="Ex: 50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status do Evento</label>
                <Select value={values.status} onValueChange={(v) => handleChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">✅ Ativo</SelectItem>
                    <SelectItem value="inativo">⏸️ Inativo</SelectItem>
                    <SelectItem value="lotado">🎯 Lotado</SelectItem>
                    <SelectItem value="cancelado">❌ Cancelado</SelectItem>
                    <SelectItem value="finalizado">✔️ Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Informações de Pagamento</label>
              <Textarea rows={3} value={values.payment_info ?? ""} onChange={(e) => handleChange("payment_info", e.target.value)} placeholder="Como realizar o pagamento, dados bancários, etc..." />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Instruções Gerais</label>
              <Textarea rows={4} value={values.instructions ?? ""} onChange={(e) => handleChange("instructions", e.target.value)} placeholder="Orientações importantes para os participantes..." />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Política de Cancelamento</label>
              <Textarea rows={4} value={values.cancellation_policy ?? ""} onChange={(e) => handleChange("cancellation_policy", e.target.value)} placeholder="Condições para cancelamento e reembolso..." />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Itens obrigatórios (um por linha)</label>
              <Textarea rows={4} value={(values.required_items ?? []).join("\n")} onChange={(e) => setValues((prev) => ({ ...prev, required_items: e.target.value.split("\n").map(s => s).filter(Boolean) }))} placeholder="Digite um item por linha" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Informações sobre Transporte</label>
              <Textarea rows={3} value={values.transportation ?? ""} onChange={(e) => handleChange("transportation", e.target.value)} placeholder="Como chegar ao local, transporte disponível, etc..." />
            </div>

            <div className="flex items-center gap-6 mt-4 pt-4 border-t">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(values.meals_included)} onChange={(e) => handleBoolChange("meals_included", e.target.checked)} />
                🍽️ Alimentação inclusa
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(values.accommodation_included)} onChange={(e) => handleBoolChange("accommodation_included", e.target.checked)} />
                🏠 Acomodação inclusa
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading} className="min-w-[200px]">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {mode === "create" ? "Criar evento" : "Salvar alterações"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}


