#include "../include/server.h"
#include "../include/database.h"

// ===== APIs DE USUÁRIOS =====

response_t* api_usuarios_list(request_data_t *req) {
    if (strcmp(req->method, "GET") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Verificar se é admin
    if (strcmp(req->user_type, "admin") != 0) {
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado. Apenas administradores\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    MYSQL_RES *result = db_usuarios_list(conn, 100, 0); // Limite de 100 usuários
    if (!result) {
        db_disconnect(conn);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro na consulta\"}");
    }
    
    json_object *usuarios_array = json_object_new_array();
    MYSQL_ROW row;
    
    while ((row = mysql_fetch_row(result))) {
        usuario_t usuario = {0};
        usuario.id = atoi(row[0]);
        strcpy(usuario.nome, row[1] ? row[1] : "");
        strcpy(usuario.email, row[2] ? row[2] : "");
        strcpy(usuario.telefone, row[3] ? row[3] : "");
        strcpy(usuario.departamento, row[4] ? row[4] : "");
        strcpy(usuario.tipo_usuario, row[5] ? row[5] : "");
        usuario.ativo = atoi(row[6]);
        strcpy(usuario.data_criacao, row[7] ? row[7] : "");
        strcpy(usuario.data_atualizacao, row[8] ? row[8] : "");
        
        json_object *user_obj = usuario_to_json(&usuario);
        json_object_array_add(usuarios_array, user_obj);
    }
    
    mysql_free_result(result);
    db_disconnect(conn);
    
    json_object *response_json = json_object_new_object();
    json_object_object_add(response_json, "usuarios", usuarios_array);
    json_object_object_add(response_json, "total", json_object_new_int(json_object_array_length(usuarios_array)));
    
    const char *response_str = json_object_to_json_string(response_json);
    response_t *resp = create_response(HTTP_OK, "application/json", response_str);
    
    json_object_put(response_json);
    return resp;
}

response_t* api_usuarios_get(request_data_t *req, int id) {
    if (strcmp(req->method, "GET") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Usuários podem ver apenas seu próprio perfil, admins podem ver qualquer um
    if (strcmp(req->user_type, "admin") != 0 && req->user_id != id) {
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    usuario_t usuario;
    if (db_usuario_get_by_id(conn, id, &usuario)) {
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

response_t* api_usuarios_create(request_data_t *req) {
    if (strcmp(req->method, "POST") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Apenas admins podem criar usuários via API
    if (strcmp(req->user_type, "admin") != 0) {
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado. Apenas administradores\"}");
    }
    
    json_object *json = json_tokener_parse(req->data);
    if (!json) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"JSON inválido\"}");
    }
    
    usuario_t usuario = {0};
    if (!json_to_usuario(json, &usuario)) {
        json_object_put(json);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Dados inválidos\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    // Verificar se email já existe
    usuario_t existing_user;
    if (db_usuario_get_by_email(conn, usuario.email, &existing_user)) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_CONFLICT, "application/json", 
            "{\"error\":\"Email já cadastrado\"}");
    }
    
    if (db_usuario_create(conn, &usuario)) {
        db_disconnect(conn);
        json_object_put(json);
        
        json_object *response_json = json_object_new_object();
        json_object_object_add(response_json, "message", json_object_new_string("Usuário criado com sucesso"));
        json_object_object_add(response_json, "id", json_object_new_int(usuario.id));
        
        const char *response_str = json_object_to_json_string(response_json);
        response_t *resp = create_response(HTTP_CREATED, "application/json", response_str);
        
        json_object_put(response_json);
        return resp;
    }
    
    db_disconnect(conn);
    json_object_put(json);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao criar usuário\"}");
}

response_t* api_usuarios_update(request_data_t *req, int id) {
    if (strcmp(req->method, "PUT") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Usuários podem atualizar apenas seu próprio perfil, admins podem atualizar qualquer um
    if (strcmp(req->user_type, "admin") != 0 && req->user_id != id) {
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado\"}");
    }
    
    json_object *json = json_tokener_parse(req->data);
    if (!json) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"JSON inválido\"}");
    }
    
    usuario_t usuario = {0};
    if (!json_to_usuario(json, &usuario)) {
        json_object_put(json);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Dados inválidos\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    if (db_usuario_update(conn, id, &usuario)) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_OK, "application/json", 
            "{\"message\":\"Usuário atualizado com sucesso\"}");
    }
    
    db_disconnect(conn);
    json_object_put(json);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao atualizar usuário\"}");
}

response_t* api_usuarios_delete(request_data_t *req, int id) {
    if (strcmp(req->method, "DELETE") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Apenas admins podem deletar usuários
    if (strcmp(req->user_type, "admin") != 0) {
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado. Apenas administradores\"}");
    }
    
    // Não permitir auto-exclusão
    if (req->user_id == id) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Não é possível excluir seu próprio usuário\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    if (db_usuario_delete(conn, id)) {
        db_disconnect(conn);
        return create_response(HTTP_OK, "application/json", 
            "{\"message\":\"Usuário excluído com sucesso\"}");
    }
    
    db_disconnect(conn);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao excluir usuário\"}");
}

// ===== APIs DE SALAS =====

response_t* api_salas_list(request_data_t *req) {
    if (strcmp(req->method, "GET") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    MYSQL_RES *result = db_salas_list(conn, 100, 0);
    if (!result) {
        db_disconnect(conn);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro na consulta\"}");
    }
    
    json_object *salas_array = json_object_new_array();
    MYSQL_ROW row;
    
    while ((row = mysql_fetch_row(result))) {
        sala_t sala = {0};
        sala.id = atoi(row[0]);
        strcpy(sala.nome, row[1] ? row[1] : "");
        strcpy(sala.descricao, row[2] ? row[2] : "");
        sala.capacidade = atoi(row[3]);
        strcpy(sala.localizacao, row[4] ? row[4] : "");
        strcpy(sala.recursos, row[5] ? row[5] : "{}");
        sala.ativa = atoi(row[6]);
        strcpy(sala.data_criacao, row[7] ? row[7] : "");
        strcpy(sala.data_atualizacao, row[8] ? row[8] : "");
        
        json_object *sala_obj = sala_to_json(&sala);
        json_object_array_add(salas_array, sala_obj);
    }
    
    mysql_free_result(result);
    db_disconnect(conn);
    
    json_object *response_json = json_object_new_object();
    json_object_object_add(response_json, "salas", salas_array);
    json_object_object_add(response_json, "total", json_object_new_int(json_object_array_length(salas_array)));
    
    const char *response_str = json_object_to_json_string(response_json);
    response_t *resp = create_response(HTTP_OK, "application/json", response_str);
    
    json_object_put(response_json);
    return resp;
}

response_t* api_salas_get(request_data_t *req, int id) {
    if (strcmp(req->method, "GET") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    sala_t sala;
    if (db_sala_get_by_id(conn, id, &sala)) {
        db_disconnect(conn);
        
        json_object *sala_obj = sala_to_json(&sala);
        const char *response_str = json_object_to_json_string(sala_obj);
        response_t *resp = create_response(HTTP_OK, "application/json", response_str);
        
        json_object_put(sala_obj);
        return resp;
    }
    
    db_disconnect(conn);
    return create_response(HTTP_NOT_FOUND, "application/json", 
        "{\"error\":\"Sala não encontrada\"}");
}

response_t* api_salas_create(request_data_t *req) {
    if (strcmp(req->method, "POST") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Apenas admins podem criar salas
    if (strcmp(req->user_type, "admin") != 0) {
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado. Apenas administradores\"}");
    }
    
    json_object *json = json_tokener_parse(req->data);
    if (!json) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"JSON inválido\"}");
    }
    
    sala_t sala = {0};
    if (!json_to_sala(json, &sala)) {
        json_object_put(json);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Dados inválidos\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    if (db_sala_create(conn, &sala)) {
        db_disconnect(conn);
        json_object_put(json);
        
        json_object *response_json = json_object_new_object();
        json_object_object_add(response_json, "message", json_object_new_string("Sala criada com sucesso"));
        json_object_object_add(response_json, "id", json_object_new_int(sala.id));
        
        const char *response_str = json_object_to_json_string(response_json);
        response_t *resp = create_response(HTTP_CREATED, "application/json", response_str);
        
        json_object_put(response_json);
        return resp;
    }
    
    db_disconnect(conn);
    json_object_put(json);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao criar sala\"}");
}

response_t* api_salas_update(request_data_t *req, int id) {
    if (strcmp(req->method, "PUT") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Apenas admins podem atualizar salas
    if (strcmp(req->user_type, "admin") != 0) {
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado. Apenas administradores\"}");
    }
    
    json_object *json = json_tokener_parse(req->data);
    if (!json) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"JSON inválido\"}");
    }
    
    sala_t sala = {0};
    if (!json_to_sala(json, &sala)) {
        json_object_put(json);
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Dados inválidos\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        json_object_put(json);
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    if (db_sala_update(conn, id, &sala)) {
        db_disconnect(conn);
        json_object_put(json);
        return create_response(HTTP_OK, "application/json", 
            "{\"message\":\"Sala atualizada com sucesso\"}");
    }
    
    db_disconnect(conn);
    json_object_put(json);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao atualizar sala\"}");
}

response_t* api_salas_delete(request_data_t *req, int id) {
    if (strcmp(req->method, "DELETE") != 0) {
        return create_response(HTTP_BAD_REQUEST, "application/json", 
            "{\"error\":\"Método não permitido\"}");
    }
    
    // Apenas admins podem deletar salas
    if (strcmp(req->user_type, "admin") != 0) {
        return create_response(HTTP_FORBIDDEN, "application/json", 
            "{\"error\":\"Acesso negado. Apenas administradores\"}");
    }
    
    MYSQL *conn = db_connect();
    if (!conn) {
        return create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro de conexão com banco de dados\"}");
    }
    
    if (db_sala_delete(conn, id)) {
        db_disconnect(conn);
        return create_response(HTTP_OK, "application/json", 
            "{\"message\":\"Sala excluída com sucesso\"}");
    }
    
    db_disconnect(conn);
    return create_response(HTTP_INTERNAL_ERROR, "application/json", 
        "{\"error\":\"Erro ao excluir sala\"}");
}
