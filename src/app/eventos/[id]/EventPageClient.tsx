"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Book, Flashlight, Bug, Sun, Brush, Bed, CloudRain, Droplet, Trash2, Thermometer, Shirt, Sword, Headphones, Upload, Crown, Footprints } from "lucide-react";

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
};

function formatDate(date?: string | null) {
  if (!date) return "Data não definida";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Data inválida";
  return d.toLocaleDateString();
}

export default function EventPageClient({ event }: { event: ApiEvent }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    shirtSize: "",
    observations: "",
    file: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  // Limpar preview quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Detectar tipo de arquivo
      if (file.type.startsWith('image/')) {
        setFileType('image');
      } else if (file.type === 'application/pdf') {
        setFileType('pdf');
      } else {
        setFileType('other');
      }
    } else {
      setPreviewUrl(null);
      setFileType(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50">


        <div className="w-full pt-0 py-8 px-8">


      {/* Imagem no topo da página */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 ">
        <Image
          src="https://images.prismic.io/projetomaisvida/Z3euqpbqstJ99Am6_banner-transformed.jpeg?auto=format,compress"
          alt="Banner Projeto Mais Vida"
          fill
          className="object-contain"
          priority
          draggable={false}
        />
      </div>


        {/* Progress indicator */}
        <div className="mb-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-300 ${currentStep >= 1 ? 'bg-gradient-to-r from-primary to-blue-600 scale-110' : 'bg-gray-300'}`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className={`text-sm font-medium mt-2 transition-colors duration-300 ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                  Instruções
                </span>
              </div>
              
              <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${currentStep > 1 ? 'bg-gradient-to-r from-primary to-blue-600' : 'bg-gray-300'}`}></div>
              
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-primary to-blue-600 scale-110' : 'bg-gray-300'}`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className={`text-sm font-medium mt-2 transition-colors duration-300 ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                  Dados
                </span>
              </div>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/30 mx-4 rounded-3xl">

              <CardContent className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
                {/* Welcome Section */}
                <div className="text-center space-y-6 md:space-y-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full mb-6 shadow-lg">
                    <span className="text-3xl">🙏</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-8">
                    Formulário Servos
                  </h2>
                  
                  <div className="max-w-4xl mx-auto space-y-4 text-lg leading-relaxed">
                    <p className="text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6 rounded-xl border border-blue-100">
                      <strong className="text-primary">Seja bem-vindo!</strong> Você está sendo convidado(a) a 
                      servir no {event.title}, uma das atividades da Igreja Católica de Maringá, 
                      organizado e promovido pelo {event.organizer_name || 'Projeto Mais Vida'}.
                    </p>

                    <p className="text-gray-700 bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
                      {event.description || 'Temos como carisma promover um encontro profundo com Deus, consigo mesmo e com o outro. Este trabalho é baseado no processo de relação de ajuda e tem como objetivo o autoconhecimento e a formação humana e espiritual. Durante o evento você poderá participar de atividades físicas e dinâmicas em grupo.'}
                    </p>
                  </div>
                </div>

                <Separator className="my-4 md:my-6 lg:my-8" />

                {/* Event Dates */}
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-2xl font-bold text-primary mb-6 text-center flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    DATAS DO EVENTO
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                          {event.event_date_start ? new Date(event.event_date_start).getDate() : '19'}
                        </div>
                        <div>
                          <h4 className="font-bold text-green-800 text-lg">Data de Início</h4>
                          <p className="text-green-700">{formatDate(event.event_date_start) || '19 de junho de 2025'}</p>
                          <p className="text-green-600 text-sm">({event.event_time_start || 'quinta-feira'})</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 md:p-6 rounded-2xl border border-red-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                          {event.event_date_end ? new Date(event.event_date_end).getDate() : '22'}
                        </div>
                        <div>
                          <h4 className="font-bold text-red-800 text-lg">Data de Retorno</h4>
                          <p className="text-red-700">{formatDate(event.event_date_end) || '22 de junho de 2025'}</p>
                          <p className="text-red-600 text-sm">({event.event_time_end || 'domingo'})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Materials Section */}
                <div className="space-y-4 md:space-y-6">
                  <h4 className="text-2xl font-bold text-primary text-center flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    MATERIAIS NECESSÁRIOS
                  </h4>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-2xl border border-blue-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {event.required_items && event.required_items.length > 0 ? (
                        event.required_items.map((item, index) => (
                          <div
                            key={index}
                            className="group bg-white p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300 shrink-0 mt-1">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-gray-700 text-sm leading-relaxed font-medium">
                                {item}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        [
                          { icon: Book, text: "Bíblia Sagrada", color: "text-purple-600" },
                          { icon: Flashlight, text: "Lanterna", color: "text-yellow-600" },
                          { icon: Bug, text: "Repelente", color: "text-green-600" },
                          { icon: Sun, text: "Protetor solar", color: "text-orange-600" },
                          { icon: Brush, text: "Materiais de higiene pessoal", color: "text-blue-600" },
                          { icon: Bed, text: "Colchão", color: "text-indigo-600" },
                          { icon: Bed, text: "Roupa de cama", color: "text-violet-600" },
                          { icon: Bed, text: "Travesseiro", color: "text-pink-600" },
                          { icon: Bed, text: "Cobertor", color: "text-red-600" },
                          { icon: CloudRain, text: "Capa de chuva", color: "text-cyan-600" },
                          { icon: Droplet, text: "Garrafinha d'água", color: "text-blue-500" },
                          { icon: Crown, text: "Boné", color: "text-amber-600" },
                          { icon: Trash2, text: "Sacos plásticos", color: "text-gray-600" },
                          { icon: Footprints, text: "Sapatos confortáveis e fechados", color: "text-brown-600" },
                          { icon: Thermometer, text: "Roupas de frio", color: "text-teal-600" },
                          { icon: Shirt, text: "Roupas discretas", color: "text-slate-600" },
                          { icon: Sword, text: "Roupas de guerra (para usar sem dó)", color: "text-red-700" },
                          { icon: Headphones, text: "Protetor auricular", color: "text-purple-600" },
                        ].map(({ icon: Icon, text, color }, index) => (
                          <div
                            key={index}
                            className="group bg-white p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`${color} group-hover:scale-110 transition-transform duration-300 shrink-0 mt-1`}>
                                <Icon size={20} />
                              </div>
                              <span className="text-gray-700 text-sm leading-relaxed font-medium">
                                {text}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
               <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">💰</span>
                    </div>
                    <h4 className="text-2xl font-bold text-amber-800">
                      Valor e Condições de Inscrição
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-amber-200">
                      <p className="text-lg font-bold text-amber-800">
                        💵 Valor da inscrição: <span className="text-2xl text-amber-900">R$ 75,00</span>
                        <span className="text-sm font-normal text-amber-700 block">(Setenta e cinco reais)</span>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-800">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✅</span>
                          <p><strong>Até 7 dias:</strong> Reembolso total</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-600 mt-1">⚠️</span>
                          <p><strong>8º dia até 5 dias antes:</strong> Reembolso de 50%</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">❌</span>
                          <p><strong>Menos de 5 dias:</strong> Não haverá devolução</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">ℹ️</span>
                          <p><strong>Reembolso:</strong> Até 15 dias úteis</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banking Info */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🏦</span>
                    </div>
                    <h4 className="text-2xl font-bold text-green-800">
                      Dados Bancários
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-green-200 space-y-3">
                      <h5 className="font-bold text-green-800 text-lg border-b border-green-200 pb-2">PIX</h5>
                      <div className="space-y-2 text-green-700">
                        <p><strong>Chave:</strong> <code className="bg-green-100 px-2 py-1 rounded text-sm">04.585.680/0001-03</code></p>
                        <p><strong>Nome:</strong> Projeto Mais Vida</p>
                        <p><strong>CNPJ:</strong> 04.585.680/0001-03</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border border-green-200 space-y-3">
                      <h5 className="font-bold text-green-800 text-lg border-b border-green-200 pb-2">Transferência</h5>
                      <div className="space-y-2 text-green-700">
                        <p><strong>Banco:</strong> CEF (Caixa Econômica Federal)</p>
                        <p><strong>Operação:</strong> 003</p>
                        <p><strong>Agência:</strong> 0395</p>
                        <p><strong>Conta Jurídica:</strong> 4839-2</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-green-100 p-4 rounded-lg border border-green-300">
                    <p className="text-green-800 font-medium">
                      📱 <strong>Parcelamento:</strong> Entre em contato pelo WhatsApp: 
                      <a href="https://wa.me/5544991372331" className="ml-1 text-green-600 hover:text-green-800 underline font-bold">
                        44 99137-2331
                      </a>
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                {event.instructions && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8 rounded-2xl border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">📋</span>
                      </div>
                      <h4 className="text-2xl font-bold text-blue-800">
                        Instruções Gerais
                      </h4>
                    </div>
                    <div className="bg-white p-4 md:p-6 rounded-xl border border-blue-200">
                      <p className="text-blue-800 whitespace-pre-line">{event.instructions}</p>
                    </div>
                  </div>
                )}

                <Separator className="my-4 md:my-6 lg:my-8" />

                {/* Privacy Policy */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 md:p-6 lg:p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🛡️</span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800">
                      Autorização para Coleta de Dados Pessoais
                    </h4>
                  </div>
                  
                  <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
                    <p className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
                      Ao preencher esta ficha de inscrição, o participante declara estar ciente e concorda com a 
                      coleta e tratamento de seus dados pessoais pelo {event.organizer_name || 'Projeto Mais Vida'}, para as seguintes finalidades:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
                        <h5 className="font-bold text-gray-800 mb-3">📝 Finalidades:</h5>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            Identificação e cadastro para participação
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            Comunicação sobre informações do evento
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            Emissão de certificados e materiais
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            Cumprimento de obrigações legais
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            Pesquisas de satisfação e futuros eventos
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
                        <h5 className="font-bold text-gray-800 mb-3">🔒 Compromissos:</h5>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            Uso estrito para finalidades informadas
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            Medidas de segurança implementadas
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            Armazenamento pelo tempo necessário
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            Direitos garantidos conforme LGPD
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-800">
                        <strong>ℹ️ Importante:</strong> O participante pode revogar este consentimento a qualquer momento, 
                        mediante solicitação formal ao {event.organizer_name || 'Projeto Mais Vida'}, sem prejuízo da legalidade do tratamento realizado 
                        com base no consentimento previamente dado.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gradient-to-r from-red-50 to-pink-50 p-4 md:p-6 lg:p-8 rounded-b-2xl border-t border-red-200">
                <div className="w-full text-center">
                  <div className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                    <p className="text-xl font-bold flex items-center justify-center gap-2">
                      ⚡ VAGAS LIMITADAS!!! ⚡
                    </p>
                    <p className="text-red-100 text-sm mt-1">Garante já sua vaga!</p>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleNextStep} 
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-10 py-4 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
              >
                Continuar para Inscrição 
                <ArrowRight size={24} className="ml-3" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="dataSection px-4">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/30 rounded-3xl">
              <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-3xl py-8">
                <CardTitle className="text-3xl md:text-4xl font-bold mb-3">
                  Dados de Inscrição
                </CardTitle>
                <CardDescription className="text-blue-100 text-xl">
                  Complete suas informações para finalizar a inscrição
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 md:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   

                    <div className="space-y-4">
                      <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                        Comprovante de Pagamento *
                      </Label>
                      
                      {/* Preview do arquivo */}
                      {previewUrl && (
                        <div className="relative w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                          {fileType === 'image' && (
                            <Image
                              src={previewUrl}
                              alt="Preview do comprovante"
                              fill
                              className="object-contain"
                            />
                          )}
                          {fileType === 'pdf' && (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-700 mb-2">Arquivo PDF</h3>
                              <p className="text-sm text-gray-500 mb-3">Clique para visualizar</p>
                              <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                              >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Abrir PDF
                              </a>
                            </div>
                          )}
                          {fileType === 'other' && (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                              <div className="w-16 h-16 bg-gray-500 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-700 mb-2">Arquivo Selecionado</h3>
                              <p className="text-sm text-gray-500">Arquivo pronto para upload</p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewUrl(null);
                              setFileType(null);
                              setFormData(prev => ({ ...prev, file: null }));
                              // Limpar o input
                              const fileInput = document.getElementById('file') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      
                      {/* Campo de upload */}
                      <div className="relative">
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Formatos aceitos: PDF, JPG, PNG (máx. 5MB)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observations" className="text-sm font-medium text-gray-700">
                      Observações
                    </Label>
                    <Textarea
                      id="observations"
                      placeholder="Alguma informação adicional que gostaria de compartilhar? (alergias, necessidades especiais, etc.)"
                      value={formData.observations}
                      onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Lembrete:</strong> Sua inscrição será confirmada após a análise do comprovante de pagamento. 
                      Você receberá um e-mail de confirmação em até 24 horas.
                    </p>
                  </div>
                </form>
              </CardContent>

              <CardFooter className="flex justify-between bg-gradient-to-r from-gray-50 to-blue-50 p-6 md:p-8 rounded-b-3xl border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={handlePrevStep}
                  className="px-6 py-3 text-lg font-semibold rounded-xl border-2 hover:bg-gray-100 transition-all duration-300"
                >
                  <ArrowLeft size={20} className="mr-2" /> Voltar
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  disabled={!formData.shirtSize || !formData.file}
                >
                  Finalizar Inscrição
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
