// Funções de máscara para campos do formulário

// Máscara para CPF: 000.000.000-00
export function applyCpfMask(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}

export function removeCpfMask(value: string): string {
  return value.replace(/\D/g, '');
}

// Máscara para telefone: (00) 00000-0000 ou (00) 0000-0000
export function applyPhoneMask(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

export function removePhoneMask(value: string): string {
  return value.replace(/\D/g, '');
}

// Máscara para data de nascimento: dd/mm/aaaa
export function applyDateMask(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
  
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
}

export function removeDateMask(value: string): string {
  return value.replace(/\D/g, '');
}

// Converter data do formato dd/mm/aaaa para aaaa-mm-dd (formato HTML date input)
export function convertDateToHtmlFormat(dateString: string): string {
  const cleanDate = removeDateMask(dateString);
  if (cleanDate.length !== 8) return '';
  
  const day = cleanDate.slice(0, 2);
  const month = cleanDate.slice(2, 4);
  const year = cleanDate.slice(4, 8);
  
  return `${year}-${month}-${day}`;
}

// Converter data do formato aaaa-mm-dd (HTML date input) para dd/mm/aaaa
export function convertDateFromHtmlFormat(dateString: string): string {
  if (!dateString) return '';
  
  const parts = dateString.split('-');
  if (parts.length !== 3) return '';
  
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  
  return `${day}/${month}/${year}`;
}

// Validação de senha robusta
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} {
  const errors: string[] = [];
  let score = 0;

  // Verificar comprimento mínimo
  if (password.length < 6) {
    errors.push("A senha deve ter pelo menos 6 caracteres");
  } else {
    score += 1;
  }

  // Verificar se tem letras (maiúsculas ou minúsculas)
  if (!/[a-zA-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra");
  } else {
    score += 1;
  }

  // Verificar se tem números
  if (!/\d/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  } else {
    score += 1;
  }

  // Verificar se tem caracteres especiais
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)");
  } else {
    score += 1;
  }

  // Determinar força da senha
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 3) strength = 'medium';
  if (score >= 4) strength = 'strong';

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

// Validação de CPF
export function validateCpf(cpf: string): boolean {
  const cleanCpf = removeCpfMask(cpf);
  
  if (cleanCpf.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf[9])) return false;
  
  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf[10])) return false;
  
  return true;
}

// Validação de telefone
export function validatePhone(phone: string): boolean {
  const cleanPhone = removePhoneMask(phone);
  // Telefone deve ter 10 ou 11 dígitos (com DDD)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

// Validação de data
export function validateDate(dateString: string): boolean {
  const cleanDate = removeDateMask(dateString);
  if (cleanDate.length !== 8) return false;
  
  const day = parseInt(cleanDate.slice(0, 2));
  const month = parseInt(cleanDate.slice(2, 4));
  const year = parseInt(cleanDate.slice(4, 8));
  
  // Validações básicas
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  // Verificar se a data é válida
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && 
         date.getMonth() === month - 1 && 
         date.getFullYear() === year;
}
