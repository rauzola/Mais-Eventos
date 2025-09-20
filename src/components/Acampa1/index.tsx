"use client";

import { RegisterForm } from "./registerAcampa";

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
  participant_type?: string | null;
};

export default function Acampa1({ event }: { event: ApiEvent })  {
 
  return (
    <>
      {/* <h1>{event.id}</h1>
      <h1>{event.title}</h1>
      <h1>{event.short_description}</h1>
      <h1>{event.description}</h1> */}
      <RegisterForm eventId={event.id} event={event} />
      </>
  );
}
