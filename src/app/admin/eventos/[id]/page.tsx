import { EventForm, type EventFormValues } from "@/app/admin/eventos/EventForm";
import ProtectedRoute from "@/components/ProtectedRoute";

type ApiEvent = {
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

async function getEvent(id: string): Promise<Partial<EventFormValues> | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/events/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const e: ApiEvent | undefined = data.event as ApiEvent | undefined;
    if (!e) return null;
    return {
      title: e.title,
      short_description: e.short_description ?? "",
      description: e.description ?? "",
      category: e.category ?? "",
      location: e.location ?? "",
      organizer_name: e.organizer_name ?? "",
      image_url: e.image_url ?? "",
      price: e.price ?? 0,
      status: e.status ?? "ativo",
      event_date_start: e.event_date_start ? new Date(e.event_date_start).toISOString().slice(0,10) : "",
      event_time_start: e.event_time_start ?? "",
    };
  } catch {}
  return null;
}

export default async function EditEventoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initial = await getEvent(id);
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Editar Evento</h1>
      <EventForm mode="edit" eventId={id} initialValues={initial ?? undefined} />
    </div>
    </ProtectedRoute>
  );
}


