"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, Heart } from "lucide-react";
import Link from 'next/link';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-blue-600">Projeto Mais Vida</h1>
          </div>
        </div>

        {/* 404 Card */}
        <Card className="animate-in fade-in duration-500 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-red-600 mb-2">
              404
            </CardTitle>
            <CardDescription className="text-xl text-gray-600">
              Página não encontrada
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Search className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">
                    Esta página não existe
                  </h3>
                  <p className="text-red-700 text-sm">
                    A página que você está procurando não foi encontrada. Ela pode ter sido movida, removida ou o link pode estar incorreto.
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                O que você pode fazer:
              </h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Verifique se o endereço está correto</li>
                <li>• Volte para a página inicial</li>
                <li>• Use o menu de navegação</li>
                <li>• Entre em contato conosco se precisar de ajuda</li>
              </ul>
            </div>

           
            {/* Contact Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Precisa de ajuda?
              </h3>
              <p className="text-yellow-700 text-sm mb-2">
                Se você acredita que esta página deveria existir, entre em contato conosco:
              </p>
              <div className="space-y-1 text-sm text-yellow-600">
                <p>📧 <strong>Email:</strong> site@projetomaisvida.com.br</p>
                <p>📱 <strong>WhatsApp:</strong> (44) 99137-2331</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Projeto Mais Vida - Instituição da Igreja Católica de Maringá ⛪
          </p>
          <Link href="https://instagram.com/raul_sigoli" target="_blank">
            <p className="text-gray-400 text-xs mt-2">
              feito por @Raul_Sigoli
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
