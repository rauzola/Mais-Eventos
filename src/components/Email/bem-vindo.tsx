// /components/Email/bem-vindo.tsx
import * as React from 'react';

interface EmailTemplateProps {
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
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
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
      <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: '0.8' }}>
        Bem-vindo(a) à nossa comunidade de saúde e bem-estar!
      </p>
    </div>

    {/* Content */}
    <div style={{ 
      backgroundColor: 'white', 
      padding: '30px', 
      borderRadius: '0 0 10px 10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ color: '#1e40af', fontSize: '22px', marginBottom: '15px' }}>
          Olá, {nomeCompleto}! 👋
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
          É com grande alegria que recebemos você no <strong>Projeto Mais Vida</strong>! 
          Seu cadastro foi realizado com sucesso e agora você faz parte de uma comunidade 
          católica dedicada ao cuidado da saúde e promoção do bem-estar em Maringá.
        </p>
      </div>

      {/* Dados Pessoais */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          color: '#1e40af', 
          fontSize: '18px', 
          marginBottom: '15px',
          paddingBottom: '8px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          📋 Seus Dados Cadastrados
        </h3>
        
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Nome Completo: </span>
              <span style={{ color: '#6b7280' }}>{nomeCompleto}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>E-mail: </span>
              <span style={{ color: '#6b7280' }}>{email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>CPF: </span>
              <span style={{ color: '#6b7280' }}>{cpf}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Data de Nascimento: </span>
              <span style={{ color: '#6b7280' }}>{dataNascimento}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Estado Civil: </span>
              <span style={{ color: '#6b7280' }}>{estadoCivil}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Tamanho da Camiseta: </span>
              <span style={{ color: '#6b7280' }}>{tamanhoCamiseta.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Profissão: </span>
              <span style={{ color: '#6b7280' }}>{profissao}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Telefone: </span>
              <span style={{ color: '#6b7280' }}>{telefone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Cidade: </span>
              <span style={{ color: '#6b7280' }}>{cidade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contato de Emergência */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          color: '#1e40af', 
          fontSize: '18px', 
          marginBottom: '15px',
          paddingBottom: '8px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          🚨 Contato de Emergência
        </h3>
        
        <div style={{ 
          backgroundColor: '#fef2f2', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Nome do Contato: </span>
              <span style={{ color: '#6b7280' }}>{contatoEmergencia}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Telefone: </span>
              <span style={{ color: '#6b7280' }}>{telefoneEmergencia}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informações de Saúde */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          color: '#1e40af', 
          fontSize: '18px', 
          marginBottom: '15px',
          paddingBottom: '8px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          🏥 Informações de Saúde
        </h3>
        
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Portador de Doença: </span>
              <span style={{ color: '#6b7280' }}>{portadorDoenca || 'Não informado'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Alergia/Intolerância: </span>
              <span style={{ color: '#6b7280' }}>{alergiaIntolerancia || 'Não informado'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Medicação em Uso: </span>
              <span style={{ color: '#6b7280' }}>{medicacaoUso || 'Não informado'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Restrição Alimentar: </span>
              <span style={{ color: '#6b7280' }}>{restricaoAlimentar || 'Não informado'}</span>
            </div>
            {operadora && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', color: '#374151' }}>Operadora do Plano: </span>
                <span style={{ color: '#6b7280' }}>{operadora}</span>
              </div>
            )}
            {numeroPlano && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', color: '#374151' }}>Número do Plano: </span>
                <span style={{ color: '#6b7280' }}>{numeroPlano}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Próximos Passos */}
      <div style={{ 
        backgroundColor: '#f0fdf4', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #bbf7d0',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          color: '#166534', 
          fontSize: '18px', 
          marginBottom: '15px'
        }}>
          🎯 Próximos Passos
        </h3>
        <ul style={{ 
          margin: '0', 
          paddingLeft: '20px', 
          color: '#374151',
          lineHeight: '1.6'
        }}>
          <li>Faça login em nossa plataforma usando seu e-mail e senha</li>
          <li>Explore os recursos disponíveis para cuidar da sua saúde</li>
          <li>Participe de nossas atividades e eventos católicos</li>
          <li>Mantenha suas informações sempre atualizadas</li>
          <li>Conecte-se com nossa comunidade de fé em Maringá</li>
        </ul>
      </div>

      {/* Contato */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          color: '#1e40af', 
          fontSize: '18px', 
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          📞 Dúvidas ou Informações
        </h3>
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#374151', 
            margin: '0 0 10px 0' 
          }}>
            Se tiver alguma dúvida, entre em contato conosco:
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#1e40af', 
            margin: '0 0 5px 0',
            fontWeight: 'bold'
          }}>
            📧 site@projetomaisvida.com.br
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#1e40af', 
            margin: '0',
            fontWeight: 'bold'
          }}>
            📱 WhatsApp: (44) 99137-2331
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px 0',
        borderTop: '1px solid #e5e7eb',
        marginTop: '20px'
      }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          margin: '0 0 10px 0' 
        }}>
          Obrigado por fazer parte do <strong>Projeto Mais Vida</strong>!
        </p>
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

export default EmailTemplate;