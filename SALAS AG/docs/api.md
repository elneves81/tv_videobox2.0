# API Documentation - Sistema de Agendamento de Salas

## Base URL
```
http://localhost:8080/api
```

## Autenticação
A API utiliza autenticação baseada em token Bearer. Após o login, inclua o token no header:
```
Authorization: Bearer <token>
```

---

## 🔐 Endpoints de Autenticação

### POST /auth/login
**Descrição**: Autenticar usuário e obter token

**Request Body**:
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response 200**:
```json
{
  "token": "abc123-def456-ghi789",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@empresa.com",
    "tipo": "admin"
  }
}
```

### POST /auth/logout
**Descrição**: Realizar logout e invalidar token

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
{
  "message": "Logout realizado com sucesso"
}
```

### POST /auth/register
**Descrição**: Registrar novo usuário

**Request Body**:
```json
{
  "nome": "João Silva",
  "email": "joao@empresa.com",
  "password": "senha123"
}
```

**Response 201**:
```json
{
  "message": "Usuário criado com sucesso"
}
```

### GET /auth/profile
**Descrição**: Obter perfil do usuário logado

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@empresa.com",
  "telefone": "(11) 99999-9999",
  "departamento": "TI",
  "tipo_usuario": "admin",
  "ativo": true,
  "data_criacao": "2025-01-01 10:00:00",
  "data_atualizacao": "2025-01-01 10:00:00"
}
```

---

## 👥 Endpoints de Usuários

### GET /usuarios
**Descrição**: Listar usuários (apenas admins)

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@empresa.com",
      "telefone": "(11) 99999-9999",
      "departamento": "TI",
      "tipo_usuario": "admin",
      "ativo": true,
      "data_criacao": "2025-01-01 10:00:00",
      "data_atualizacao": "2025-01-01 10:00:00"
    }
  ],
  "total": 1
}
```

### GET /usuarios/{id}
**Descrição**: Obter usuário por ID

**Headers**: `Authorization: Bearer <token>`

**Response 200**: Objeto usuário

### POST /usuarios
**Descrição**: Criar novo usuário (apenas admins)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "nome": "Maria Santos",
  "email": "maria@empresa.com",
  "telefone": "(11) 88888-8888",
  "departamento": "RH",
  "tipo_usuario": "comum"
}
```

**Response 201**:
```json
{
  "message": "Usuário criado com sucesso",
  "id": 2
}
```

### PUT /usuarios/{id}
**Descrição**: Atualizar usuário

**Headers**: `Authorization: Bearer <token>`

**Request Body**: Objeto usuário

**Response 200**:
```json
{
  "message": "Usuário atualizado com sucesso"
}
```

### DELETE /usuarios/{id}
**Descrição**: Excluir usuário (apenas admins)

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
{
  "message": "Usuário excluído com sucesso"
}
```

---

## 🏢 Endpoints de Salas

### GET /salas
**Descrição**: Listar salas

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
{
  "salas": [
    {
      "id": 1,
      "nome": "Sala de Reunião A",
      "descricao": "Sala principal para reuniões executivas",
      "capacidade": 12,
      "localizacao": "Térreo - Ala Norte",
      "recursos": {
        "projetor": true,
        "tv": true,
        "quadro": true,
        "ac": true
      },
      "ativa": true,
      "data_criacao": "2025-01-01 10:00:00",
      "data_atualizacao": "2025-01-01 10:00:00"
    }
  ],
  "total": 1
}
```

### GET /salas/{id}
**Descrição**: Obter sala por ID

**Headers**: `Authorization: Bearer <token>`

**Response 200**: Objeto sala

### POST /salas
**Descrição**: Criar nova sala (apenas admins)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "nome": "Sala de Reunião B",
  "descricao": "Sala média para reuniões de equipe",
  "capacidade": 8,
  "localizacao": "Primeiro Andar - Ala Sul",
  "recursos": {
    "projetor": true,
    "tv": false,
    "quadro": true,
    "ac": true
  }
}
```

**Response 201**:
```json
{
  "message": "Sala criada com sucesso",
  "id": 2
}
```

### PUT /salas/{id}
**Descrição**: Atualizar sala (apenas admins)

**Headers**: `Authorization: Bearer <token>`

**Request Body**: Objeto sala

**Response 200**:
```json
{
  "message": "Sala atualizada com sucesso"
}
```

### DELETE /salas/{id}
**Descrição**: Excluir sala (apenas admins)

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
{
  "message": "Sala excluída com sucesso"
}
```

---

## 📅 Endpoints de Agendamentos

### GET /agendamentos
**Descrição**: Listar agendamentos

**Headers**: `Authorization: Bearer <token>`

**Observação**: Admins veem todos os agendamentos, usuários comuns apenas os seus

**Response 200**:
```json
{
  "agendamentos": [
    {
      "id": 1,
      "sala_id": 1,
      "usuario_id": 1,
      "titulo": "Reunião Semanal",
      "descricao": "Reunião de alinhamento da equipe",
      "data_inicio": "2025-01-15 14:00:00",
      "data_fim": "2025-01-15 15:30:00",
      "status": "agendado",
      "observacoes": "Trazer relatórios",
      "data_criacao": "2025-01-01 10:00:00",
      "data_atualizacao": "2025-01-01 10:00:00",
      "sala_nome": "Sala de Reunião A",
      "usuario_nome": "João Silva"
    }
  ],
  "total": 1
}
```

### GET /agendamentos/{id}
**Descrição**: Obter agendamento por ID

**Headers**: `Authorization: Bearer <token>`

**Response 200**: Objeto agendamento

### POST /agendamentos
**Descrição**: Criar novo agendamento

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "sala_id": 1,
  "titulo": "Reunião Mensal",
  "descricao": "Revisão mensal dos projetos",
  "data_inicio": "2025-01-20 09:00:00",
  "data_fim": "2025-01-20 11:00:00",
  "observacoes": "Preparar apresentação"
}
```

**Response 201**:
```json
{
  "message": "Agendamento criado com sucesso",
  "id": 2
}
```

**Response 409** (Conflito):
```json
{
  "error": "Conflito de horário. Sala já está reservada para este período"
}
```

### PUT /agendamentos/{id}
**Descrição**: Atualizar agendamento

**Headers**: `Authorization: Bearer <token>`

**Request Body**: Objeto agendamento

**Response 200**:
```json
{
  "message": "Agendamento atualizado com sucesso"
}
```

### DELETE /agendamentos/{id}
**Descrição**: Cancelar agendamento

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
{
  "message": "Agendamento cancelado com sucesso"
}
```

### POST /agendamentos/check-conflict
**Descrição**: Verificar conflitos de agendamento

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "sala_id": 1,
  "data_inicio": "2025-01-20 09:00:00",
  "data_fim": "2025-01-20 11:00:00",
  "agendamento_id": 5  // Opcional: para verificar ao atualizar
}
```

**Response 200**:
```json
{
  "conflito": false,
  "total_conflitos": 0
}
```

---

## 📋 Códigos de Status HTTP

- **200 OK**: Sucesso
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Token inválido ou não fornecido
- **403 Forbidden**: Sem permissão para acessar o recurso
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito (ex: horário já ocupado)
- **500 Internal Server Error**: Erro interno do servidor

---

## 🔒 Permissões

### Usuário Comum
- ✅ Ver próprio perfil
- ✅ Atualizar próprio perfil
- ✅ Ver lista de salas
- ✅ Ver detalhes de salas
- ✅ Criar agendamentos
- ✅ Ver próprios agendamentos
- ✅ Atualizar próprios agendamentos
- ✅ Cancelar próprios agendamentos
- ✅ Verificar conflitos de agendamento

### Administrador
- ✅ Todas as permissões de usuário comum
- ✅ Ver todos os usuários
- ✅ Criar/atualizar/excluir usuários
- ✅ Criar/atualizar/excluir salas
- ✅ Ver todos os agendamentos
- ✅ Gerenciar qualquer agendamento

---

## 🧪 Exemplos de Uso

### 1. Login e Criação de Agendamento
```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@salasag.com","password":"123456"}'

# Response: {"token":"abc123...", "usuario":{...}}

# 2. Criar agendamento
curl -X POST http://localhost:8080/api/agendamentos \
  -H "Authorization: Bearer abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "sala_id": 1,
    "titulo": "Reunião Importante",
    "data_inicio": "2025-01-25 14:00:00",
    "data_fim": "2025-01-25 15:30:00"
  }'
```

### 2. Verificar Conflitos Antes de Agendar
```bash
curl -X POST http://localhost:8080/api/agendamentos/check-conflict \
  -H "Authorization: Bearer abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "sala_id": 1,
    "data_inicio": "2025-01-25 14:00:00",
    "data_fim": "2025-01-25 15:30:00"
  }'
```

---

## 🚀 Para Testar

1. **Compile o servidor**:
   ```bash
   cd backend
   make deps    # Instalar dependências
   make build   # Compilar
   ```

2. **Configure o banco**:
   ```bash
   make db-setup
   ```

3. **Execute o servidor**:
   ```bash
   make run
   ```

4. **Teste os endpoints**:
   Use Postman, curl ou qualquer cliente HTTP para testar as APIs acima.
