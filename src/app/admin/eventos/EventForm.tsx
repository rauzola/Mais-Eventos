"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EventStatus = "ativo" | "inativo";

export type EventFormValues = {
  title: string;
  short_description?: string | null;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  organizer_name?: string | null;
  image_url?: string | null;
  price?: number | null;
  status?: EventStatus;
  event_date_start?: string | null; // yyyy-MM-dd
  event_time_start?: string | null; // HH:mm
};

export function EventForm({
  initialValues,
  mode,
  eventId,
}: {
  initialValues?: Partial<EventFormValues>;
  mode: "create" | "edit";
  eventId?: string;
}) {
  const [values, setValues] = React.useState<EventFormValues>({
    title: initialValues?.title ?? "",
    short_description: initialValues?.short_description ?? "",
    description: initialValues?.description ?? "",
    category: initialValues?.category ?? "",
    location: initialValues?.location ?? "",
    organizer_name: initialValues?.organizer_name ?? "",
    image_url: initialValues?.image_url ?? "",
    price: initialValues?.price ?? 0,
    status: initialValues?.status ?? "ativo",
    event_date_start: initialValues?.event_date_start ?? "",
    event_time_start: initialValues?.event_time_start ?? "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleChange = (field: keyof EventFormValues, val: string) => {
    setValues((prev) => ({ ...prev, [field]: val }));
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
        location: values.location || null,
        organizer_name: values.organizer_name || null,
        image_url: values.image_url || null,
        price: Number(values.price || 0),
        event_date_start: values.event_date_start || null,
        event_time_start: values.event_time_start || null,
      };

      const endpoint = mode === "create" ? "/api/events" : `/api/events/${eventId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao salvar evento");
      }
      setSuccess("Evento salvo com sucesso.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-700">{success}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <Input value={values.title} onChange={(e) => handleChange("title", e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Resumo</label>
        <Input value={values.short_description ?? ""} onChange={(e) => handleChange("short_description", e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          className="w-full rounded-md border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={5}
          value={values.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <Input value={values.category ?? ""} onChange={(e) => handleChange("category", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Local</label>
          <Input value={values.location ?? ""} onChange={(e) => handleChange("location", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Organizador</label>
          <Input value={values.organizer_name ?? ""} onChange={(e) => handleChange("organizer_name", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagem (URL)</label>
          <Input value={values.image_url ?? ""} onChange={(e) => handleChange("image_url", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Preço</label>
          <Input type="number" step="0.01" value={String(values.price ?? 0)} onChange={(e) => handleChange("price", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data (início)</label>
          <Input type="date" value={values.event_date_start ?? ""} onChange={(e) => handleChange("event_date_start", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hora (início)</label>
          <Input type="time" value={values.event_time_start ?? ""} onChange={(e) => handleChange("event_time_start", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select value={values.status} onValueChange={(v) => handleChange("status", v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : mode === "create" ? "Criar evento" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}


