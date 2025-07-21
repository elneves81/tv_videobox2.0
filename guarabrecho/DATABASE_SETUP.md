# 🗄️ Configuração do Banco de Dados PostgreSQL - GuaraBrechó

## 📋 Pré-requisitos

1. **PostgreSQL instalado** no seu sistema
   - Download: https://www.postgresql.org/download/
   - Ou via Docker: `docker run --name postgres-guarabrecho -e POSTGRES_PASSWORD=suasenha -p 5432:5432 -d postgres`

## 🔧 Passos para Configuração

### 1. Configurar Variáveis de Ambiente

Edite o arquivo `.env.local` e atualize a `DATABASE_URL` com seus dados:

```bash
DATABASE_URL="postgresql://usuario:senha@localhost:5432/guarabrecho?schema=public"
```

**Formato da URL:**
- `usuario`: Seu usuário do PostgreSQL (padrão: `postgres`)
- `senha`: Sua senha do PostgreSQL
- `localhost:5432`: Host e porta (padrão PostgreSQL)
- `guarabrecho`: Nome do banco de dados

### 2. Criar Banco de Dados

```sql
-- Conecte no PostgreSQL e execute:
CREATE DATABASE guarabrecho;
```

### 3. Aplicar Schema do Prisma

```bash
# Aplica o schema ao banco (cria tabelas)
npm run db:push

# OU criar migração (recomendado para produção)
npm run db:migrate
```

### 4. Popular Dados Iniciais

```bash
# Executa o seed com categorias iniciais
npm run db:seed
```

### 5. Verificar Banco (Opcional)

```bash
# Abre o Prisma Studio para visualizar dados
npm run db:studio
```

## 🏗️ Estrutura do Banco

### Tabelas Criadas:
- **users** - Usuários do sistema
- **products** - Produtos anunciados
- **categories** - Categorias dos produtos
- **accounts** - Contas OAuth (NextAuth)
- **sessions** - Sessões de usuário
- **verification_tokens** - Tokens de verificação

### Categorias Iniciais:
- Roupas e Acessórios
- Eletrônicos
- Móveis e Decoração
- Livros e Educação
- Esportes e Lazer
- Beleza e Saúde
- Casa e Jardim
- Automóveis e Peças
- Instrumentos Musicais
- Outros

## 🚀 Comandos Úteis

```bash
# Gerar cliente Prisma após mudanças no schema
npm run db:generate

# Visualizar banco de dados
npm run db:studio

# Reset completo do banco (CUIDADO!)
npx prisma migrate reset

# Verificar status das migrações
npx prisma migrate status
```

## 🔒 Segurança

- ✅ Senhas criptografadas com bcryptjs
- ✅ Sessões JWT seguras
- ✅ Validação de dados nas APIs
- ✅ Relacionamentos com CASCADE

## 📱 Próximos Passos

Após configurar o banco:
1. Testar APIs com Postman/Insomnia
2. Implementar páginas de autenticação
3. Criar formulários de produtos
4. Integrar WhatsApp
5. Implementar upload de imagens

---

**Precisa de ajuda?** Verifique os logs de erro e confirme se:
- PostgreSQL está rodando
- Credenciais estão corretas no .env.local
- Banco de dados 'guarabrecho' existe
