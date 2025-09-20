# Configuração do Supabase para Upload de Arquivos

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="sua_url_do_supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_chave_anonima_do_supabase"
```

## Configuração do Bucket no Supabase

1. Acesse o painel do Supabase
2. Vá para Storage
3. Crie um bucket chamado `projetomaisvida`
4. Configure as políticas de acesso:

### Política para Upload (INSERT)
```sql
CREATE POLICY "Permitir upload de arquivos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'projetomaisvida');
```

### Política para Leitura (SELECT)
```sql
CREATE POLICY "Permitir leitura de arquivos" ON storage.objects
FOR SELECT USING (bucket_id = 'projetomaisvida');
```

## Estrutura de Pastas

Os arquivos serão organizados da seguinte forma:
```
projetomaisvida/
├── acampa/
│   └── {eventId}/
│       └── {filename}
```

## Funcionalidades Implementadas

- ✅ Upload de arquivos (imagens e PDFs)
- ✅ Validação de tipo de arquivo
- ✅ Validação de tamanho (máximo 10MB)
- ✅ Geração automática de nomes únicos
- ✅ Salvamento da URL no banco de dados
- ✅ Integração com o sistema de inscrições