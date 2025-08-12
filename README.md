# Mais Eventos - Sistema de Autenticação

## Visão Geral

Este é um sistema de autenticação simplificado para a aplicação Mais Eventos, desenvolvido com Next.js 15, Prisma ORM e PostgreSQL (Supabase).

## Funcionalidades

- **Cadastro**: Criação de conta com email e senha
- **Login**: Autenticação com email e senha
- **Sessões**: Sistema de sessões baseado em cookies HTTP-only
- **Dashboard**: Página protegida para usuários autenticados
- **Logout**: Encerramento seguro de sessão

## Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Autenticação**: bcrypt para hash de senhas, sessões baseadas em tokens
- **Gerenciador de Pacotes**: Yarn

## Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── login/
│   │   │   └── route.ts
│   │   └── register/
│   │       └── route.ts
│   ├── cadastro/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── login/
│       └── page.tsx
├── components/
│   ├── login/
│   │   └── index.tsx
│   ├── register/
│   │   └── index.tsx
│   └── ui/
└── lib/
    ├── generate-session.ts
    └── prisma-pg.ts
prisma/
└── schema.prisma
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
POSTGRES_URL="sua_url_do_supabase"
POSTGRES_URL_NON_POOLING="sua_url_direta_do_supabase"

# JWT (opcional, usado para gerar tokens de sessão)
SUPABASE_JWT_SECRET="seu_secret_jwt"
```

### Instalação

1. Instale as dependências:
```bash
yarn install
```

2. Configure o banco de dados:
```bash
yarn prisma migrate dev
```

3. Gere o cliente Prisma:
```bash
yarn prisma generate
```

4. Inicie o servidor de desenvolvimento:
```bash
yarn dev
```

## Uso

### Cadastro

1. Acesse `/cadastro`
2. Preencha email e senha (mínimo 6 caracteres)
3. Confirme a senha
4. Clique em "Cadastrar"

### Login

1. Acesse `/login`
2. Digite email e senha
3. Clique em "Entrar"
4. Será redirecionado para `/dashboard`

### Dashboard

- Página protegida que só pode ser acessada por usuários autenticados
- Mostra informações do usuário e da sessão
- Botão para fazer logout

### Logout

- Clique em "Sair" no dashboard
- A sessão será invalidada no banco
- O cookie será removido
- Redirecionamento para a página de login

## Segurança

- **Senhas**: Criptografadas com bcrypt (salt rounds: 12)
- **Cookies**: HTTP-only, não acessíveis via JavaScript
- **Sessões**: Tokens únicos e seguros
- **Validação**: Verificação de email e senha obrigatórios
- **Proteção**: Redirecionamento automático para usuários não autenticados

## Banco de Dados

### Tabelas

- **users**: Armazena informações dos usuários
- **sessions**: Gerencia sessões ativas

### Schema Prisma

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  Sessions  Sessions[]
  
  @@map("users")
}

model Sessions {
  id        String   @id @default(cuid())
  userId    String
  token     String
  expiresAt DateTime
  valid     Boolean  @default(true)
  createdAt DateTime @default(now())
  User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}
```

## API Endpoints

### POST /api/register
- **Body**: `{ email, password, password2 }`
- **Resposta**: `{ message, user: { id, email } }`

### POST /api/login
- **Body**: `{ email, password }`
- **Resposta**: `{ session: "token" }`
- **Cookie**: Define `auth-session`

### GET /api/login
- **Verificação**: Status da autenticação
- **Resposta**: `{ authenticated: true }` ou `{ error: "Não autenticado" }`

### POST /api/auth/logout
- **Ação**: Invalida sessão e remove cookie
- **Resposta**: `{ message: "Logout realizado com sucesso" }`

## Desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento
yarn dev

# Build
yarn build

# Lint
yarn lint

# Prisma
yarn prisma studio          # Interface visual do banco
yarn prisma migrate dev     # Criar e aplicar migração
yarn prisma generate        # Gerar cliente Prisma
yarn prisma db push         # Sincronizar schema (sem migração)
```

### Estrutura de Sessões

O sistema usa um token de sessão único gerado a partir de:
- Secret JWT
- Email do usuário
- Hash da senha
- Timestamp atual

Este token é criptografado com bcrypt e armazenado no banco junto com:
- ID do usuário
- Data de expiração (24 horas)
- Status de validade

## Próximos Passos

- [ ] Implementar recuperação de senha
- [ ] Adicionar verificação de email
- [ ] Implementar refresh de sessão
- [ ] Adicionar rate limiting
- [ ] Implementar auditoria de ações
- [ ] Adicionar autenticação de dois fatores (2FA)

## Suporte

Para dúvidas ou problemas, verifique:
1. Logs do console do navegador
2. Logs do servidor Next.js
3. Status da conexão com o banco de dados
4. Validação das variáveis de ambiente
