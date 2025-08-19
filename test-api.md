# Teste da API de Eventos

## Problema Identificado
O erro "Erro interno do servidor" na criação de eventos pode ser causado por:

1. **Cliente Prisma não regenerado** após mudanças no schema
2. **Tabelas não criadas** no banco de dados
3. **Problemas de conexão** com o banco

## Soluções Implementadas

### 1. API com SQL Direto
Modifiquei a API para usar SQL direto (`$queryRaw` e `$executeRaw`) para contornar problemas do cliente Prisma.

### 2. Logs Detalhados
Adicionei logs detalhados para identificar exatamente onde o erro ocorre.

### 3. Tratamento de Erros Melhorado
A API agora retorna detalhes específicos do erro.

## Como Testar

### 1. Verificar Logs do Servidor
```bash
# Inicie o servidor
npm run dev

# Tente criar um evento e observe os logs no terminal
```

### 2. Verificar Banco de Dados
```sql
-- Verifique se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('events', 'event_registrations');

-- Verifique a estrutura da tabela events
\d events
```

### 3. Testar API Diretamente
```bash
# Teste a API de listagem (deve funcionar)
curl http://localhost:3000/api/events

# Teste a criação de evento (pode falhar)
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-session=SEU_TOKEN_AQUI" \
  -d '{
    "name": "Teste",
    "location": "Local Teste",
    "date": "2024-12-25",
    "startTime": "10:00",
    "endTime": "12:00",
    "description": "Descrição teste"
  }'
```

## Possíveis Causas e Soluções

### Causa 1: Tabelas não criadas
**Sintoma**: Erro "relation 'events' does not exist"
**Solução**: Executar migração do Prisma
```bash
npx prisma migrate dev --name add_events
```

### Causa 2: Cliente Prisma desatualizado
**Sintoma**: Erro "Property 'event' does not exist on type 'PrismaClient'"
**Solução**: Regenerar cliente Prisma
```bash
npx prisma generate
```

### Causa 3: Problemas de conexão
**Sintoma**: Erro de timeout ou conexão recusada
**Solução**: Verificar variáveis de ambiente
```bash
# Verifique se estas variáveis estão definidas
echo $POSTGRES_URL
echo $POSTGRES_URL_NON_POOLING
```

## Estrutura Esperada das Tabelas

### Tabela `events`
```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT NOT NULL REFERENCES users(id)
);
```

### Tabela `event_registrations`
```sql
CREATE TABLE event_registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
```

## Próximos Passos

1. **Execute o servidor** e observe os logs
2. **Tente criar um evento** e veja qual erro específico aparece
3. **Verifique o banco de dados** para confirmar se as tabelas existem
4. **Execute a migração** se necessário

## Logs Esperados

Quando funcionando, você deve ver:
```
Buscando eventos...
Eventos encontrados: 0
Iniciando criação de evento...
Verificando sessão...
Usuário autenticado: email@exemplo.com com role: ADMIN
Dados recebidos: { name: "Teste", location: "Local", ... }
Criando evento no banco...
Evento criado com sucesso
```

Se houver erro, você verá detalhes específicos que ajudarão a identificar o problema.
