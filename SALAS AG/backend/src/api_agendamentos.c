#include "../include/server.h"
#include "../include/database.h"

// ===== APIs DE AGENDAMENTOS =====

response_t* api_agendamentos_list(request_data_t *req) {
    if (strcmp(req->method, "GET") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    MYSQL_RES *result;
    
    // Admins veem todos os agendamentos, usuários comuns apenas os seus
    if (strcmp(req->user_type, "admin") == 0) {
        result = db_agendamentos_list(conn, 100, 0);
    } else {
        result = db_agendamentos_by_usuario(conn, req->user_id);
    }
    
    if (!result) {
        db_disconnect(conn);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro na consulta\"}");
    }
    
    json_object *agendamentos_array = json_object_new_array();
    MYSQL_ROW row;
    
    while ((row = mysql_fetch_row(result))) {
        json_object *agendamento_obj = json_object_new_object();
        
        json_object_object_add(agendamento_obj, "id", json_object_new_int(atoi(row[0])));
        json_object_object_add(agendamento_obj, "sala_id", json_object_new_int(atoi(row[1])));
        json_object_object_add(agendamento_obj, "usuario_id", json_object_new_int(atoi(row[2])));
        json_object_object_add(agendamento_obj, "titulo", json_object_new_string(row[3] ? row[3] : ""));
        json_object_object_add(agendamento_obj, "descricao", json_object_new_string(row[4] ? row[4] : ""));
        json_object_object_add(agendamento_obj, "data_inicio", json_object_new_string(row[5] ? row[5] : ""));
        json_object_object_add(agendamento_obj, "data_fim", json_object_new_string(row[6] ? row[6] : ""));
        json_object_object_add(agendamento_obj, "status", json_object_new_string(row[7] ? row[7] : ""));
        json_object_object_add(agendamento_obj, "observacoes", json_object_new_string(row[8] ? row[8] : ""));
        json_object_object_add(agendamento_obj, "data_criacao", json_object_new_string(row[9] ? row[9] : ""));
        json_object_object_add(agendamento_obj, "data_atualizacao", json_object_new_string(row[10] ? row[10] : ""));
        
        // Adicionar informações extras se disponíveis (sala_nome, usuario_nome)
        if (mysql_num_fields(result) > 11) {
            json_object_object_add(agendamento_obj, "sala_nome", json_object_new_string(row[11] ? row[11] : ""));
            if (mysql_num_fields(result) > 12) {
                json_object_object_add(agendamento_obj, "usuario_nome", json_object_new_string(row[12] ? row[12] : ""));
            }
        }
        
        json_object_array_add(agendamentos_array, agendamento_obj);
    }
    
    mysql_free_result(result);
    db_disconnect(conn);
    
    json_object *response_json = json_object_new_object();
    json_object_object_add(response_json, "agendamentos", agendamentos_array);
    json_object_object_add(response_json, "total", json_object_new_int(json_object_array_length(agendamentos_array)));
    
    const char *response_str = json_object_to_json_string(response_json);
    response_t *resp = create_response(HTTP_OK, "application/json", response_str);
    
    json_object_put(response_json);
    return resp;
}

response_t* api_agendamentos_get(request_data_t *req, int id) {
    if (strcmp(req->method, "GET") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    agendamento_t agendamento;
    if (db_agendamento_get_by_id(conn, id, &agendamento)) {
        // Verificar se o usuário tem permissão para ver este agendamento
        if (strcmp(req->user_type, "admin") != 0 && req->user_id != agendamento.usuario_id) {
            db_disconnect(conn);
            return create_response(HTTP_FORBIDDEN, "application/json", 
                "{\"error\":\"Acesso negado\"}");
        }
        
        db_disconnect(conn);
        
        json_object *agendamento_obj = agendamento_to_json(&agendamento);
        const char *response_str = json_object_to_json_string(agendamento_obj);
        response_t *resp = create_response(HTTP_OK, "application/json", response_str);
        
        json_object_put(agendamento_obj);
        return resp;
    }
    
    db_disconnect(conn);
    return create_response(HTTP_NOT_FOUND, "application/json", 
        "{\"error\":\"Agendamento não encontrado\"}");
}

response_t* api_agendamentos_create(request_data_t *req) {
    if (strcmp(req->method, "POST") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    json_object *json = json_tokener_parse(req->data);
    if (!json) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"JSON inválido\"}");
    }
    
    agendamento_t agendamento = {0};
    if (!json_to_agendamento(json, &agendamento)) {
        json_object_put(json);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Dados inválidos\"}");
    }
    
    // Definir o usuário do agendamento como o usuário logado (exceto se for admin criando para outro)
    if (strcmp(req->user_type, "admin") != 0) {
        agendamento.usuario_id = req->user_id;
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    // Verificar conflitos de agendamento
    int conflito = db_agendamento_check_conflict(conn, agendamento.sala_id, 
                                                agendamento.data_inicio, 
                                                agendamento.data_fim, 0);
    
    if (conflito > 0) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_CONFLICT, "application/json", 
            "{\"error\":\"Conflito de horário. Sala já está reservada para este período\"}");
    }
    
    if (conflito < 0) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro ao verificar conflitos\"}");
    }
    
    if (db_agendamento_create(conn, &agendamento)) {
        db_disconnect(conn);
        json_object_put(json);
        
        json_object *response_json = json_object_new_object();
        json_object_object_add(response_json, "message", json_object_new_string("Agendamento criado com sucesso"));
        json_object_object_add(response_json, "id", json_object_new_int(agendamento.id));
        
        const char *response_str = json_object_to_json_string(response_json);
        response_t *resp = create_response(HTTP_CREATED, "application/json", response_str);
        
        json_object_put(response_json);
        return resp;
    }
    
    db_disconnect(conn);
    json_object_put(json);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao criar agendamento\"}");
}

response_t* api_agendamentos_update(request_data_t *req, int id) {
    if (strcmp(req->method, "PUT") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    // Verificar se o agendamento existe e se o usuário tem permissão
    agendamento_t agendamento_existente;
    if (!db_agendamento_get_by_id(conn, id, &agendamento_existente)) {
        db_disconnect(conn);
        return create_response(HTTP_NOT_FOUND, "application/json", 
            "{\"error\":\"Agendamento não encontrado\"}");
    }
    
    if (strcmp(req->user_type, "admin") != 0 && req->user_id != agendamento_existente.usuario_id) {
        db_disconnect(conn);
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado\"}");
    }
    
    json_object *json = json_tokener_parse(req->data);
    if (!json) {
        db_disconnect(conn);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"JSON inválido\"}");
    }
    
    agendamento_t agendamento = {0};
    if (!json_to_agendamento(json, &agendamento)) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Dados inválidos\"}");
    }
    
    // Verificar conflitos de agendamento (excluindo o próprio agendamento)
    int conflito = db_agendamento_check_conflict(conn, agendamento.sala_id, 
                                                agendamento.data_inicio, 
                                                agendamento.data_fim, id);
    
    if (conflito > 0) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_CONFLICT, "application/json", 
            "{\"error\":\"Conflito de horário. Sala já está reservada para este período\"}");
    }
    
    if (db_agendamento_update(conn, id, &agendamento)) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_OK, "application/json", 
            "{\"message\":\"Agendamento atualizado com sucesso\"}");
    }
    
    db_disconnect(conn);
    json_object_put(json);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao atualizar agendamento\"}");
}

response_t* api_agendamentos_delete(request_data_t *req, int id) {
    if (strcmp(req->method, "DELETE") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    // Verificar se o agendamento existe e se o usuário tem permissão
    agendamento_t agendamento;
    if (!db_agendamento_get_by_id(conn, id, &agendamento)) {
        db_disconnect(conn);
        return create_response(HTTP_NOT_FOUND, "application/json", 
            "{\"error\":\"Agendamento não encontrado\"}");
    }
    
    if (strcmp(req->user_type, "admin") != 0 && req->user_id != agendamento.usuario_id) {
        db_disconnect(conn);
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado\"}");
    }
    
    if (db_agendamento_delete(conn, id)) {
        db_disconnect(conn);
        return create_response(HTTP_OK, "application/json", 
            "{\"message\":\"Agendamento cancelado com sucesso\"}");
    }
    
    db_disconnect(conn);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao cancelar agendamento\"}");
}

response_t* api_agendamentos_check_conflict(request_data_t *req) {
    if (strcmp(req->method, "POST") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    json_object *json = json_tokener_parse(req->data);
    if (!json) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"JSON inválido\"}");
    }
    
    json_object *sala_id_obj, *data_inicio_obj, *data_fim_obj, *agendamento_id_obj;
    
    if (!json_object_object_get_ex(json, "sala_id", &sala_id_obj) ||
        !json_object_object_get_ex(json, "data_inicio", &data_inicio_obj) ||
        !json_object_object_get_ex(json, "data_fim", &data_fim_obj)) {
        json_object_put(json);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Parâmetros obrigatórios: sala_id, data_inicio, data_fim\"}");
    }
    
    int sala_id = json_object_get_int(sala_id_obj);
    const char *data_inicio = json_object_get_string(data_inicio_obj);
    const char *data_fim = json_object_get_string(data_fim_obj);
    
    int agendamento_id = 0; // Para verificação de conflito em atualizações
    if (json_object_object_get_ex(json, "agendamento_id", &agendamento_id_obj)) {
        agendamento_id = json_object_get_int(agendamento_id_obj);
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    int conflito = db_agendamento_check_conflict(conn, sala_id, data_inicio, data_fim, agendamento_id);
    db_disconnect(conn);
    json_object_put(json);
    
    if (conflito < 0) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro ao verificar conflitos\"}");
    }
    
    json_object *response_json = json_object_new_object();
    json_object_object_add(response_json, "conflito", json_object_new_boolean(conflito > 0));
    json_object_object_add(response_json, "total_conflitos", json_object_new_int(conflito));
    
    const char *response_str = json_object_to_json_string(response_json);
    response_t *resp = create_response(HTTP_OK, "application/json", response_str);
    
    json_object_put(response_json);
    return resp;
}

// Função para converter JSON para agendamento
json_object* agendamento_to_json(agendamento_t *agendamento) {
    json_object *json = json_object_new_object();
    
    json_object_object_add(json, "id", json_object_new_int(agendamento->id));
    json_object_object_add(json, "sala_id", json_object_new_int(agendamento->sala_id));
    json_object_object_add(json, "usuario_id", json_object_new_int(agendamento->usuario_id));
    json_object_object_add(json, "titulo", json_object_new_string(agendamento->titulo));
    json_object_object_add(json, "descricao", json_object_new_string(agendamento->descricao));
    json_object_object_add(json, "data_inicio", json_object_new_string(agendamento->data_inicio));
    json_object_object_add(json, "data_fim", json_object_new_string(agendamento->data_fim));
    json_object_object_add(json, "status", json_object_new_string(agendamento->status));
    json_object_object_add(json, "observacoes", json_object_new_string(agendamento->observacoes));
    json_object_object_add(json, "data_criacao", json_object_new_string(agendamento->data_criacao));
    json_object_object_add(json, "data_atualizacao", json_object_new_string(agendamento->data_atualizacao));
    
    return json;
}

// Funções auxiliares para conversão JSON
int json_to_usuario(json_object *json, usuario_t *usuario) {
    json_object *obj;
    
    if (json_object_object_get_ex(json, "nome", &obj)) {
        const char *nome = json_object_get_string(obj);
        if (strlen(nome) > 100) return 0;
        strcpy(usuario->nome, nome);
    }
    
    if (json_object_object_get_ex(json, "email", &obj)) {
        const char *email = json_object_get_string(obj);
        if (strlen(email) > 150) return 0;
        strcpy(usuario->email, email);
    }
    
    if (json_object_object_get_ex(json, "telefone", &obj)) {
        const char *telefone = json_object_get_string(obj);
        if (strlen(telefone) > 20) return 0;
        strcpy(usuario->telefone, telefone);
    }
    
    if (json_object_object_get_ex(json, "departamento", &obj)) {
        const char *departamento = json_object_get_string(obj);
        if (strlen(departamento) > 100) return 0;
        strcpy(usuario->departamento, departamento);
    }
    
    if (json_object_object_get_ex(json, "tipo_usuario", &obj)) {
        const char *tipo = json_object_get_string(obj);
        if (strcmp(tipo, "admin") != 0 && strcmp(tipo, "comum") != 0) return 0;
        strcpy(usuario->tipo_usuario, tipo);
    }
    
    return 1;
}

int json_to_sala(json_object *json, sala_t *sala) {
    json_object *obj;
    
    if (json_object_object_get_ex(json, "nome", &obj)) {
        const char *nome = json_object_get_string(obj);
        if (strlen(nome) > 100) return 0;
        strcpy(sala->nome, nome);
    }
    
    if (json_object_object_get_ex(json, "descricao", &obj)) {
        const char *descricao = json_object_get_string(obj);
        if (strlen(descricao) > 1000) return 0;
        strcpy(sala->descricao, descricao);
    }
    
    if (json_object_object_get_ex(json, "capacidade", &obj)) {
        sala->capacidade = json_object_get_int(obj);
        if (sala->capacidade <= 0) return 0;
    }
    
    if (json_object_object_get_ex(json, "localizacao", &obj)) {
        const char *localizacao = json_object_get_string(obj);
        if (strlen(localizacao) > 200) return 0;
        strcpy(sala->localizacao, localizacao);
    }
    
    if (json_object_object_get_ex(json, "recursos", &obj)) {
        const char *recursos = json_object_to_json_string(obj);
        if (strlen(recursos) > 1000) return 0;
        strcpy(sala->recursos, recursos);
    }
    
    return 1;
}

int json_to_agendamento(json_object *json, agendamento_t *agendamento) {
    json_object *obj;
    
    if (json_object_object_get_ex(json, "sala_id", &obj)) {
        agendamento->sala_id = json_object_get_int(obj);
        if (agendamento->sala_id <= 0) return 0;
    }
    
    if (json_object_object_get_ex(json, "usuario_id", &obj)) {
        agendamento->usuario_id = json_object_get_int(obj);
    }
    
    if (json_object_object_get_ex(json, "titulo", &obj)) {
        const char *titulo = json_object_get_string(obj);
        if (strlen(titulo) > 200) return 0;
        strcpy(agendamento->titulo, titulo);
    }
    
    if (json_object_object_get_ex(json, "descricao", &obj)) {
        const char *descricao = json_object_get_string(obj);
        if (strlen(descricao) > 1000) return 0;
        strcpy(agendamento->descricao, descricao);
    }
    
    if (json_object_object_get_ex(json, "data_inicio", &obj)) {
        const char *data_inicio = json_object_get_string(obj);
        if (strlen(data_inicio) > 19) return 0;
        strcpy(agendamento->data_inicio, data_inicio);
    }
    
    if (json_object_object_get_ex(json, "data_fim", &obj)) {
        const char *data_fim = json_object_get_string(obj);
        if (strlen(data_fim) > 19) return 0;
        strcpy(agendamento->data_fim, data_fim);
    }
    
    if (json_object_object_get_ex(json, "observacoes", &obj)) {
        const char *observacoes = json_object_get_string(obj);
        if (strlen(observacoes) > 1000) return 0;
        strcpy(agendamento->observacoes, observacoes);
    }
    
    // Status padrão
    strcpy(agendamento->status, "agendado");
    
    return 1;
}
