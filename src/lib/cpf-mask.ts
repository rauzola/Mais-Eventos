import { z } from "zod";

// Schema Zod para CPF
export const cpfSchema = z
  .string()
  .min(1, "CPF é obrigatório")
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00");

// Função para aplicar máscara no CPF
export const applyCpfMask = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limitedNumbers = numbers.slice(0, 11);
  
  // Aplica a máscara 000.000.000-00
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 9) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9, 11)}`;
  }
};

// Função para remover máscara do CPF (só números)
export const removeCpfMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Função para validar CPF usando Zod
export const validateCpf = (cpf: string): { isValid: boolean; error?: string } => {
  try {
    cpfSchema.parse(cpf);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: "CPF inválido" };
  }
};

// Função para validar CPF apenas com números
export const validateCpfNumbers = (cpfNumbers: string): { isValid: boolean; error?: string } => {
  if (cpfNumbers.length !== 11) {
    return { isValid: false, error: "CPF deve ter 11 dígitos" };
  }
  
  // Validação básica de CPF (algoritmo)
  if (!/^\d{11}$/.test(cpfNumbers)) {
    return { isValid: false, error: "CPF deve conter apenas números" };
  }
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfNumbers)) {
    return { isValid: false, error: "CPF inválido" };
  }
  
  // Algoritmo de validação de CPF
  let sum = 0;
  let remainder;
  
  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpfNumbers.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfNumbers.substring(9, 10))) {
    return { isValid: false, error: "CPF inválido" };
  }
  
  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpfNumbers.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfNumbers.substring(10, 11))) {
    return { isValid: false, error: "CPF inválido" };
  }
  
  return { isValid: true };
};
