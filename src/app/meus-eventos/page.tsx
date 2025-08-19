'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface EventRegistration {
  id: string;
  createdAt: string;
  event: {
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    image?: string;
  };
}

export default function MeusEventosPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      const response = await fetch('/api/events/my-registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja cancelar sua inscrição neste evento?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remover da lista
        setRegistrations(prev => prev.filter(reg => reg.event.id !== eventId));
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

  const upcomingEvents = registrations.filter(reg => !isEventPast(reg.event.date));
  const pastEvents = registrations.filter(reg => isEventPast(reg.event.date));

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Meus Eventos</h1>
        <p className="text-gray-600">
          Visualize os eventos em que você está inscrito
        </p>
      </div>

      {/* Eventos Futuros */}
      {upcomingEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Eventos Futuros</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((registration) => (
              <Card key={registration.id}>
                {registration.event.image && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={registration.event.image}
                      alt={registration.event.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{registration.event.name}</CardTitle>
                  <CardDescription>
                    Inscrito em {formatDate(registration.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <span className="font-medium">📍</span>
                      <span className="ml-2">{registration.event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="font-medium">📅</span>
                      <span className="ml-2">{formatDate(registration.event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="font-medium">🕐</span>
                      <span className="ml-2">
                        {formatTime(registration.event.startTime)} - {formatTime(registration.event.endTime)}
                      </span>
                    </div>
                    
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleUnregister(registration.event.id)}
                        disabled={loading}
                      >
                        {loading ? 'Cancelando...' : 'Cancelar Inscrição'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Eventos Passados */}
      {pastEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Eventos Passados</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((registration) => (
              <Card key={registration.id} className="opacity-60">
                {registration.event.image && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={registration.event.image}
                      alt={registration.event.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{registration.event.name}</CardTitle>
                      <CardDescription>
                        Inscrito em {formatDate(registration.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Passado</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <span className="font-medium">📍</span>
                      <span className="ml-2">{registration.event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="font-medium">📅</span>
                      <span className="ml-2">{formatDate(registration.event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="font-medium">🕐</span>
                      <span className="ml-2">
                        {formatTime(registration.event.startTime)} - {formatTime(registration.event.endTime)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {registrations.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Você não está inscrito em nenhum evento
          </h3>
          <p className="text-gray-600 mb-4">
            Explore os eventos disponíveis e inscreva-se para participar.
          </p>
          <Button onClick={() => router.push('/eventos')}>
            Ver Eventos Disponíveis
          </Button>
        </div>
      )}
    </div>
  );
}
