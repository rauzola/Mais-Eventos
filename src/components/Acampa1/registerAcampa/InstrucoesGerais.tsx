import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight,
  Book,
  Flashlight,
  Bug,
  Sun,
  Brush,
  Bed,
  CloudRain,
  Droplet,
  Trash2,
  Thermometer,
  Shirt,
  Sword,
  Headphones
} from "lucide-react";

interface InstrucoesGeraisProps {
  onNext: () => void;
  event?: {
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
    confirmation_text?: string | null;
    participant_type?: string | null;
  };
}

// Função para converter números para escrita por extenso em português
function numberToWords(value: number): string {
  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  if (value === 0) return 'zero';
  if (value < 0) return 'menos ' + numberToWords(-value);

  let result = '';

  // Centenas
  if (value >= 100) {
    const hundred = Math.floor(value / 100);
    if (hundred === 1 && value % 100 === 0) {
      return 'cem';
    }
    result += hundreds[hundred];
    value %= 100;
    if (value > 0) {
      result += ' e ';
    }
  }

  // Dezenas e unidades
  if (value >= 20) {
    const ten = Math.floor(value / 10);
    result += tens[ten];
    value %= 10;
    if (value > 0) {
      result += ' e ';
    }
  } else if (value >= 10) {
    result += teens[value - 10];
    value = 0;
  }

  if (value > 0) {
    result += units[value];
  }

  return result;
}

export function InstrucoesGerais({ onNext, event }: InstrucoesGeraisProps) {
  console.log("InstrucoesGerais - event recebido:", event);
  console.log("InstrucoesGerais - confirmation_text:", event?.confirmation_text);
  
  return (
    <Card className="border-2 border-blue-200 shadow-lg">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg py-6">
        <CardTitle className="text-3xl font-bold">
          {event?.title || "Acampamento de Novembro 2025"}
        </CardTitle>
        <CardDescription className="text-blue-100 text-lg mt-2">
          {event?.organizer_name || "Projeto Mais Vida - Igreja Católica de Maringá"}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">
            Formulário de Inscrição
          </h2>

          

          <div className="prose max-w-none">
            {event?.short_description && (
              <p className="text-gray-700 text-lg">
                {event.short_description}
              </p>
            )}

            {event?.description && (
              <p className="text-gray-700 mt-4">
                {event.description}
              </p>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Instruções específicas do evento */}
        {event?.instructions && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-yellow-800 mb-2">
              INSTRUÇÕES ESPECÍFICAS DO EVENTO:
            </h4>
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: event.instructions }} />
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-bold text-blue-800 mb-4">
            INSTRUÇÕES GERAIS:
          </h3>

          

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">1</span>
                </div>
                <span className="text-gray-700">
                  <strong>Data de início:</strong> {event?.event_date_start ? new Date(event.event_date_start).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : "20 de novembro de 2025 (quinta-feira)"}
                </span>
              </div>

             

              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">2</span>
                </div>
                <span className="text-gray-700">
                  <strong>Data de retorno:</strong> {event?.event_date_end ? new Date(event.event_date_end).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : "23 de novembrsssssso de 2025 (domingo)"}
                </span>
              </div>
            </div>
          </div>

          <h4 className="font-semibold text-blue-800 mt-6 mb-4 text-lg">
            MATERIAIS QUE DEVEM SER LEVADOS:
          </h4>
          <div className="border border-blue-200 rounded-md p-4 bg-white shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Itens específicos do evento se disponível */}
              {event?.required_items && event.required_items.length > 0 ? (
                event.required_items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Book
                      className="text-blue-500 flex-shrink-0"
                      size={24}
                    />
                    <span className="text-gray-700 text-sm leading-tight">
                      {item}
                    </span>
                  </div>
                ))
              ) : (
                // Itens padrão se não houver itens específicos do evento
                [
                  { icon: Book, text: "Bíblia Sagrada" },
                  { icon: Flashlight, text: "Lanterna" },
                  { icon: Bug, text: "Repelente" },
                  { icon: Sun, text: "Protetor solar" },
                  {
                    icon: Brush,
                    text: "Materiais de higiene pessoal",
                  },
                  { icon: Bed, text: "Colchão" },
                  { icon: Bed, text: "Roupa de cama" },
                  { icon: Bed, text: "Travesseiro" },
                  { icon: Bed, text: "Cobertor" },
                  { icon: CloudRain, text: "Capa de chuva" },
                  { icon: Droplet, text: "Garrafinha d´agua" },
                  { icon: Sun, text: "Boné" },
                  { icon: Trash2, text: "Sacos plásticos" },
                  {
                    icon: Shirt,
                    text: "Sapatos confortáveis e fechados (tênis, bota, botina, galocha...)",
                  },
                  { icon: Thermometer, text: "Roupas de frio" },
                  { icon: Shirt, text: "Roupas discretas" },
                  {
                    icon: Sword,
                    text: "Roupas de guerra (para usar sem dó)",
                  },
                  {
                    icon: Headphones,
                    text: "Protetor auricular (À venda em lojas de EPIs)",
                  },
                ].map(({ icon: Icon, text }, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Icon
                      className="text-blue-500 flex-shrink-0"
                      size={24}
                    />
                    <span className="text-gray-700 text-sm leading-tight">
                      {text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-amber-800 mb-2">
            VALOR E CONDIÇÕES DE INSCRIÇÃO:
          </h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Valor da inscrição:</strong> R$ {event?.price ? event.price.toFixed(2).replace('.', ',') : '350,00'}
              {event?.price ? ` (${numberToWords(Math.floor(event.price))} reais)` : ' (trezentos e cinquenta reais)'}
            </li>
            {event?.confirmation_text && (
              <li className={event?.participant_type === "espera" ? "text-red-600 font-semibold" : ""}>
                {event.confirmation_text}
              </li>
            )}
            <li>
              <strong>
                Direito de Arrependimento (Até 7 dias):
              </strong>{" "}
              Reembolso total.
            </li>
            <li>
              <strong>
                Desistência entre 8º dia e até 5 dias antes:
              </strong>{" "}
              Reembolso de 50% do valor.
            </li>
            <li>
              <strong>Menos de 5 dias antes do evento:</strong>{" "}
              Não haverá devolução.
            </li>
            <li>
              O reembolso, quando aplicável, será realizado em
              até 15 dias úteis.
            </li>
          </ul>
        </div>


        {/* Só mostra os dados bancários se não for lista de espera */}
        {event?.participant_type !== "espera" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-green-800 mb-2">
              DADOS BANCÁRIOS:
            </h4>
            
            {/* Informações de pagamento do evento se disponível */}
            {event?.payment_info ? (
              <div className="text-gray-700 mb-4">
                <div dangerouslySetInnerHTML={{ __html: event.payment_info }} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p>
                    <strong>Chave de Pix:</strong> CNPJ
                    04.585.680/0001-03
                  </p>
                  <p>
                    <strong>Nome:</strong> {event?.organizer_name || "Projeto Mais Vida"}
                  </p>
                  <p>
                    <strong>CNPJ:</strong> 04.585.680/0001-03
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Banco:</strong> CEF (Caixa Econômica
                    Federal)
                  </p>
                  <p>
                    <strong>Operação:</strong> 003
                  </p>
                  <p>
                    <strong>Agência:</strong> 0395
                  </p>
                  <p>
                    <strong>Conta Jurídica:</strong> 4839-2
                  </p>
                </div>
              </div>
            )}
            
            <p className="mt-2 text-gray-700">
              <strong>Parcelamento:</strong> Entre em contato pelo
              WhatsApp: {event?.organizer_contact || "44 99137-2331"}
            </p>
          </div>
        )}

        <Separator className="my-6" />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-gray-800 mb-2">
            AUTORIZAÇÃO PARA COLETA E TRATAMENTO DE DADOS
            PESSOAIS:
          </h4>
          <div className="text-sm text-gray-700">
            <p>
              Ao preencher esta ficha de inscrição, o
              participante declara estar ciente e concorda com a
              coleta e tratamento de seus dados pessoais pelo
              Projeto Mais Vida, para as seguintes finalidades:
            </p>
            <ul className="list-disc list-inside mt-2 mb-2 pl-4">
              <li>
                Identificação e cadastro para participação no
                acampamento;
              </li>
              <li>
                Comunicação sobre informações relevantes do
                evento (horários, programação, avisos);
              </li>
              <li>
                Emissão de certificados e materiais relacionados
                ao acampamento;
              </li>
              <li>
                Cumprimento de obrigações legais (emissão de
                notas fiscais, seguros, etc.);
              </li>
              <li>
                Contato para pesquisas de satisfação e
                divulgação de futuros eventos do Projeto Mais
                Vida.
              </li>
            </ul>
            <p className="mb-2">
              Os dados coletados incluem: nome completo, data de
              nascimento, RG, CPF, endereço, telefone, e-mail,
              religião, informações de saúde relevantes
              (alergias, restrições alimentares, etc.), dados de
              contato de emergência e outros.
            </p>
            <p className="mb-2">
              O Projeto Mais Vida se compromete a:
            </p>
            <ul className="list-disc list-inside mt-2 mb-2 pl-4">
              <li>
                Utilizar os dados coletados estritamente para as
                finalidades informadas;
              </li>
              <li>
                Implementar medidas de segurança para proteger
                os dados contra acesso não autorizado, uso
                indevido ou perda;
              </li>
              <li>
                Manter os dados armazenados apenas pelo tempo
                necessário para as finalidades informadas, ou
                conforme exigido por lei;
              </li>
              <li>
                Garantir ao participante o direito de acessar,
                corrigir, atualizar ou solicitar a exclusão de
                seus dados, conforme previsto na LGPD.
              </li>
            </ul>
            <p>
              O participante declara estar ciente de que pode
              revogar este consentimento a qualquer momento,
              mediante solicitação formal ao Projeto Mais Vida,
              sem prejuízo da legalidade do tratamento realizado
              com base no consentimento previamente dado.
            </p>
            <p>
              Para exercer seus direitos ou obter mais
              informações sobre a nossa política de privacidade,
              entre em contato conosco através dos canais de
              comunicação do Projeto Mais Vida.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col bg-gray-50 p-6 rounded-b-lg border-t border-gray-200">
        <div className="bg-red-50 px-4 py-2 mb-6 rounded-md border border-red-200 text-center w-full">
          <p className="text-red-700 font-bold text-lg">
            VAGAS LIMITADAS!!!
          </p>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={onNext}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Continuar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
