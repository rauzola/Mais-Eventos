import { EventForm } from "@/app/admin/eventos/EventForm";

export default function NovoEventoPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Novo Evento</h1>
      <EventForm mode="create" />
    </div>
  );
}


