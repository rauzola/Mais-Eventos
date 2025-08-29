# Deploy Otimizado para Vercel

## Passos para Deploy

### 1. Configuração das Variáveis de Ambiente

No painel da Vercel, configure:

```bash
POSTGRES_URL=postgresql://username:password@host:port/database
POSTGRES_URL_NON_POOLING=postgresql://username:password@host:port/database?connect_timeout=10&pool_timeout=10
NODE_ENV=production
```

### 2. Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy para produção
vercel --prod

# Verificar status
vercel ls
```

### 3. Verificações Pós-Deploy

1. **Teste a rota de health check**: `/api/health`
2. **Verifique os logs**: `vercel logs`
3. **Teste o cadastro**: Use a rota `/api/register`
4. **Monitore métricas**: Dashboard da Vercel

### 4. Otimizações Implementadas

✅ **Prisma otimizado** para serverless
✅ **Pool de conexões** configurado
✅ **Timeout aumentado** para 30 segundos
✅ **Cleanup automático** de conexões
✅ **Health check** implementado
✅ **Middleware** de performance
✅ **Configurações Next.js** otimizadas

### 5. Troubleshooting

Se ainda houver erro 504:

1. **Verifique a região** do banco vs Vercel
2. **Teste a conectividade** do banco
3. **Aumente timeouts** do banco se necessário
4. **Use banco gerenciado** (Neon, Supabase)
5. **Considere plano Pro** da Vercel

### 6. Monitoramento Contínuo

- Configure alertas para erros 504
- Monitore tempo de resposta das APIs
- Verifique saúde das conexões do banco
- Use ferramentas como Sentry
