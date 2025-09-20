"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, MessageCircle, Calendar, Heart, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function AcampaSucessoPage() {
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

        {/* Success Card */}
        <Card className="animate-in fade-in duration-500 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600 mb-2">
              Inscrição Realizada com Sucesso! 🎉
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Sua inscrição para o acampamento foi recebida e está sendo processada.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email Confirmation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">
                    Email de Confirmação Enviado
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Enviamos um email com todas as informações do acampamento, datas importantes e materiais necessários para o seu endereço de email.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Information */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-1">
                    Confirmação via WhatsApp
                  </h3>
                  <p className="text-green-700 text-sm mb-2">
                    Em breve você receberá a confirmação da sua inscrição via WhatsApp.
                  </p>
                  <p className="text-green-700 text-sm font-medium">
                    📱 <strong>Importante:</strong> Salve o número (44) 99137-2331 em seu celular para receber informações via lista de transmissão.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Próximos Passos
                  </h3>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Verifique sua caixa de email (incluindo spam)</li>
                    <li>• Aguarde a confirmação via WhatsApp</li>
                    <li>• Prepare os materiais listados no email</li>
                    <li>• Mantenha o comprovante de pagamento</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Dúvidas ou Informações
              </h3>
              <p className="text-gray-700 text-sm mb-2">
                Caso tenha alguma dúvida, entre em contato conosco:
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📧 <strong>Email:</strong> site@projetomaisvida.com.br</p>
                <p>📱 <strong>WhatsApp:</strong> (44) 99137-2331</p>
              </div>
            </div>

           

         
          </CardContent>
        </Card>

        {/* Footer */}
         {/* Copyright */}
         <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Projeto Mais Vida. Todos os direitos
              reservados.
            </p>
            <Link href="https://instagram.com/raul_sigoli" target="_blank">
              <p className="text-gray-500 text-xs mt-2">
                feito por @Raul_Sigoli
              </p>
            </Link>
          </div>
      </div>
    </div>
  );
}
