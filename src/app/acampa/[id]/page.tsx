
import { prisma } from "@/lib/prisma-vercel";
import Acampa1 from "../../../components/Acampa1";

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
  confirmation_text?: string | null;
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
  confirmation_text?: string | null;
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
    confirmation_text: ev.confirmation_text ?? null,
  };
}



export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-700">Evento não encontrado.</div>
    );
  }

  return <Acampa1 event={event}/>;
}
