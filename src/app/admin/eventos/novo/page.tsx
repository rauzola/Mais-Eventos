import Link from "next/link";
import { EventForm } from "@/app/admin/eventos/EventForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Plus } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function NovoEventoPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <span className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Plus className="w-6 h-6" />
                </span>
                Criar Novo Evento
              </h1>
              <p className="text-white/90 mt-2 text-lg">
                Projeto Mais Vida - Igreja Católica de Maringá
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/50">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Formulário de Evento</h2>
              <p className="text-muted-foreground">Preencha as informações abaixo para criar um novo evento</p>
            </div>
          </div>
          <EventForm mode="create" />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}


