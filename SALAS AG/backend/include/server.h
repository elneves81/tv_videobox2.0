#ifndef SERVER_H
#define SERVER_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <microhttpd.h>
#include <mysql/mysql.h>
#include <json-c/json.h>
#include <time.h>

// Configurações do servidor
#define SERVER_PORT 8080
#define MAX_BUFFER_SIZE 4096
#define MAX_QUERY_SIZE 2048
#define SESSION_TIMEOUT 3600 // 1 hora em segundos

// Códigos de resposta HTTP
#define HTTP_OK 200
#define HTTP_CREATED 201
#define HTTP_BAD_REQUEST 400
#define HTTP_UNAUTHORIZED 401
#define HTTP_FORBIDDEN 403
#define HTTP_NOT_FOUND 404
#define HTTP_CONFLICT 409
#define HTTP_INTERNAL_ERROR 500

// Estrutura para conexão com banco de dados
typedef struct {
    char *host;
    char *user;
    char *password;
    char *database;
    int port;
} db_config_t;

// Estrutura para dados da requisição
typedef struct {
    const char *method;
    const char *url;
    const char *data;
    size_t data_size;
    char *session_id;
    int user_id;
    char *user_type;
} request_data_t;

// Estrutura para resposta
typedef struct {
    int status_code;
    char *content_type;
    char *body;
    size_t body_size;
} response_t;

// Funções do servidor
int start_server(void);
void stop_server(void);
int answer_to_connection(void *cls, struct MHD_Connection *connection,
                        const char *url, const char *method,
                        const char *version, const char *upload_data,
                        size_t *upload_data_size, void **con_cls);

// Funções de banco de dados
MYSQL* db_connect(void);
void db_disconnect(MYSQL *conn);
int db_execute_query(MYSQL *conn, const char *query);
MYSQL_RES* db_execute_select(MYSQL *conn, const char *query);

// Funções de autenticação
int authenticate_user(const char *email, const char *password, char *session_id);
int validate_session(const char *session_id, int *user_id, char *user_type);
void logout_user(const char *session_id);
char* generate_session_id(void);

// Funções de API - Usuários
response_t* api_usuarios_list(request_data_t *req);
response_t* api_usuarios_get(request_data_t *req, int id);
response_t* api_usuarios_create(request_data_t *req);
response_t* api_usuarios_update(request_data_t *req, int id);
response_t* api_usuarios_delete(request_data_t *req, int id);

// Funções de API - Salas
response_t* api_salas_list(request_data_t *req);
response_t* api_salas_get(request_data_t *req, int id);
response_t* api_salas_create(request_data_t *req);
response_t* api_salas_update(request_data_t *req, int id);
response_t* api_salas_delete(request_data_t *req, int id);

// Funções de API - Agendamentos
response_t* api_agendamentos_list(request_data_t *req);
response_t* api_agendamentos_get(request_data_t *req, int id);
response_t* api_agendamentos_create(request_data_t *req);
response_t* api_agendamentos_update(request_data_t *req, int id);
response_t* api_agendamentos_delete(request_data_t *req, int id);
response_t* api_agendamentos_check_conflict(request_data_t *req);

// Funções de API - Autenticação
response_t* api_auth_login(request_data_t *req);
response_t* api_auth_logout(request_data_t *req);
response_t* api_auth_register(request_data_t *req);
response_t* api_auth_profile(request_data_t *req);

// Funções utilitárias
response_t* create_response(int status_code, const char *content_type, const char *body);
void free_response(response_t *response);
char* hash_password(const char *password);
int verify_password(const char *password, const char *hash);
void log_request(request_data_t *req, response_t *resp);
void handle_cors(struct MHD_Connection *connection);

// Variáveis globais
extern struct MHD_Daemon *daemon;
extern db_config_t db_config;

#endif // SERVER_H
