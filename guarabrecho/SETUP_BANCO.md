# 🗄️ Configuração do Banco de Dados PostgreSQL

## Opção 1: Docker (Recomendado - Mais Fácil)

### 1. Instalar Docker Desktop
1. Baixe o Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Instale e reinicie o computador
3. Abra o Docker Desktop e aguarde inicializar

### 2. Iniciar o Banco
```bash
# Navegar para o projeto
cd c:\Users\Elber\Documents\GitHub\guarabrecho

# Iniciar PostgreSQL via Docker
docker-compose up -d postgres

# Aguardar o banco ficar pronto (cerca de 30 segundos)
```

### 3. Aplicar Schema do Banco
```bash
# Aplicar schema do Prisma
npx prisma db push

# Popular categorias iniciais
npm run db:seed
```

### 4. Interface de Administração (Opcional)
```bash
# Iniciar PgAdmin (interface web)
docker-compose up -d pgadmin

# Acessar: http://localhost:5050
# Email: admin@guarabrecho.com
# Senha: admin123
```

---

## Opção 2: PostgreSQL Local (Instalação Manual)

### 1. Download e Instalação
1. Baixe o PostgreSQL: https://www.postgresql.org/download/windows/
2. Execute o instalador como administrador
3. Durante a instalação:
   - Porta: 5432 (padrão)
   - Usuário: postgres
   - Senha: escolha uma senha forte
   - Locale: Portuguese, Brazil

### 2. Criar Banco e Usuário
```sql
-- Conectar como postgres via pgAdmin ou psql
CREATE DATABASE guarabrecho;
CREATE USER guarabrecho_user WITH ENCRYPTED PASSWORD 'guarabrecho_pass';
GRANT ALL PRIVILEGES ON DATABASE guarabrecho TO guarabrecho_user;
```

### 3. Atualizar .env.local
```env
DATABASE_URL="postgresql://guarabrecho_user:guarabrecho_pass@localhost:5432/guarabrecho?schema=public"
```

---

## Opção 3: Banco Online (Mais Simples para Teste)

### 1. Neon.tech (Grátis)
1. Acesse: https://neon.tech/
2. Crie uma conta gratuita
3. Crie um novo projeto "GuaraBrechó"
4. Copie a connection string

### 2. Supabase (Grátis)
1. Acesse: https://supabase.com/
2. Crie uma conta gratuita
3. Crie um novo projeto "GuaraBrechó"
4. Vá em Settings > Database
5. Copie a connection string

### 3. Atualizar .env.local
```env
DATABASE_URL="sua_connection_string_aqui"
```

---

## 🔧 Scripts Úteis (package.json)

```bash
# Aplicar schema
npm run db:push

# Popular dados iniciais
npm run db:seed

# Abrir interface visual do banco
npm run db:studio

# Ver estrutura do banco
npx prisma db pull
```

## 🎯 Próximos Passos

1. Escolha uma das opções acima
2. Configure o banco
3. Execute: `npm run db:push`
4. Execute: `npm run db:seed`
5. Teste a conexão: `npm run db:studio`

## 📊 Dados de Teste

Após configurar, o banco terá:
- ✅ Tabelas criadas automaticamente (users, products, categories)
- ✅ 10 categorias populadas
- ✅ Pronto para receber usuários e produtos
