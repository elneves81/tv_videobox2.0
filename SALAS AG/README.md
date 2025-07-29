# Sistema de Agendamento de Salas (SALAS AG)

Sistema completo e profissional para agendamento e gerenciamento de salas de reunião com backend robusto em C e frontend moderno em Angular.

## 🏗️ Arquitetura

```
SALAS AG/
├── backend/          # API REST em C (microhttpd + MySQL)
│   ├── src/         # Código fonte
│   ├── include/     # Headers
│   ├── lib/         # Bibliotecas
│   └── config/      # Configurações
├── frontend/        # Aplicação Angular 17+
├── database/        # Scripts SQL e schema
└── docs/           # Documentação completa
```

## 🚀 Tecnologias

### Backend
- **Linguagem**: C (ISO C99)
- **Servidor HTTP**: libmicrohttpd
- **Banco de Dados**: MySQL 8.0+ com MySQL Connector/C
- **JSON**: json-c library
- **Arquitetura**: REST API com autenticação por token

### Frontend
- **Framework**: Angular 17+ (com SSR)
- **UI Library**: Angular Material
- **Linguagem**: TypeScript
- **Build**: Angular CLI + Webpack

### Banco de Dados
- **SGBD**: MySQL 8.0
- **Charset**: UTF-8 (utf8mb4)
- **Features**: Triggers, Stored Procedures, Views, Índices otimizados

## 📋 Funcionalidades Completas

### 🔐 Sistema de Autenticação
- ✅ Login/logout seguro com tokens
- ✅ Cadastro de novos usuários
- ✅ Gerenciamento de sessões
- ✅ Perfis de usuário (admin/comum)
- ✅ Validação de permissões por endpoint

### 👥 Gerenciamento de Usuários
- [x] Cadastro e autenticação
- [x] Perfis de usuário (admin/comum)
- [x] Gerenciamento de sessões

### Gerenciamento de Salas
- [x] CRUD de salas
- [x] Configuração de capacidade e recursos
- [x] Status de disponibilidade

### Sistema de Agendamentos
- [x] Criar, editar e cancelar agendamentos
- [x] Validação de conflitos
- [x] Notificações por email
- [x] Calendário visual

### Relatórios
- [x] Utilização de salas
- [x] Histórico de agendamentos
- [x] Estatísticas de uso

## 🛠️ Instalação e Configuração

### Pré-requisitos
- GCC ou Clang
- MySQL 8.0+
- Node.js 18+
- Angular CLI

### Windows (Recomendado)
```batch
# Execute o script principal
iniciar.bat

# Ou execute individualmente:
cd backend
build.bat          # Compila o backend
run.bat            # Executa o servidor

cd frontend
setup.bat          # Configura dependências
run-frontend.bat   # Executa em modo desenvolvimento
```

### Linux/Mac
```bash
cd backend
make install-deps  # Instala dependências
make build         # Compila o projeto
make run           # Executa o servidor

cd frontend
npm install        # Instala dependências
ng serve          # Executa em modo desenvolvimento
```

### Banco de Dados
```bash
mysql -u root -p < database/schema.sql
```

## 📖 Documentação

- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Frontend Components](docs/frontend.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ELN-SOLUÇOES
