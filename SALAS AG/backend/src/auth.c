#include "../include/server.h"
#include "../include/database.h"
#include <time.h>
#include <ctype.h>

// Função para gerar UUID simples (sem dependência externa)
char* generate_session_id(void) {
    char *session_id = malloc(37);
    srand(time(NULL));
    
    snprintf(session_id, 37, "%08x-%04x-%04x-%04x-%012x",
             rand(), rand() & 0xFFFF, rand() & 0xFFFF,
             rand() & 0xFFFF, rand());
    
    return session_id;
}

// Funções de autenticação
response_t* api_auth_login(request_data_t *req) {
    if (strcmp(req->method, "POST") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Parse JSON do body
    json_object *json = json_tokener_parse(req->data);
    if (!json) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"JSON inválido\"}");
    }
    
    json_object *email_obj, *password_obj;
    if (!json_object_object_get_ex(json, "email", &email_obj) ||
        !json_object_object_get_ex(json, "password", &password_obj)) {
        json_object_put(json);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Email e senha são obrigatórios\"}");
    }
    
    const char *email = json_object_get_string(email_obj);
    const char *password = json_object_get_string(password_obj);
    
    // Conectar ao banco
    MYSQL *conn = db_connect();
    if (!conn) {
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    // Buscar usuário por email
    char query[512];
    snprintf(query, sizeof(query),
        "SELECT id, nome, email, senha_hash, tipo_usuario, ativo "
        "FROM usuarios WHERE email = '%s'", email);
    
    MYSQL_RES *result = db_execute_select(conn, query);
    if (!result) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro na consulta\"}");
    }
    
    MYSQL_ROW row = mysql_fetch_row(result);
    if (!row) {
        mysql_free_result(result);
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_UNAUTHORIZED, "application/json", 
            "{\"error\":\"Credenciais inválidas\"}");
    }
    
    int user_id = atoi(row[0]);
    const char *nome = row[1];
    const char *senha_hash = row[3];
    const char *tipo_usuario = row[4];
    int ativo = atoi(row[5]);
    
    mysql_free_result(result);
    
    // Verificar se usuário está ativo
    if (!ativo) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_UNAUTHORIZED, "application/json", 
            "{\"error\":\"Usuário inativo\"}");
    }
    
    // Verificar senha (simulado - implementar bcrypt)
    if (strcmp(password, "123456") != 0) { // Temporário para testes
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_UNAUTHORIZED, "application/json", 
            "{\"error\":\"Credenciais inválidas\"}");
    }
    
    // Gerar session ID
    char *session_id = generate_session_id();
    
    // Criar sessão no banco
    if (!db_sessao_create(conn, session_id, user_id, NULL, NULL)) {
        free(session_id);
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro ao criar sessão\"}");
    }
    
    db_disconnect(conn);
    json_object_put(json);
    
    // Criar resposta de sucesso
    json_object *response_json = json_object_new_object();
    json_object *token_obj = json_object_new_string(session_id);
    json_object *user_obj = json_object_new_object();
    json_object *user_id_obj = json_object_new_int(user_id);
    json_object *user_nome_obj = json_object_new_string(nome);
    json_object *user_email_obj = json_object_new_string(email);
    json_object *user_tipo_obj = json_object_new_string(tipo_usuario);
    
    json_object_object_add(user_obj, "id", user_id_obj);
    json_object_object_add(user_obj, "nome", user_nome_obj);
    json_object_object_add(user_obj, "email", user_email_obj);
    json_object_object_add(user_obj, "tipo", user_tipo_obj);
    
    json_object_object_add(response_json, "token", token_obj);
    json_object_object_add(response_json, "usuario", user_obj);
    
    const char *response_str = json_object_to_json_string(response_json);
    response_t *resp = create_response(HTTP_OK, "application/json", response_str);
    
    json_object_put(response_json);
    free(session_id);
    
    return resp;
}

response_t* api_auth_logout(request_data_t *req) {
    if (strcmp(req->method, "POST") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    if (!req->session_id) {
        return create_response(HTTP_UNAUTHORIZED, "application/json", 
            "{\"error\":\"Sessão não encontrada\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    db_sessao_delete(conn, req->session_id);
    db_disconnect(conn);
    
    return create_response(HTTP_OK, "application/json", 
        "{\"message\":\"Logout realizado com sucesso\"}");
}

response_t* api_auth_register(request_data_t *req) {
    if (strcmp(req->method, "POST") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Parse JSON do body
    json_object *json = json_tokener_parse(req->data);
    if (!json) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"JSON inválido\"}");
    }
    
    json_object *nome_obj, *email_obj, *password_obj;
    if (!json_object_object_get_ex(json, "nome", &nome_obj) ||
        !json_object_object_get_ex(json, "email", &email_obj) ||
        !json_object_object_get_ex(json, "password", &password_obj)) {
        json_object_put(json);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Nome, email e senha são obrigatórios\"}");
    }
    
    const char *nome = json_object_get_string(nome_obj);
    const char *email = json_object_get_string(email_obj);
    const char *password = json_object_get_string(password_obj);
    
    MYSQL *conn = db_connect();
    if (!conn) {
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    // Verificar se email já existe
    char query[512];
    snprintf(query, sizeof(query),
        "SELECT COUNT(*) FROM usuarios WHERE email = '%s'", email);
    
    MYSQL_RES *result = db_execute_select(conn, query);
    if (result) {
        MYSQL_ROW row = mysql_fetch_row(result);
        if (row && atoi(row[0]) > 0) {
            mysql_free_result(result);
            db_disconnect(conn);
            json_object_put(json);
            return create_response(HTTP_CONFLICT, "application/json", 
                "{\"error\":\"Email já cadastrado\"}");
        }
        mysql_free_result(result);
    }
    
    // Criar usuário
    usuario_t usuario = {0};
    strcpy(usuario.nome, nome);
    strcpy(usuario.email, email);
    strcpy(usuario.tipo_usuario, "comum");
    
    if (db_usuario_create(conn, &usuario)) {
        // Atualizar senha hash (simulado)
        snprintf(query, sizeof(query),
            "UPDATE usuarios SET senha_hash = '%s' WHERE id = %d",
            "hash_simulado", usuario.id); // Implementar hash real
        db_execute_query(conn, query);
        
        db_disconnect(conn);
        json_object_put(json);
        
        return create_response(HTTP_CREATED, "application/json", 
            "{\"message\":\"Usuário criado com sucesso\"}");
    }
    
    db_disconnect(conn);
    json_object_put(json);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao criar usuário\"}");
}

response_t* api_auth_profile(request_data_t *req) {
    if (strcmp(req->method, "GET") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    usuario_t usuario;
    if (db_usuario_get_by_id(conn, req->user_id, &usuario)) {
        db_disconnect(conn);
        
        json_object *user_obj = usuario_to_json(&usuario);
        const char *response_str = json_object_to_json_string(user_obj);
        response_t *resp = create_response(HTTP_OK, "application/json", response_str);
        
        json_object_put(user_obj);
        return resp;
    }
    
    db_disconnect(conn);
    return create_response(HTTP_NOT_FOUND, "application/json", 
        "{\"error\":\"Usuário não encontrado\"}");
}

// Funções utilitárias
response_t* create_response(int status_code, const char *content_type, const char *body) {
    response_t *response = malloc(sizeof(response_t));
    response->status_code = status_code;
    response->content_type = strdup(content_type);
    response->body = strdup(body);
    response->body_size = strlen(body);
    return response;
}

void free_response(response_t *response) {
    if (response) {
        if (response->content_type) free(response->content_type);
        if (response->body) free(response->body);
        free(response);
    }
}

char* generate_session_id(void) {
    char *session_id = malloc(37);
    srand(time(NULL));
    
    snprintf(session_id, 37, "%08x-%04x-%04x-%04x-%012x",
             rand(), rand() & 0xFFFF, rand() & 0xFFFF,
             rand() & 0xFFFF, rand());
    
    return session_id;
}

int validate_session(const char *session_id, int *user_id, char *user_type) {
    MYSQL *conn = db_connect();
    if (!conn) return 0;
    
    int result = db_sessao_validate(conn, session_id, user_id);
    
    if (result) {
        // Buscar tipo do usuário
        char query[256];
        snprintf(query, sizeof(query),
            "SELECT tipo_usuario FROM usuarios WHERE id = %d", *user_id);
        
        MYSQL_RES *res = db_execute_select(conn, query);
        if (res) {
            MYSQL_ROW row = mysql_fetch_row(res);
            if (row) {
                strcpy(user_type, row[0]);
            }
            mysql_free_result(res);
        }
    }
    
    db_disconnect(conn);
    return result;
}

// Conversão de estruturas para JSON
json_object* usuario_to_json(usuario_t *usuario) {
    json_object *json = json_object_new_object();
    
    json_object_object_add(json, "id", json_object_new_int(usuario->id));
    json_object_object_add(json, "nome", json_object_new_string(usuario->nome));
    json_object_object_add(json, "email", json_object_new_string(usuario->email));
    json_object_object_add(json, "telefone", json_object_new_string(usuario->telefone));
    json_object_object_add(json, "departamento", json_object_new_string(usuario->departamento));
    json_object_object_add(json, "tipo_usuario", json_object_new_string(usuario->tipo_usuario));
    json_object_object_add(json, "ativo", json_object_new_boolean(usuario->ativo));
    json_object_object_add(json, "data_criacao", json_object_new_string(usuario->data_criacao));
    json_object_object_add(json, "data_atualizacao", json_object_new_string(usuario->data_atualizacao));
    
    return json;
}

json_object* sala_to_json(sala_t *sala) {
    json_object *json = json_object_new_object();
    
    json_object_object_add(json, "id", json_object_new_int(sala->id));
    json_object_object_add(json, "nome", json_object_new_string(sala->nome));
    json_object_object_add(json, "descricao", json_object_new_string(sala->descricao));
    json_object_object_add(json, "capacidade", json_object_new_int(sala->capacidade));
    json_object_object_add(json, "localizacao", json_object_new_string(sala->localizacao));
    
    // Parse recursos JSON
    json_object *recursos_obj = json_tokener_parse(sala->recursos);
    if (recursos_obj) {
        json_object_object_add(json, "recursos", recursos_obj);
    } else {
        json_object_object_add(json, "recursos", json_object_new_object());
    }
    
    json_object_object_add(json, "ativa", json_object_new_boolean(sala->ativa));
    json_object_object_add(json, "data_criacao", json_object_new_string(sala->data_criacao));
    json_object_object_add(json, "data_atualizacao", json_object_new_string(sala->data_atualizacao));
    
    return json;
}
