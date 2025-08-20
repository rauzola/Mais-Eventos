// components/register/index.tsx

"use client";

import { RegisterResponse } from "@/app/api/register/route";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { Heart, ArrowLeft, Check, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DadosPessoais } from "./DadosPessoais";
import { FichaSaude } from "./FichaSaude";

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
  planoSaude: string;
  termo1: boolean;
  termo2: boolean;
  termo3: boolean;
}

export function RegisterForm() {
  const router = useRouter();

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
    planoSaude: "",
    termo1: false,
    termo2: false,
    termo3: false,
  });

  const updateFormData = (data: Partial<CadastroData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
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
      await axios.post<RegisterResponse>("/api/register", {
        // Campos básicos
        email: formData.email,
        password: formData.senha,
        password2: formData.confirmarSenha,
        
        // Dados Pessoais
        nomeCompleto: formData.nomeCompleto,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
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
        planoSaude: formData.planoSaude,
        
        // Termos e Condições
        termo1: formData.termo1,
        termo2: formData.termo2,
        termo3: formData.termo3,
      }, {
        timeout: 10000, // 10 segundos de timeout
      });

          setFormLoading(false);
          setFormSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
        } catch (error) {
          console.error("Erro no cadastro:", error);
          
          if (error instanceof AxiosError) {
            const { error: errorMessage } = error.response?.data as RegisterResponse;
            setFormError(errorMessage || "Erro interno do servidor. Tente novamente.");
          } else if (error instanceof Error) {
            setFormError(error.message || "Erro inesperado. Tente novamente.");
          } else {
            setFormError("Erro inesperado. Tente novamente.");
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
              <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                Dados Pessoais
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4">
              <div 
                className={`h-full bg-blue-600 transition-all duration-300 ${
                  currentStep >= 2 ? 'w-full' : 'w-0'
                }`}
            />
          </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                Ficha de Saúde
              </span>
            </div>
          </div>
          </div>

        {/* Form Content */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-in scale-in duration-500">
          <CardHeader>
            <CardTitle className="text-center">
              {currentStep === 1 ? 'Dados Pessoais' : 'Ficha de Saúde'}
            </CardTitle>
          </CardHeader>
          <CardContent>
          {formError && (
              <div className="text-amber-600 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-semibold">Erro no formulário</p>
              </div>
              <p className="text-sm mt-1">{formError}</p>
            </div>
          )}
          {formSuccess && (
              <div className="text-green-600 p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm font-semibold">Cadastro realizado com sucesso!</p>
              </div>
                <p className="text-sm mt-1">Redirecionando para o login...</p>
            </div>
          )}
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para o login
          </Link>
        </div>
      </div>
          </div>
  );
}
