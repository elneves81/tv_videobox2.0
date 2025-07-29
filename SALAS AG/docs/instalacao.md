# 🚀 Guia de Instalação - Sistema SALAS AG

Este guia irá te ajudar a configurar completamente o sistema de agendamento de salas.

## 📋 Pré-requisitos

### Sistema Operacional
- ✅ Windows 10/11
- ✅ Linux (Ubuntu 20.04+)
- ✅ macOS 10.15+

### Software Necessário

#### 1. **MySQL 8.0+**
- **Windows**: [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- **Linux**: `sudo apt install mysql-server`
- **macOS**: `brew install mysql`

#### 2. **Node.js 18+**
- [Download Node.js](https://nodejs.org/)
- Verificar: `node --version`

#### 3. **Angular CLI**
```bash
npm install -g @angular/cli
```

#### 4. **Compilador C (para backend)**
- **Windows**: [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) ou [MSYS2](https://www.msys2.org/)
- **Linux**: `sudo apt install build-essential`
- **macOS**: `xcode-select --install`

#### 5. **Bibliotecas C (para backend)**
- **Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install libmicrohttpd-dev libmysqlclient-dev libjson-c-dev
```

- **CentOS/RHEL/Fedora**:
```bash
sudo yum install libmicrohttpd-devel mysql-devel json-c-devel
```

- **macOS**:
```bash
brew install libmicrohttpd mysql-client json-c
```

---

## 🎯 Instalação Passo a Passo

### Passo 1: Clonar o Repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd "SALAS AG"
```

### Passo 2: Configurar o Banco de Dados

#### 2.1. Iniciar MySQL
```bash
# Linux/macOS
sudo systemctl start mysql

# Windows (se instalado como serviço)
net start mysql
```

#### 2.2. Criar Banco e Usuário
```bash
mysql -u root -p
```

```sql
-- Criar banco de dados
CREATE DATABASE salas_ag CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário (opcional, para maior segurança)
CREATE USER 'salas_ag'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON salas_ag.* TO 'salas_ag'@'localhost';
FLUSH PRIVILEGES;

-- Sair
EXIT;
```

#### 2.3. Importar Schema
```bash
mysql -u root -p salas_ag < database/schema.sql
```

### Passo 3: Configurar Backend (C)

#### 3.1. Instalar Dependências
```bash
cd backend
make deps    # Para Ubuntu/Debian
# OU
make deps-rpm    # Para CentOS/RHEL/Fedora
# OU
make deps-mac    # Para macOS
```

#### 3.2. Configurar Conexão com Banco
Edite o arquivo `config/database.conf`:
```ini
[database]
host = localhost
port = 3306
user = root
password = SUA_SENHA_MYSQL
database = salas_ag
```

#### 3.3. Compilar
```bash
make build
```

#### 3.4. Testar Backend
```bash
make run
```

O servidor deve iniciar em `http://localhost:8080`

### Passo 4: Configurar Frontend (Angular)

#### 4.1. Instalar Dependências
```bash
cd ../frontend
npm install
```

#### 4.2. Configurar API URL
Edite `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

#### 4.3. Executar Frontend
```bash
ng serve
```

O frontend estará disponível em `http://localhost:4200`

---

## 🔧 Configuração Avançada

### SSL/HTTPS (Produção)

#### Backend
1. Obtenha certificados SSL (Let's Encrypt recomendado)
2. Configure no arquivo `config/ssl.conf`
3. Recompile com flag SSL: `make build-ssl`

#### Frontend
```bash
ng serve --ssl --ssl-cert path/to/cert.pem --ssl-key path/to/key.pem
```

### Docker (Opcional)

#### Dockerfile para Backend
```dockerfile
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    build-essential \
    libmicrohttpd-dev \
    libmysqlclient-dev \
    libjson-c-dev

WORKDIR /app
COPY backend/ .
RUN make build

EXPOSE 8080
CMD ["./bin/salas_ag_server"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: salas_ag
      MYSQL_ROOT_PASSWORD: senha123
    ports:
      - "3306:3306"
    volumes:
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
  
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
  
  frontend:
    image: node:18
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "4200:4200"
    command: sh -c "npm install && ng serve --host 0.0.0.0"
```

---

## 🧪 Testes

### 1. Testar Backend
```bash
cd backend
make test

# Ou manualmente
curl http://localhost:8080/api
```

### 2. Testar Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@salasag.com","password":"123456"}'
```

### 3. Testar Frontend
```bash
cd frontend
npm test
ng e2e  # Testes end-to-end
```

---

## 🚨 Solução de Problemas

### Erro: "Cannot connect to MySQL"
**Solução**:
1. Verificar se MySQL está rodando
2. Verificar credenciais no `config/database.conf`
3. Verificar firewall (porta 3306)

### Erro: "libmicrohttpd not found"
**Solução**:
```bash
# Ubuntu/Debian
sudo apt install libmicrohttpd-dev

# CentOS/RHEL
sudo yum install libmicrohttpd-devel

# macOS
brew install libmicrohttpd
```

### Erro: "Permission denied" no compile
**Solução**:
```bash
sudo chmod +x backend/bin/salas_ag_server
```

### Frontend não conecta com Backend
**Solução**:
1. Verificar se backend está rodando na porta 8080
2. Verificar CORS no backend
3. Verificar URL da API no `environment.ts`

### Erro: "Port already in use"
**Solução**:
```bash
# Encontrar processo usando a porta
sudo lsof -i :8080
# Ou no Windows
netstat -ano | findstr :8080

# Matar processo
kill -9 <PID>
```

---

## 📚 Comandos Úteis

### Backend
```bash
# Compilar em modo debug
make build

# Compilar para produção
make release

# Limpar compilação
make clean

# Ver logs
tail -f server.log

# Parar servidor em background
make stop
```

### Frontend
```bash
# Desenvolvimento
ng serve

# Build para produção
ng build --prod

# Testes
ng test
ng e2e

# Lint/Formatação
ng lint
```

### Banco de Dados
```bash
# Backup
mysqldump -u root -p salas_ag > backup.sql

# Restore
mysql -u root -p salas_ag < backup.sql

# Ver logs MySQL
sudo tail -f /var/log/mysql/error.log
```

---

## 🎉 Primeira Utilização

### 1. Acesse o Sistema
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8080/api`

### 2. Login Inicial
- **Email**: `admin@salasag.com`
- **Senha**: `123456`

### 3. Primeiro Uso
1. Faça login como admin
2. Crie usuários no sistema
3. Configure as salas disponíveis
4. Comece a fazer agendamentos!

### 4. Alterar Senha do Admin
1. Vá em "Perfil"
2. Altere a senha padrão
3. Configure dados pessoais

---

## 📞 Suporte

Se você encontrou algum problema:

1. ✅ Verifique este guia primeiro
2. ✅ Consulte os logs de erro
3. ✅ Verifique a documentação da API (`docs/api.md`)
4. ✅ Abra uma issue no repositório

---

## 🔐 Segurança em Produção

### Checklist de Segurança
- [ ] Alterar senha padrão do admin
- [ ] Configurar SSL/HTTPS
- [ ] Alterar credenciais do banco
- [ ] Configurar firewall
- [ ] Backups automáticos
- [ ] Logs de auditoria
- [ ] Rate limiting na API
- [ ] Validação de input rigorosa

### Configuração Recomendada para Produção
```bash
# 1. Criar usuário específico para a aplicação
sudo useradd -r -s /bin/false salas-ag

# 2. Configurar permissões
sudo chown -R salas-ag:salas-ag /opt/salas-ag

# 3. Configurar serviço systemd
sudo cp scripts/salas-ag.service /etc/systemd/system/
sudo systemctl enable salas-ag
sudo systemctl start salas-ag

# 4. Configurar nginx como proxy reverso
sudo cp scripts/nginx.conf /etc/nginx/sites-available/salas-ag
sudo ln -s /etc/nginx/sites-available/salas-ag /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

---

✅ **Sistema pronto para uso!** 🎉
