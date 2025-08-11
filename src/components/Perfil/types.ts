  // /components/Perfil/types.ts

  import { z } from "zod";

// Schema para Perfil
export const perfilSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  estado_civil: z.string().min(1, "Estado civil é obrigatório"),
  profissao: z.string().min(1, "Profissão é obrigatória"),
  telefone_contato: z.string().min(11, "Telefone inválido"),
  contato_emergencia: z.string().min(1, "Contato de emergência é obrigatório"),
  telefone_contato_emergencia: z
    .string()
    .min(11, "Telefone de emergência inválido"),
  tamanho_camiseta: z.string().min(1, "Tamanho da camiseta é obrigatório"),
});

// Schema para Saúde
export const saudeSchema = z.object({
  portadorDoenca: z.boolean(),
  doencas: z.string().optional(),
  alergias: z.boolean(),
  alergiasDetalhe: z.string().optional(),
  medicacao: z.boolean(),
  medicamentos: z.string().optional(),
  planoSaude: z.boolean(),
  operadoraPlano: z.string().optional(),
  numeroInscricaoPlano: z.string().optional(),
});

// Schema para Comunidade
export const comunidadeSchema = z.object({
  nomeComunidade: z.string().min(1, "Nome da comunidade é obrigatório"),
  dataAcampa1: z.string().optional(),
  nomeAcampa2: z.string().optional(),
  dataAcampa2: z.string().optional(),
  dataEnvio: z.string().optional(),
  assessores: z.string().min(1, "Assessores é obrigatório"),
});

// Tipos para cada formulário
export type PerfilFormData = z.infer<typeof perfilSchema>;
export type SaudeFormData = z.infer<typeof saudeSchema>;
export type ComunidadeFormData = z.infer<typeof comunidadeSchema>;
