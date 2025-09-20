"use client";

import { RegisterForm } from "./registerAcampa";

type ApiEvent = {
  id: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
};

export default function Acampa1({ event }: { event: ApiEvent })  {
 
  return (
    <>
      {/* <h1>{event.id}</h1>
      <h1>{event.title}</h1>
      <h1>{event.short_description}</h1>
      <h1>{event.description}</h1> */}
      <RegisterForm eventId={event.id} />
      </>
  );
}
