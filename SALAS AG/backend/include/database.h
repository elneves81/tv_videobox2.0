#ifndef DATABASE_H
#define DATABASE_H

#include <mysql/mysql.h>
#include <json-c/json.h>

// Estruturas de dados
typedef struct {
    int id;
    char nome[101];
    char email[151];
    char telefone[21];
    char departamento[101];
    char tipo_usuario[10];
    int ativo;
    char data_criacao[20];
    char data_atualizacao[20];
} usuario_t;

typedef struct {
    int id;
    char nome[101];
    char descricao[1001];
    int capacidade;
    char localizacao[201];
    char recursos[1001]; // JSON string
    int ativa;
    char data_criacao[20];
    char data_atualizacao[20];
} sala_t;

typedef struct {
    int id;
    int sala_id;
    int usuario_id;
    char titulo[201];
    char descricao[1001];
    char data_inicio[20];
    char data_fim[20];
    char status[15];
    char observacoes[1001];
    char data_criacao[20];
    char data_atualizacao[20];
} agendamento_t;

typedef struct {
    int id;
    int agendamento_id;
    int usuario_id;
    int confirmado;
    char data_confirmacao[20];
} participante_t;

// Funções de usuários
int db_usuario_create(MYSQL *conn, usuario_t *usuario);
int db_usuario_get_by_id(MYSQL *conn, int id, usuario_t *usuario);
int db_usuario_get_by_email(MYSQL *conn, const char *email, usuario_t *usuario);
int db_usuario_update(MYSQL *conn, int id, usuario_t *usuario);
int db_usuario_delete(MYSQL *conn, int id);
MYSQL_RES* db_usuarios_list(MYSQL *conn, int limit, int offset);

// Funções de salas
int db_sala_create(MYSQL *conn, sala_t *sala);
int db_sala_get_by_id(MYSQL *conn, int id, sala_t *sala);
int db_sala_update(MYSQL *conn, int id, sala_t *sala);
int db_sala_delete(MYSQL *conn, int id);
MYSQL_RES* db_salas_list(MYSQL *conn, int limit, int offset);
MYSQL_RES* db_salas_disponiveis(MYSQL *conn, const char *data_inicio, const char *data_fim);

// Funções de agendamentos
int db_agendamento_create(MYSQL *conn, agendamento_t *agendamento);
int db_agendamento_get_by_id(MYSQL *conn, int id, agendamento_t *agendamento);
int db_agendamento_update(MYSQL *conn, int id, agendamento_t *agendamento);
int db_agendamento_delete(MYSQL *conn, int id);
MYSQL_RES* db_agendamentos_list(MYSQL *conn, int limit, int offset);
MYSQL_RES* db_agendamentos_by_usuario(MYSQL *conn, int usuario_id);
MYSQL_RES* db_agendamentos_by_sala(MYSQL *conn, int sala_id);
int db_agendamento_check_conflict(MYSQL *conn, int sala_id, const char *data_inicio, 
                                  const char *data_fim, int agendamento_id);

// Funções de participantes
int db_participante_add(MYSQL *conn, int agendamento_id, int usuario_id);
int db_participante_remove(MYSQL *conn, int agendamento_id, int usuario_id);
int db_participante_confirm(MYSQL *conn, int agendamento_id, int usuario_id);
MYSQL_RES* db_participantes_by_agendamento(MYSQL *conn, int agendamento_id);

// Funções de sessão
int db_sessao_create(MYSQL *conn, const char *session_id, int usuario_id, 
                     const char *ip_address, const char *user_agent);
int db_sessao_validate(MYSQL *conn, const char *session_id, int *usuario_id);
int db_sessao_delete(MYSQL *conn, const char *session_id);
int db_sessao_cleanup_expired(MYSQL *conn);

// Funções de auditoria
int db_log_auditoria(MYSQL *conn, int usuario_id, const char *acao, 
                     const char *tabela, int registro_id, const char *dados_anteriores, 
                     const char *dados_novos, const char *ip_address);

// Funções utilitárias
json_object* usuario_to_json(usuario_t *usuario);
json_object* sala_to_json(sala_t *sala);
json_object* agendamento_to_json(agendamento_t *agendamento);
int json_to_usuario(json_object *json, usuario_t *usuario);
int json_to_sala(json_object *json, sala_t *sala);
int json_to_agendamento(json_object *json, agendamento_t *agendamento);

#endif // DATABASE_H
