// /components/Email/bem-vindo.tsx
import * as React from 'react';

interface acampaCapistaProps {
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
  portadorDoenca: string;
  alergiaIntolerancia: string;
  medicacaoUso: string;
  restricaoAlimentar: string;
  numeroPlano: string;
  operadora: string;
  frente?: string;
  arquivoUrl?: string;
  eventTitle?: string;
  eventDateStart?: string;
  eventDateEnd?: string;
}

export const acampaCapista: React.FC<Readonly<acampaCapistaProps>> = ({
  nomeCompleto,
  email,
  cpf,
  dataNascimento,
  estadoCivil,
  tamanhoCamiseta,
  profissao,
  telefone,
  contatoEmergencia,
  telefoneEmergencia,
  cidade,
  portadorDoenca,
  alergiaIntolerancia,
  medicacaoUso,
  restricaoAlimentar,
  numeroPlano,
  operadora,
  frente,
  arquivoUrl,
  eventTitle = "Acampamento de Novembro 2025",
  eventDateStart,
  eventDateEnd,
}) => (
  <div style={{ 
    fontFamily: 'Arial, sans-serif', 
    maxWidth: '600px', 
    margin: '0 auto', 
    padding: '20px',
    backgroundColor: '#f8fafc'
  }}>
    {/* Header */}
    <div style={{ 
      textAlign: 'center', 
      backgroundColor: '#3b82f6', 
      color: 'white', 
      padding: '30px 20px',
      borderRadius: '10px 10px 0 0'
    }}>
      <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
        ⛪ Projeto Mais Vida
      </h1>
      <p style={{ margin: '10px 0 0 0', fontSize: '16px', opacity: '0.9' }}>
        Instituição da Igreja Católica de Maringá
      </p>
    </div>

    {/* Content */}
    <div style={{ 
      backgroundColor: 'white', 
      padding: '30px', 
      borderRadius: '0 0 10px 10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Welcome Message */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1e40af', fontSize: '24px', marginBottom: '15px', textAlign: 'center' }}>
          Bem vindo ao Projeto Mais Vida!
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', textAlign: 'center', marginBottom: '20px' }}>
          Sua inscrição para o <strong>{eventTitle}</strong> foi recebida!
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '15px' }}>
          Em breve você receberá em seu WhatsApp a confirmação da sua inscrição.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '15px' }}>
          Durante o acampamento, você participará de dinâmicas e atividades enriquecedoras que fortalecem a fé e a convivência fraterna, e para isso, pedimos atenção às instruções gerais:
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '15px' }}>
          Caso tenha alguma dúvida entrar em contato com a Renata pelo WhatsApp do Projeto Mais Vida <strong>44 99137-2331</strong>
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '25px' }}>
          É muito importante que você salve o nosso número em seu celular, pois enviaremos algumas informações via lista de transmissão.
        </p>
      </div>

      {/* Datas Importantes */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#1e40af', 
          fontSize: '20px', 
          marginBottom: '15px',
          paddingBottom: '8px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          📅 Datas Importantes
        </h2>
        
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px', 
            color: '#374151',
            lineHeight: '1.8',
            fontSize: '16px'
          }}>
            <li><strong>Início:</strong> {eventDateStart || "20 de novembro de 2025 (Quinta-feira)"}</li>
            <li><strong>Retorno:</strong> {eventDateEnd || "23 de novembro de 2025 (Domingo)"}</li>
            <li><strong>Local de saída:</strong> Estacionamento dos fundos da Catedral (o Projeto Mais Vida disponibilizará ônibus para traslado de todos os campistas até a fazenda)</li>
          </ul>
        </div>
      </div>

      {/* Materiais Necessários */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#1e40af', 
          fontSize: '20px', 
          marginBottom: '15px',
          paddingBottom: '8px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          🧳 Materiais Necessários
        </h2>
        
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #bbf7d0'
        }}>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px', 
            color: '#374151',
            lineHeight: '1.8',
            fontSize: '16px'
          }}>
            <li>Bíblia Sagrada</li>
            <li>Lanterna</li>
            <li>Repelente</li>
            <li>Protetor solar</li>
            <li>Materiais de higiene pessoal</li>
            <li>Roupa de cama, travesseiro e cobertor</li>
            <li>Capa de chuva</li>
            <li>Garrafinha d&apos;água</li>
            <li>Boné</li>
            <li>Sacos plásticos</li>
            <li>Sapatos confortáveis e fechados (tênis, bota, galocha...)</li>
            <li>Roupas de frio e roupas discretas</li>
            <li>Roupas de guerra (para atividades intensas)</li>
            <li>Protetor auricular</li>
          </ul>
        </div>
      </div>

      {/* Seus Dados Cadastrados */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#1e40af', 
          fontSize: '20px', 
          marginBottom: '15px',
          paddingBottom: '8px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          📝 Seus Dados Cadastrados
        </h2>
        
        {/* Informações Pessoais */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            color: '#374151', 
            fontSize: '18px', 
            marginBottom: '10px'
          }}>
            Informações Pessoais
          </h3>
          
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <ul style={{ 
              margin: '0', 
              paddingLeft: '20px', 
              color: '#374151',
              lineHeight: '1.8',
              fontSize: '16px'
            }}>
              <li><strong>Nome:</strong> {nomeCompleto}</li>
              <li><strong>CPF:</strong> {cpf}</li>
              <li><strong>Data de Nascimento:</strong> {dataNascimento}</li>
              <li><strong>Estado Civil:</strong> {estadoCivil}</li>
              <li><strong>Profissão:</strong> {profissao}</li>
              <li><strong>Tamanho da Camiseta:</strong> {tamanhoCamiseta.toUpperCase()}</li>
              <li><strong>Cidade:</strong> {cidade}</li>
            </ul>
          </div>
        </div>

        {/* Contatos */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            color: '#374151', 
            fontSize: '18px', 
            marginBottom: '10px'
          }}>
            Contatos
          </h3>
          
          <div style={{ 
            backgroundColor: '#fef2f2', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #fecaca'
          }}>
            <ul style={{ 
              margin: '0', 
              paddingLeft: '20px', 
              color: '#374151',
              lineHeight: '1.8',
              fontSize: '16px'
            }}>
              <li><strong>Telefone:</strong> {telefone}</li>
              <li><strong>E-mail:</strong> {email}</li>
              <li><strong>Contato de Emergência:</strong> {contatoEmergencia}</li>
              <li><strong>Telefone de Emergência:</strong> {telefoneEmergencia}</li>
            </ul>
          </div>
        </div>

        {/* Informações de Saúde */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            color: '#374151', 
            fontSize: '18px', 
            marginBottom: '10px'
          }}>
            Informações de Saúde
          </h3>
          
          <div style={{ 
            backgroundColor: '#f0f9ff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #bae6fd'
          }}>
            <ul style={{ 
              margin: '0', 
              paddingLeft: '20px', 
              color: '#374151',
              lineHeight: '1.8',
              fontSize: '16px'
            }}>
              <li><strong>Possui Doença:</strong> {portadorDoenca ? "Sim" : "Não"}</li>
              {portadorDoenca && <li><strong>Especificação:</strong> {portadorDoenca}</li>}
              
              <li><strong>Possui Alergia:</strong> {alergiaIntolerancia ? "Sim" : "Não"}</li>
              {alergiaIntolerancia && <li><strong>Especificação:</strong> {alergiaIntolerancia}</li>}
              
              <li><strong>Usa Medicação Contínua:</strong> {medicacaoUso ? "Sim" : "Não"}</li>
              {medicacaoUso && <li><strong>Medicamentos:</strong> {medicacaoUso}</li>}
              
              <li><strong>Possui Restrição Alimentar:</strong> {restricaoAlimentar ? "Sim" : "Não"}</li>
              {restricaoAlimentar && <li><strong>Especificação:</strong> {restricaoAlimentar}</li>}
              
              <li><strong>Possui Plano de Saúde:</strong> {operadora ? "Sim" : "Não"}</li>
              {operadora && (
                <>
                  <li><strong>Operadora:</strong> {operadora}</li>
                  <li><strong>Número do Plano:</strong> {numeroPlano}</li>
                </>
              )}
            </ul>
          </div>
        </div>

      

        {/* Frente de Trabalho (se aplicável) */}
        {frente && frente !== 'campista' && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              color: '#374151', 
              fontSize: '18px', 
              marginBottom: '10px'
            }}>
              Frente de Trabalho
            </h3>
            
            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #fde68a'
            }}>
              <p style={{ 
                margin: '0', 
                color: '#374151',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                <strong>Frente:</strong> {frente}
              </p>
            </div>
          </div>
        )}

        {/* Comprovante */}
        {arquivoUrl && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              color: '#374151', 
              fontSize: '18px', 
              marginBottom: '10px'
            }}>
              Comprovante
            </h3>
            
            <div style={{ 
              backgroundColor: '#f3e8ff', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #d8b4fe'
            }}>
              <p style={{ 
                margin: '0', 
                color: '#374151',
                fontSize: '16px'
              }}>
                <strong>URL do Comprovante:</strong> <a href={arquivoUrl} style={{ color: '#1e40af', textDecoration: 'underline' }}>Visualizar Comprovante</a>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginBottom: '20px'
      }}>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0 0 20px 0' }} />
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '15px' }}>
          Sua inscrição será confirmada pelo e-mail ou WhatsApp em poucos dias.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '15px' }}>
          Caso tenha alguma dúvida, entre em contato conosco pelo telefone <strong>(44) 99137-2331</strong>.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '15px' }}>
          Agradecemos por sua inscrição!
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '15px' }}>
          Atenciosamente,<br />Equipe Projeto Mais Vida
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginBottom: '0' }}>
          <strong>Importante:</strong> Se colocou algum dado ou informação errado, por favor mande um email para <strong>site@projetomaisvida.com.br</strong>
        </p>
      </div>

      {/* Final Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px 0',
        borderTop: '1px solid #e5e7eb',
        marginTop: '20px'
      }}>
        <p style={{ 
          fontSize: '12px', 
          color: '#9ca3af', 
          margin: '0' 
        }}>
          Instituição da Igreja Católica de Maringá - Este é um e-mail automático, por favor não responda.
        </p>
      </div>
    </div>
  </div>
);

export default acampaCapista;