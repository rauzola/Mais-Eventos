'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

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

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
    fetchUserRegistrations();
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

  const fetchUserRegistrations = async () => {
    try {
      const response = await fetch('/api/events/my-registrations');
      if (response.ok) {
        const registrations = await response.json();
                 const eventIds = registrations.map((reg: { event: { id: string } }) => reg.event.id);
        setUserRegistrations(new Set(eventIds));
      }
    } catch (error) {
      console.error('Erro ao buscar inscrições do usuário:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
      });

      if (response.ok) {
        // Adicionar à lista de inscrições
        setUserRegistrations(prev => new Set(prev).add(eventId));
                 // Atualizar contador de inscrições
         setEvents(prev => prev.map(event => 
           event.id === eventId 
             ? { ...event, registrationCount: String(parseInt(event.registrationCount) + 1) }
             : event
         ));
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao se inscrever no evento');
      }
    } catch (error) {
      console.error('Erro ao se inscrever no evento:', error);
      alert('Erro ao se inscrever no evento');
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (eventId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remover da lista de inscrições
        setUserRegistrations(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
                 // Atualizar contador de inscrições
         setEvents(prev => prev.map(event => 
           event.id === eventId 
             ? { ...event, registrationCount: String(parseInt(event.registrationCount) - 1) }
             : event
         ));
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao cancelar inscrição');
      }
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      alert('Erro ao cancelar inscrição');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const isEventPast = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const isUserRegistered = (eventId: string) => {
    return userRegistrations.has(eventId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Eventos Disponíveis</h1>
        <p className="text-gray-600">
          Visualize e inscreva-se nos eventos disponíveis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const isPast = isEventPast(event.date);
          const isRegistered = isUserRegistered(event.id);
          
          return (
            <Card key={event.id} className={`${isPast ? 'opacity-60' : ''}`}>
              {event.image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                                         <CardDescription>
                       Criado por {event.creatorEmail}
                     </CardDescription>
                  </div>
                  {isPast && (
                    <Badge variant="secondary">Passado</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="font-medium">📍</span>
                    <span className="ml-2">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="font-medium">📅</span>
                    <span className="ml-2">{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="font-medium">🕐</span>
                    <span className="ml-2">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                  
                                     <div className="flex items-center text-sm">
                     <span className="font-medium">👥</span>
                     <span className="ml-2">{event.registrationCount} inscritos</span>
                   </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {event.description}
                  </p>
                  
                  {!isPast && (
                    <div className="pt-2">
                      {isRegistered ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleUnregister(event.id)}
                          disabled={loading}
                        >
                          {loading ? 'Cancelando...' : 'Cancelar Inscrição'}
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => handleRegister(event.id)}
                          disabled={loading}
                        >
                          {loading ? 'Inscrevendo...' : 'Inscrever-se'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum evento disponível
          </h3>
          <p className="text-gray-600">
            Não há eventos cadastrados no momento.
          </p>
        </div>
      )}
    </div>
  );
}
