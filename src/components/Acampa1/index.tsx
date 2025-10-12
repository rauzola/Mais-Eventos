"use client";

import { RegisterForm } from "./registerAcampa";
import { EventoLotado } from "./EventoLotado";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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

interface CapacityData {
  success: boolean;
  totalInscricoes: number;
  isLotado: boolean;
  limite: number;
}

export default function Acampa1({ event }: { event: ApiEvent })  {
  const [capacityData, setCapacityData] = useState<CapacityData | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkCapacity = async () => {
      try {
        const response = await fetch(`/api/events/${event.id}/capacity`);
        if (response.ok) {
          const data = await response.json();
          setCapacityData(data);
        }
      } catch (error) {
        console.error("Erro ao verificar capacidade:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCapacity();
  }, [event.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando disponibilidade...</p>
        </div>
      </div>
    );
  }

  // Verificar se é o evento específico do acampamento de novembro 2025
  const isAcampaNovembro2025 = event.title?.toLowerCase().includes('novembro') && 
                               event.title?.toLowerCase().includes('2025') &&
                               event.participant_type !== 'servo';

  // Se for o evento específico e estiver lotado, mostrar componente de lotado
  if (isAcampaNovembro2025 && capacityData?.isLotado) {
    return <EventoLotado event={event} totalInscricoes={capacityData.totalInscricoes} />;
  }

  // Verificar se é a página de lista de espera
  const isListaEspera = pathname.includes('campista-espera');

  return (
    <>
      <RegisterForm 
        eventId={event.id} 
        event={event} 
        isListaEspera={isListaEspera}
      />
    </>
  );
}
