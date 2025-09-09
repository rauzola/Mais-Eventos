## Mais Eventos — Sistema de Gerenciamento de Eventos

Plataforma para gestão completa de eventos. Pessoas poderão se cadastrar, se inscrever em eventos disponíveis, confirmar presença via QR Code e geolocalização (garantindo presença real), e o conselho/admin poderá acompanhar inscrições, presenças e engajamento com relatórios detalhados.

### Principais módulos (MVP e próximos)
- **Cadastro e Autenticação**: criação de conta, login, sessões com cookie HTTP-only, logout seguro.
- **Eventos e Inscrições**: catálogo de eventos, inscrição com regras e limites.
- **Check-in Presença**: QR Code + geolocalização para validação no local.
- **Área do Admin (Conselho)**: visão de inscritos, presentes, faltas, tempo sem participação e relatórios.

## Tecnologias e como foram usadas
- **Next.js 15 (App Router)**: páginas, APIs serverless (`/app/api/*`) e middleware para headers de segurança/performance.
- **React 19 + TypeScript**: UI e tipagem do projeto.
- **Tailwind CSS**: estilização utilitária e componentes com `src/components/ui/*`.
- **Prisma ORM**: modelagem e acesso ao PostgreSQL (Supabase), migrations em `prisma/migrations`.
- **PostgreSQL (Supabase)**: banco relacional para usuários, sessões e (futuro) entidades de eventos/inscrições.
- **bcrypt**: hash de senhas e geração de tokens de sessão derivados de segredo + credenciais.
- **Cookies HTTP-only**: sessão segura via `auth-session` com expiração e invalidação no banco.

## Estrutura do Projeto (resumo)
```
src/
├── app/
│   ├── api/
│   ├── cadastro/
│   ├── dashboard/
│   └── login/
├── components/
│   ├── register/
│   └── ui/
├── lib/
└── middleware.ts
prisma/
└── schema.prisma
```

## Configuração e Execução

### Requisitos
- Node.js 20+
- Yarn
- Banco PostgreSQL (Supabase recomendado)

### Variáveis de Ambiente
- Crie um arquivo `.env` com as credenciais sensíveis (não vai para o Git).
- Se quiser compartilhar variáveis seguras para desenvolvimento, use `.env.local` (este pode ir para o Git).

Exemplo mínimo do `.env`:
```env
# Banco de Dados
POSTGRES_URL="sua_url_do_supabase"
POSTGRES_URL_NON_POOLING="sua_url_direta_do_supabase"

# JWT/Segredo usado na geração de sessão
SUPABASE_JWT_SECRET="seu_secret_jwt"
```

### Instalação
```bash
yarn install
yarn prisma migrate dev
yarn prisma generate
yarn dev
```

### Scripts úteis
```bash
yarn build
yarn lint
yarn prisma studio
yarn prisma db push
```

## Fluxo de Autenticação (exemplos reais do código)

### Login API — cria sessão, define cookie
```1:35:src/app/api/login/route.ts
export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth-session");

    const sessionToken = authCookie?.value || "";

    if (!sessionToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
```

```81:132:src/app/api/login/route.ts
// Verifica a senha
const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
  return NextResponse.json<LoginResponse>(
    { error: "Credenciais inválidas" }, 
    { status: 401 }
  );
}

// Gera token de sessão
const sessionToken = GenerateSession({
  email,
  passwordHash: user.password,
});

// Cria a sessão no banco
await prisma.sessions.create({
  data: {
    userId: user.id,
    token: sessionToken,
    valid: true,
    expiresAt: addHours(new Date(), 24),
  },
});

// Define o cookie
const response = NextResponse.json({ session: sessionToken, role: user.role }, { status: 200 });
response.cookies.set({ name: "auth-session", value: sessionToken, httpOnly: true, expires: addHours(new Date(), 24), path: "/", secure: process.env.NODE_ENV === "production", sameSite: "lax" });
return response;
```

### Geração do token de sessão
```13:23:src/lib/generate-session.ts
export function GenerateSession({
  email,
  passwordHash,
}: GenerateSessionDTO): string {
  const secret = process.env.SUPABASE_JWT_SECRET || "default-secret-key";
  const plainToken = `${secret}+${email}+${passwordHash}+${new Date().getTime()}`;
  const hash = bcrypt.hashSync(plainToken, 12);
  return hash;
}
```

### Logout API — invalida sessão e remove cookie
```18:36:src/app/api/auth/logout/route.ts
if (authSession?.value) {
  await prisma.sessions.updateMany({
    where: { token: authSession.value },
    data: { valid: false }
  });
}
const response = NextResponse.json({ success: true });
response.cookies.delete("auth-session");
return response;
```

### Middleware — headers de segurança e cache em APIs
```4:13:src/middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
```

## Fluxo de Cadastro (frontend + backend)

### Formulário multi-etapas (cliente)
```270:289:src/components/register/index.tsx
<Card className="animate-in fade-in duration-500">
  <CardHeader className="text-center">
    <CardTitle className="text-2xl text-blue-600">
      {currentStep === 1 ? "Dados Pessoais" : 
       currentStep === 2 ? "Ficha de Saúde" : "Termos e Condições"}
    </CardTitle>
    <CardDescription>
      {currentStep === 1 
        ? "Preencha suas informações pessoais básicas" 
        : currentStep === 2
        ? "Informações sobre sua saúde"
        : "Leia e aceite os termos para continuar"}
    </CardDescription>
  </CardHeader>
  <CardContent>
    {renderStepContent()}
  </CardContent>
</Card>
```

### API de registro (servidor)
```84:109:src/app/api/register/route.ts
if (!email || !password || !password2) {
  return NextResponse.json(
    { error: "Email e senha são obrigatórios" },
    { status: 400 }
  );
}
if (password.length < 6) {
  return NextResponse.json(
    { error: "A senha deve ter pelo menos 6 caracteres" },
    { status: 400 }
  );
}
if (password !== password2) {
  return NextResponse.json(
    { error: "As senhas não coincidem" },
    { status: 400 }
  );
}
const hash = await bcrypt.hash(password, 10);
```

```168:176:src/app/api/register/route.ts
const user = await Promise.race([
  prisma.user.create({ data: userData }),
  timeoutPromise
]) as User;
```

## Endpoints (atual)
- **POST** `/api/register`
- **POST** `/api/login`
- **GET** `/api/login` (verificar autenticação)
- **POST** `/api/auth/logout` e **GET** `/api/auth/logout`
- **GET** `/api/me`, `/api/users`, `/api/email` (boas-vindas), `/api/validate-registration`, `/api/test-cpf`, `/api/debug-cpf`, etc.

## Roadmap — Próximas Melhorias
- [ ] Página de lista de eventos e detalhes do evento
- [ ] Inscrição com regras (limite de vagas, período, campos extras)
- [ ] Emissão de QR Code por inscrição e validação no check-in
- [ ] Validação de geolocalização no check-in (raio configurável e antifraude)
- [ ] Dashboard do Admin: inscritos, presentes, faltas e engajamento
- [ ] Relatórios (CSV/PDF): frequência, tempo sem participação, perfil por cidade
- [ ] Perfis e papéis (USER, ADMIN, CONSELHO) com autorização por rota
- [ ] Recuperação de senha e verificação de e-mail
- [ ] Rate limiting nas APIs públicas e logs de auditoria
- [ ] Testes E2E e de integração (Playwright/Vitest)

## Visão de Produto
O Mais Eventos será um sistema completo de gestão de eventos comunitários/institucionais. Cidadãos se cadastram, encontram eventos, inscrevem-se e confirmam presença no local via QR Code + geolocalização. O conselho/admin acompanha engajamento, identifica quem não participa há muito tempo e emite relatórios para tomada de decisão.

## Boas Práticas e Segurança
- Hash de senhas com bcrypt; cookies HTTP-only com SameSite e Secure em produção.
- Sessões persistidas com expiração e invalidação ativa no logout.
- Headers de segurança em APIs via middleware.
- Variáveis sensíveis em `.env` (ignorado). Use `.env.local` para valores que podem ser versionados.

## Créditos
Projeto desenvolvido com apoio e ideias de **Raul Sigoli** e do **Projeto Mais Vida**.
