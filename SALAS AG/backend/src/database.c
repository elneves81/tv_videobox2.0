#include "../include/server.h"
#include "../include/database.h"

MYSQL* db_connect(void) {
    MYSQL *conn = mysql_init(NULL);
    
    if (!conn) {
        fprintf(stderr, "mysql_init() falhou\n");
        return NULL;
    }
    
    if (!mysql_real_connect(conn, 
                           db_config.host, 
                           db_config.user, 
                           db_config.password, 
                           db_config.database, 
                           db_config.port, 
                           NULL, 0)) {
        fprintf(stderr, "Erro de conexão: %s\n", mysql_error(conn));
        mysql_close(conn);
        return NULL;
    }
    
    // Configurar charset UTF-8
    mysql_set_character_set(conn, "utf8mb4");
    
    return conn;
}

void db_disconnect(MYSQL *conn) {
    if (conn) {
        mysql_close(conn);
    }
}

int db_execute_query(MYSQL *conn, const char *query) {
    if (mysql_query(conn, query)) {
        fprintf(stderr, "Erro na query: %s\n", mysql_error(conn));
        return -1;
    }
    return mysql_affected_rows(conn);
}

MYSQL_RES* db_execute_select(MYSQL *conn, const char *query) {
    if (mysql_query(conn, query)) {
        fprintf(stderr, "Erro na query: %s\n", mysql_error(conn));
        return NULL;
    }
    return mysql_store_result(conn);
}

// Funções de usuários
int db_usuario_create(MYSQL *conn, usuario_t *usuario) {
    char query[2048];
    snprintf(query, sizeof(query),
        "INSERT INTO usuarios (nome, email, senha_hash, telefone, departamento, tipo_usuario) "
        "VALUES ('%s', '%s', '%s', '%s', '%s', '%s')",
        usuario->nome, usuario->email, "", // senha_hash será preenchida externamente
        usuario->telefone, usuario->departamento, usuario->tipo_usuario);
    
    if (db_execute_query(conn, query) > 0) {
        usuario->id = mysql_insert_id(conn);
        return 1;
    }
    return 0;
}

int db_usuario_get_by_id(MYSQL *conn, int id, usuario_t *usuario) {
    char query[512];
    snprintf(query, sizeof(query),
        "SELECT id, nome, email, telefone, departamento, tipo_usuario, ativo, "
        "DATE_FORMAT(data_criacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_criacao, "
        "DATE_FORMAT(data_atualizacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_atualizacao "
        "FROM usuarios WHERE id = %d", id);
    
    MYSQL_RES *result = db_execute_select(conn, query);
    if (!result) return 0;
    
    MYSQL_ROW row = mysql_fetch_row(result);
    if (row) {
        usuario->id = atoi(row[0]);
        strcpy(usuario->nome, row[1] ? row[1] : "");
        strcpy(usuario->email, row[2] ? row[2] : "");
        strcpy(usuario->telefone, row[3] ? row[3] : "");
        strcpy(usuario->departamento, row[4] ? row[4] : "");
        strcpy(usuario->tipo_usuario, row[5] ? row[5] : "");
        usuario->ativo = atoi(row[6]);
        strcpy(usuario->data_criacao, row[7] ? row[7] : "");
        strcpy(usuario->data_atualizacao, row[8] ? row[8] : "");
        
        mysql_free_result(result);
        return 1;
    }
    
    mysql_free_result(result);
    return 0;
}

int db_usuario_get_by_email(MYSQL *conn, const char *email, usuario_t *usuario) {
    char query[512];
    snprintf(query, sizeof(query),
        "SELECT id, nome, email, telefone, departamento, tipo_usuario, ativo, "
        "DATE_FORMAT(data_criacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_criacao, "
        "DATE_FORMAT(data_atualizacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_atualizacao "
        "FROM usuarios WHERE email = '%s'", email);
    
    MYSQL_RES *result = db_execute_select(conn, query);
    if (!result) return 0;
    
    MYSQL_ROW row = mysql_fetch_row(result);
    if (row) {
        usuario->id = atoi(row[0]);
        strcpy(usuario->nome, row[1] ? row[1] : "");
        strcpy(usuario->email, row[2] ? row[2] : "");
        strcpy(usuario->telefone, row[3] ? row[3] : "");
        strcpy(usuario->departamento, row[4] ? row[4] : "");
        strcpy(usuario->tipo_usuario, row[5] ? row[5] : "");
        usuario->ativo = atoi(row[6]);
        strcpy(usuario->data_criacao, row[7] ? row[7] : "");
        strcpy(usuario->data_atualizacao, row[8] ? row[8] : "");
        
        mysql_free_result(result);
        return 1;
    }
    
    mysql_free_result(result);
    return 0;
}

MYSQL_RES* db_usuarios_list(MYSQL *conn, int limit, int offset) {
    char query[512];
    snprintf(query, sizeof(query),
        "SELECT id, nome, email, telefone, departamento, tipo_usuario, ativo, "
        "DATE_FORMAT(data_criacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_criacao, "
        "DATE_FORMAT(data_atualizacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_atualizacao "
        "FROM usuarios ORDER BY nome LIMIT %d OFFSET %d", limit, offset);
    
    return db_execute_select(conn, query);
}

// Funções de salas
int db_sala_create(MYSQL *conn, sala_t *sala) {
    char query[2048];
    snprintf(query, sizeof(query),
        "INSERT INTO salas (nome, descricao, capacidade, localizacao, recursos) "
        "VALUES ('%s', '%s', %d, '%s', '%s')",
        sala->nome, sala->descricao, sala->capacidade, 
        sala->localizacao, sala->recursos);
    
    if (db_execute_query(conn, query) > 0) {
        sala->id = mysql_insert_id(conn);
        return 1;
    }
    return 0;
}

int db_sala_get_by_id(MYSQL *conn, int id, sala_t *sala) {
    char query[512];
    snprintf(query, sizeof(query),
        "SELECT id, nome, descricao, capacidade, localizacao, recursos, ativa, "
        "DATE_FORMAT(data_criacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_criacao, "
        "DATE_FORMAT(data_atualizacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_atualizacao "
        "FROM salas WHERE id = %d", id);
    
    MYSQL_RES *result = db_execute_select(conn, query);
    if (!result) return 0;
    
    MYSQL_ROW row = mysql_fetch_row(result);
    if (row) {
        sala->id = atoi(row[0]);
        strcpy(sala->nome, row[1] ? row[1] : "");
        strcpy(sala->descricao, row[2] ? row[2] : "");
        sala->capacidade = atoi(row[3]);
        strcpy(sala->localizacao, row[4] ? row[4] : "");
        strcpy(sala->recursos, row[5] ? row[5] : "");
        sala->ativa = atoi(row[6]);
        strcpy(sala->data_criacao, row[7] ? row[7] : "");
        strcpy(sala->data_atualizacao, row[8] ? row[8] : "");
        
        mysql_free_result(result);
        return 1;
    }
    
    mysql_free_result(result);
    return 0;
}

MYSQL_RES* db_salas_list(MYSQL *conn, int limit, int offset) {
    char query[512];
    snprintf(query, sizeof(query),
        "SELECT id, nome, descricao, capacidade, localizacao, recursos, ativa, "
        "DATE_FORMAT(data_criacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_criacao, "
        "DATE_FORMAT(data_atualizacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_atualizacao "
        "FROM salas WHERE ativa = 1 ORDER BY nome LIMIT %d OFFSET %d", limit, offset);
    
    return db_execute_select(conn, query);
}

// Funções de agendamentos
int db_agendamento_create(MYSQL *conn, agendamento_t *agendamento) {
    char query[2048];
    snprintf(query, sizeof(query),
        "INSERT INTO agendamentos (sala_id, usuario_id, titulo, descricao, data_inicio, data_fim, observacoes) "
        "VALUES (%d, %d, '%s', '%s', '%s', '%s', '%s')",
        agendamento->sala_id, agendamento->usuario_id, agendamento->titulo,
        agendamento->descricao, agendamento->data_inicio, agendamento->data_fim,
        agendamento->observacoes);
    
    if (db_execute_query(conn, query) > 0) {
        agendamento->id = mysql_insert_id(conn);
        return 1;
    }
    return 0;
}

int db_agendamento_check_conflict(MYSQL *conn, int sala_id, const char *data_inicio, 
                                  const char *data_fim, int agendamento_id) {
    char query[1024];
    snprintf(query, sizeof(query),
        "SELECT COUNT(*) FROM agendamentos "
        "WHERE sala_id = %d AND status IN ('agendado', 'confirmado') "
        "AND (%d = 0 OR id != %d) "
        "AND (('%s' <= data_inicio AND '%s' > data_inicio) OR "
        "     ('%s' < data_fim AND '%s' >= data_fim) OR "
        "     ('%s' >= data_inicio AND '%s' <= data_fim))",
        sala_id, agendamento_id, agendamento_id,
        data_inicio, data_fim, data_inicio, data_fim,
        data_inicio, data_fim);
    
    MYSQL_RES *result = db_execute_select(conn, query);
    if (!result) return -1;
    
    MYSQL_ROW row = mysql_fetch_row(result);
    int count = row ? atoi(row[0]) : -1;
    mysql_free_result(result);
    
    return count;
}

int db_agendamento_get_by_id(MYSQL *conn, int id, agendamento_t *agendamento) {
    char query[512];
    snprintf(query, sizeof(query),
        "SELECT id, sala_id, usuario_id, titulo, descricao, "
        "DATE_FORMAT(data_inicio, '%%Y-%%m-%%d %%H:%%i:%%s') as data_inicio, "
        "DATE_FORMAT(data_fim, '%%Y-%%m-%%d %%H:%%i:%%s') as data_fim, "
        "status, observacoes, "
        "DATE_FORMAT(data_criacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_criacao, "
        "DATE_FORMAT(data_atualizacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_atualizacao "
        "FROM agendamentos WHERE id = %d", id);
    
    MYSQL_RES *result = db_execute_select(conn, query);
    if (!result) return 0;
    
    MYSQL_ROW row = mysql_fetch_row(result);
    if (row) {
        agendamento->id = atoi(row[0]);
        agendamento->sala_id = atoi(row[1]);
        agendamento->usuario_id = atoi(row[2]);
        strcpy(agendamento->titulo, row[3] ? row[3] : "");
        strcpy(agendamento->descricao, row[4] ? row[4] : "");
        strcpy(agendamento->data_inicio, row[5] ? row[5] : "");
        strcpy(agendamento->data_fim, row[6] ? row[6] : "");
        strcpy(agendamento->status, row[7] ? row[7] : "");
        strcpy(agendamento->observacoes, row[8] ? row[8] : "");
        strcpy(agendamento->data_criacao, row[9] ? row[9] : "");
        strcpy(agendamento->data_atualizacao, row[10] ? row[10] : "");
        
        mysql_free_result(result);
        return 1;
    }
    
    mysql_free_result(result);
    return 0;
}

int db_agendamento_update(MYSQL *conn, int id, agendamento_t *agendamento) {
    char query[2048];
    snprintf(query, sizeof(query),
        "UPDATE agendamentos SET titulo = '%s', descricao = '%s', "
        "data_inicio = '%s', data_fim = '%s', observacoes = '%s' "
        "WHERE id = %d",
        agendamento->titulo, agendamento->descricao,
        agendamento->data_inicio, agendamento->data_fim,
        agendamento->observacoes, id);
    
    return db_execute_query(conn, query) > 0 ? 1 : 0;
}

int db_agendamento_delete(MYSQL *conn, int id) {
    char query[256];
    snprintf(query, sizeof(query),
        "UPDATE agendamentos SET status = 'cancelado' WHERE id = %d", id);
    
    return db_execute_query(conn, query) > 0 ? 1 : 0;
}

int db_usuario_update(MYSQL *conn, int id, usuario_t *usuario) {
    char query[2048];
    snprintf(query, sizeof(query),
        "UPDATE usuarios SET nome = '%s', telefone = '%s', "
        "departamento = '%s', tipo_usuario = '%s' WHERE id = %d",
        usuario->nome, usuario->telefone, usuario->departamento,
        usuario->tipo_usuario, id);
    
    return db_execute_query(conn, query) > 0 ? 1 : 0;
}

int db_usuario_delete(MYSQL *conn, int id) {
    char query[256];
    snprintf(query, sizeof(query),
        "UPDATE usuarios SET ativo = 0 WHERE id = %d", id);
    
    return db_execute_query(conn, query) > 0 ? 1 : 0;
}

int db_sala_update(MYSQL *conn, int id, sala_t *sala) {
    char query[2048];
    snprintf(query, sizeof(query),
        "UPDATE salas SET nome = '%s', descricao = '%s', capacidade = %d, "
        "localizacao = '%s', recursos = '%s' WHERE id = %d",
        sala->nome, sala->descricao, sala->capacidade,
        sala->localizacao, sala->recursos, id);
    
    return db_execute_query(conn, query) > 0 ? 1 : 0;
}

int db_sala_delete(MYSQL *conn, int id) {
    char query[256];
    snprintf(query, sizeof(query),
        "UPDATE salas SET ativa = 0 WHERE id = %d", id);
    
    return db_execute_query(conn, query) > 0 ? 1 : 0;
}

MYSQL_RES* db_agendamentos_list(MYSQL *conn, int limit, int offset) {
    char query[1024];
    snprintf(query, sizeof(query),
        "SELECT a.id, a.sala_id, a.usuario_id, a.titulo, a.descricao, "
        "DATE_FORMAT(a.data_inicio, '%%Y-%%m-%%d %%H:%%i:%%s') as data_inicio, "
        "DATE_FORMAT(a.data_fim, '%%Y-%%m-%%d %%H:%%i:%%s') as data_fim, "
        "a.status, a.observacoes, "
        "DATE_FORMAT(a.data_criacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_criacao, "
        "DATE_FORMAT(a.data_atualizacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_atualizacao, "
        "s.nome as sala_nome, u.nome as usuario_nome "
        "FROM agendamentos a "
        "JOIN salas s ON a.sala_id = s.id "
        "JOIN usuarios u ON a.usuario_id = u.id "
        "ORDER BY a.data_inicio DESC LIMIT %d OFFSET %d", limit, offset);
    
    return db_execute_select(conn, query);
}

MYSQL_RES* db_agendamentos_by_usuario(MYSQL *conn, int usuario_id) {
    char query[1024];
    snprintf(query, sizeof(query),
        "SELECT a.id, a.sala_id, a.usuario_id, a.titulo, a.descricao, "
        "DATE_FORMAT(a.data_inicio, '%%Y-%%m-%%d %%H:%%i:%%s') as data_inicio, "
        "DATE_FORMAT(a.data_fim, '%%Y-%%m-%%d %%H:%%i:%%s') as data_fim, "
        "a.status, a.observacoes, "
        "DATE_FORMAT(a.data_criacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_criacao, "
        "DATE_FORMAT(a.data_atualizacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_atualizacao, "
        "s.nome as sala_nome "
        "FROM agendamentos a "
        "JOIN salas s ON a.sala_id = s.id "
        "WHERE a.usuario_id = %d "
        "ORDER BY a.data_inicio DESC", usuario_id);
    
    return db_execute_select(conn, query);
}

MYSQL_RES* db_agendamentos_by_sala(MYSQL *conn, int sala_id) {
    char query[1024];
    snprintf(query, sizeof(query),
        "SELECT a.id, a.sala_id, a.usuario_id, a.titulo, a.descricao, "
        "DATE_FORMAT(a.data_inicio, '%%Y-%%m-%%d %%H:%%i:%%s') as data_inicio, "
        "DATE_FORMAT(a.data_fim, '%%Y-%%m-%%d %%H:%%i:%%s') as data_fim, "
        "a.status, a.observacoes, "
        "DATE_FORMAT(a.data_criacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_criacao, "
        "DATE_FORMAT(a.data_atualizacao, '%%Y-%%m-%%d %%H:%%i:%%s') as data_atualizacao, "
        "u.nome as usuario_nome "
        "FROM agendamentos a "
        "JOIN usuarios u ON a.usuario_id = u.id "
        "WHERE a.sala_id = %d "
        "ORDER BY a.data_inicio", sala_id);
    
    return db_execute_select(conn, query);
}

// Funções de sessão
int db_sessao_create(MYSQL *conn, const char *session_id, int usuario_id, 
                     const char *ip_address, const char *user_agent) {
    char query[1024];
    snprintf(query, sizeof(query),
        "INSERT INTO sessoes (id, usuario_id, ip_address, user_agent, data_expiracao) "
        "VALUES ('%s', %d, '%s', '%s', DATE_ADD(NOW(), INTERVAL %d SECOND))",
        session_id, usuario_id, ip_address ? ip_address : "", 
        user_agent ? user_agent : "", SESSION_TIMEOUT);
    
    return db_execute_query(conn, query) > 0 ? 1 : 0;
}

int db_sessao_validate(MYSQL *conn, const char *session_id, int *usuario_id) {
    char query[512];
    snprintf(query, sizeof(query),
        "SELECT usuario_id FROM sessoes "
        "WHERE id = '%s' AND ativa = 1 AND data_expiracao > NOW()",
        session_id);
    
    MYSQL_RES *result = db_execute_select(conn, query);
    if (!result) return 0;
    
    MYSQL_ROW row = mysql_fetch_row(result);
    if (row) {
        *usuario_id = atoi(row[0]);
        mysql_free_result(result);
        return 1;
    }
    
    mysql_free_result(result);
    return 0;
}

int db_sessao_delete(MYSQL *conn, const char *session_id) {
    char query[256];
    snprintf(query, sizeof(query),
        "UPDATE sessoes SET ativa = 0 WHERE id = '%s'", session_id);
    
    return db_execute_query(conn, query) > 0 ? 1 : 0;
}
