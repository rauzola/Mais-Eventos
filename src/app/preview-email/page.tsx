"use client";

import AcampaCampista from "@/components/Email/acampa-campista";

export default function PreviewEmailPage() {
  // Dados de exemplo para visualização
  const sampleData = {
    nomeCompleto: "João Silva Santos",
    email: "joao.silva@email.com",
    cpf: "123.456.789-00",
    dataNascimento: "15/03/1990",
    estadoCivil: "SOLTEIRO",
    tamanhoCamiseta: "M",
    profissao: "Engenheiro",
    telefone: "(44) 99999-9999",
    contatoEmergencia: "Maria Silva Santos",
    telefoneEmergencia: "(44) 88888-8888",
    cidade: "Maringá",
    portadorDoenca: "Diabetes tipo 1",
    alergiaIntolerancia: "Intolerância à lactose",
    medicacaoUso: "Insulina, Metformina",
    restricaoAlimentar: "Dieta sem lactose",
    numeroPlano: "123456789",
    operadora: "Unimed",
    termo1: true,
    termo2: true,
    termo3: true,
    frente: "animacao",
    arquivoUrl: "https://exemplo.com/comprovante.pdf",
    eventTitle: "Acampamento de Novembro 2025 - Servos",
    eventDateStart: "20 de novembro de 2025 (Quinta-feira)",
    eventDateEnd: "23 de novembro de 2025 (Domingo)",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            📧 Preview do Email do Acampamento
          </h1>
          <p className="text-gray-600 mb-4">
            Esta é uma visualização de como o email será enviado para os participantes do acampamento.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Dados de Exemplo:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li><strong>Nome:</strong> {sampleData.nomeCompleto}</li>
              <li><strong>Email:</strong> {sampleData.email}</li>
              <li><strong>Frente:</strong> {sampleData.frente}</li>
              <li><strong>Evento:</strong> {sampleData.eventTitle}</li>
            </ul>
          </div>
        </div>

        {/* Preview do Email */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-lg font-semibold">📧 Visualização do Email</h2>
            <p className="text-sm opacity-90">Como aparecerá na caixa de entrada</p>
          </div>
          
          <div className="p-0">
            <AcampaCampista {...sampleData} />
          </div>
        </div>

        {/* Informações Técnicas */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4">
            🔧 Informações Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📤 Envio Automático:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Email enviado após cadastro bem-sucedido</li>
                <li>✅ Template personalizado para acampamento</li>
                <li>✅ Dados dinâmicos do evento</li>
                <li>✅ Informações completas do participante</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📋 Conteúdo Incluído:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>📅 Datas do evento</li>
                <li>🧳 Lista de materiais necessários</li>
                <li>📝 Dados cadastrados completos</li>
                <li>🏥 Informações de saúde</li>
                <li>👥 Frente de trabalho</li>
                <li>📎 Link do comprovante</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
