'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  image?: string;
  createdAt: string;
  createdBy: string;
  creatorEmail: string;
  creatorRole: string;
  registrationCount: string;
}

export default function EventosAdminPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const handleCreateEvent = () => {
    router.push('/admin/eventos/criar');
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/admin/eventos/${eventId}/editar`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEvents();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao deletar evento');
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      alert('Erro ao deletar evento');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'CONCELHO']}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Eventos</h1>
          <Button onClick={handleCreateEvent}>
            Criar Novo Evento
          </Button>
        </div>

        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      Criado por {event.creatorEmail} ({event.creatorRole})
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Local:</strong> {event.location}
                  </div>
                  <div>
                    <strong>Data:</strong> {formatDate(event.date)}
                  </div>
                  <div>
                    <strong>Horário:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                  <div>
                    <strong>Inscrições:</strong> {event.registrationCount}
                  </div>
                  <div className="col-span-2">
                    <strong>Descrição:</strong> {event.description}
                  </div>
                  {event.image && (
                    <div className="col-span-2">
                      <strong>Imagem:</strong> {event.image}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum evento cadastrado
            </h3>
            <p className="text-gray-600">
                             Clique em &quot;Criar Novo Evento&quot; para começar.
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
