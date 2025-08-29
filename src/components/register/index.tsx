// components/register/index.tsx

"use client";

import { RegisterResponse } from "@/app/api/register/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { Heart, ArrowLeft, Check, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { DadosPessoais } from "./DadosPessoais";
import { FichaSaude } from "./FichaSaude";
import { TermosCondicoes } from "./TermosCondicoes";
import { convertDateToHtmlFormat } from "@/lib/masks";
import { ToastContainer, useToast, ToastProvider } from "@/components/ui/toast";

export interface CadastroData {
  // Step 1 - Dados Pessoais
  nomeCompleto: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  estadoCivil: string;
  tamanhoCamiseta: string;
  profissao: string;
  telefone: string;
  contatoEmergencia: string;
  telefoneEmergencia: string;
  cidade: string;
  senha: string;
  confirmarSenha: string;
  
  // Step 2 - Ficha de Saúde
  portadorDoenca: string;
  alergiaIntolerancia: string;
  medicacaoUso: string;
  restricaoAlimentar: string;
  numeroPlano: string;
  operadora: string;
  termo1: boolean;
  termo2: boolean;
  termo3: boolean;
}

function RegisterFormContent() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  // Estados do formulário
  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Dados do formulário
  const [formData, setFormData] = useState<CadastroData>({
    nomeCompleto: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    estadoCivil: "",
    tamanhoCamiseta: "",
    profissao: "",
    telefone: "",
    contatoEmergencia: "",
    telefoneEmergencia: "",
    cidade: "",
    senha: "",
    confirmarSenha: "",
    portadorDoenca: "",
    alergiaIntolerancia: "",
    medicacaoUso: "",
    restricaoAlimentar: "",
    numeroPlano: "",
    operadora: "",
    termo1: false,
    termo2: false,
    termo3: false,
  });



  const updateFormData = useCallback((data: Partial<CadastroData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setFormLoading(true);
      
      // Converter data de nascimento do formato dd/mm/aaaa para aaaa-mm-dd
      let dataNascimentoFormatada = formData.dataNascimento;
      if (formData.dataNascimento.includes('/')) {
        dataNascimentoFormatada = convertDateToHtmlFormat(formData.dataNascimento);
      }
      

      
      console.log("=== ENVIANDO DADOS PARA API ===");
      console.log("FormData completo:", formData);
      console.log("Campos de saúde:", {
        operadora: formData.operadora,
        numeroPlano: formData.numeroPlano,
        portadorDoenca: formData.portadorDoenca,
        alergiaIntolerancia: formData.alergiaIntolerancia,
        medicacaoUso: formData.medicacaoUso,
        restricaoAlimentar: formData.restricaoAlimentar
      });
      
      await axios.post<RegisterResponse>("/api/register", {
        // Campos básicos
        email: formData.email,
        password: formData.senha,
        password2: formData.confirmarSenha,
        
        // Dados Pessoais
        nomeCompleto: formData.nomeCompleto,
        cpf: formData.cpf,
        dataNascimento: dataNascimentoFormatada,
        estadoCivil: formData.estadoCivil,
        tamanhoCamiseta: formData.tamanhoCamiseta,
        profissao: formData.profissao,
        telefone: formData.telefone,
        contatoEmergencia: formData.contatoEmergencia,
        telefoneEmergencia: formData.telefoneEmergencia,
        cidade: formData.cidade,
        
        // Ficha de Saúde
        portadorDoenca: formData.portadorDoenca,
        alergiaIntolerancia: formData.alergiaIntolerancia,
        medicacaoUso: formData.medicacaoUso,
        restricaoAlimentar: formData.restricaoAlimentar,
        operadora: formData.operadora,
        numeroPlano: formData.numeroPlano,
        
        // Termos e Condições
        termo1: formData.termo1,
        termo2: formData.termo2,
        termo3: formData.termo3,
      });

      setFormLoading(false);
      setFormSuccess(true);
      showSuccess("Cadastro realizado com sucesso! Redirecionando...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      if (error instanceof AxiosError) {
        const { error: errorMessage } = error.response?.data as RegisterResponse;
        showError(errorMessage || "Erro interno do servidor. Tente novamente.");
      } else {
        showError("Erro inesperado. Tente novamente.");
      }
      setFormLoading(false);
      setFormSuccess(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DadosPessoais
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            formError={formError}
            setFormError={setFormError}
          />
        );
      case 2:
        return (
          <FichaSaude
            data={formData}
            updateData={updateFormData}
            onPrevious={handlePrevious}
            onNext={handleNext}
            formError={formError}
            setFormError={setFormError}
            formLoading={formLoading}
          />
        );
      case 3:
        return (
          <TermosCondicoes
            data={formData}
            updateData={updateFormData}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            formError={formError}
            setFormError={setFormError}
            formLoading={formLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Toast Container */}
      <ToastContainer />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-blue-600">Projeto Mais Vida</h1>
          </div>
          <p className="text-gray-600">
            Junte-se a nós em uma jornada de saúde e bem-estar
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className={`text-sm ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                Dados Pessoais
              </span>
            </div>
            
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className={`text-sm ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                Ficha de Saúde
              </span>
            </div>
            
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 3 ? <Check className="h-4 w-4" /> : '3'}
              </div>
              <span className={`text-sm ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                Termos e Condições
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <Card className="animate-in fade-in duration-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-600">
              {currentStep === 1 ? "Dados Pessoais" : 
               currentStep === 2 ? "Ficha de Saúde" : "Termos e Condições"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 
                ? "Preencha suas informações pessoais básicas" 
                : currentStep === 2
                ? "Informações sobre sua saúde"
                : "Leia e aceite os termos para continuar"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Success Message */}
        {formSuccess && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center animate-in fade-in duration-500">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Cadastro realizado com sucesso!</span>
            </div>
            <p className="text-green-700">Redirecionando para o login...</p>
          </div>
        )}

        {/* Error Message */}
        {formError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center animate-in fade-in duration-500">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Erro no cadastro</span>
            </div>
            <p className="text-red-700">{formError}</p>
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Já possui uma conta?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterForm() {
  return (
    <ToastProvider>
      <RegisterFormContent />
    </ToastProvider>
  );
}
